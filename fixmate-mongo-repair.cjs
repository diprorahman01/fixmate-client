// FixMate local MongoDB SRV bypass. No passwords are printed.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const dns = require('node:dns');
const { MongoClient } = require('mongodb');

const clientEnv = path.resolve(process.cwd(), '.env.local');
const serverEnv = path.resolve(process.cwd(), '..', 'server', '.env');

function getUri(text) {
  const m = text.match(/^\s*MONGODB_URI\s*=\s*(.*?)\s*$/m);
  if (!m) throw new Error('MONGODB_URI not found');
  return m[1].replace(/^['"]|['"]$/g, '');
}
function replaceUri(text, value) {
  return text.replace(/^(\s*MONGODB_URI\s*=\s*).*$/m, (_, prefix) => prefix + value);
}
function resolveSrv(name, resolverIp) {
  const resolver = new dns.promises.Resolver();
  resolver.setServers([resolverIp]);
  return resolver.resolveSrv(name);
}
async function main() {
  if (!fs.existsSync(clientEnv)) throw new Error('Run from the fixmate-client folder; .env.local is missing');
  const originalText = fs.readFileSync(clientEnv, 'utf8');
  const originalUri = getUri(originalText);
  if (!originalUri.startsWith('mongodb+srv://')) {
    console.log('Client already uses a non-SRV MongoDB URI. No files changed.');
    return;
  }
  const parsed = new URL(originalUri);
  const srvName = `_mongodb._tcp.${parsed.hostname}`;
  let records;
  for (const ip of ['8.8.8.8', '1.1.1.1']) {
    try {
      records = await resolveSrv(srvName, ip);
      console.log(`SRV lookup succeeded using DNS ${ip}.`);
      break;
    } catch (e) {
      console.log(`DNS ${ip}: ${e.code || 'lookup failed'}`);
    }
  }
  if (!records?.length) throw new Error('Could not resolve Atlas SRV records. No files changed.');
  const hosts = records.map(r => `${r.name.replace(/\.$/, '')}:${r.port}`);
  if (hosts.some(h => !h.endsWith('.mongodb.net:27017'))) {
    throw new Error('Unexpected Atlas host or port. No files changed; use the official non-SRV URI from Atlas instead.');
  }
  const auth = parsed.username ? `${parsed.username}${parsed.password ? `:${parsed.password}` : ''}@` : '';
  const options = new URLSearchParams(parsed.search);
  if (!options.has('tls') && !options.has('ssl')) options.set('tls', 'true');
  if (!options.has('authSource')) options.set('authSource', 'admin');
  const standardUri = `mongodb://${auth}${hosts.join(',')}${parsed.pathname || '/'}?${options.toString()}`;
  const client = new MongoClient(standardUri, { serverSelectionTimeoutMS: 12000, connectTimeoutMS: 8000 });
  try {
    await client.connect();
    await client.db('fixmatedb').command({ ping: 1 });
    console.log('MongoDB direct seed-list connection: SUCCESS.');
  } catch (error) {
    console.error('MongoDB direct connection failed:', error.name, error.code || '', error.message.replace(/mongodb(?:\+srv)?:\/\/[^@\s]+@/g,'mongodb://[hidden]@'));
    console.log('No environment files have been changed.');
    process.exitCode = 1;
    return;
  } finally {
    await client.close();
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(os.homedir(), 'FixMate-private-env-backups', stamp);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.copyFileSync(clientEnv, path.join(backupDir, 'client.env.local'));
  fs.writeFileSync(clientEnv, replaceUri(originalText, standardUri));
  console.log('Updated client .env.local (backup created).');
  if (fs.existsSync(serverEnv)) {
    const serverText = fs.readFileSync(serverEnv, 'utf8');
    try {
      const serverUri = getUri(serverText);
      const serverUrl = new URL(serverUri);
      if (serverUrl.protocol === 'mongodb+srv:' && serverUrl.hostname === parsed.hostname && serverUrl.username === parsed.username && serverUrl.password === parsed.password) {
        fs.copyFileSync(serverEnv, path.join(backupDir, 'server.env'));
        fs.writeFileSync(serverEnv, replaceUri(serverText, standardUri));
        console.log('Updated server .env (backup created).');
      } else console.log('Server URI differs; left server .env unchanged.');
    } catch { console.log('Server .env was not changed.'); }
  }
  console.log('Private backups saved outside your Git repositories.');
  console.log('Restart both servers. Do NOT commit either .env file.');
}
main().catch(e => { console.error('Repair stopped:', e.message); process.exitCode = 1; });
