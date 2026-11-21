// Run ONLY from C:\Projects\fixmate\fixmate-client
// Node 20.6+ / 24: node --env-file=.env.local FixMate_Fix_Existing_TestAdmin.cjs
// Local demo owner-controlled, one-time migration for an already-registered account.
const { MongoClient } = require('mongodb');
const email = 'testadmin@gmail.com';
(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing. Run with --env-file=.env.local from fixmate-client.');
  const client = new MongoClient(uri, {serverSelectionTimeoutMS: 15000});
  try {
    await client.connect();
    const users = client.db(process.env.DB_NAME || 'fixmatedb').collection('user');
    const person = await users.findOne({email}, {projection:{_id:1,email:1,role:1}});
    if (!person) throw new Error('testadmin@gmail.com does not exist in this MongoDB database. No changes made.');
    console.log('Found account:', person.email, '| current role:', person.role || '(unset)');
    if (person.role === 'admin') {
      console.log('ALREADY ADMIN — sign out then sign in again.'); return;
    }
    const result = await users.updateOne({_id:person._id, role: person.role}, {$set:{role:'admin',updatedAt:new Date()}});
    if (result.modifiedCount !== 1) throw new Error('Role was not changed. No success reported.');
    const checked = await users.findOne({_id:person._id}, {projection:{role:1}});
    if (checked?.role !== 'admin') throw new Error('Verification failed; DB does not show Admin.');
    console.log('SUCCESS: MongoDB role is now admin for testadmin@gmail.com.');
    console.log('Sign out completely, then sign in again to open /dashboard/admin.');
  } finally {await client.close();}
})().catch(e=>{console.error('FAILED:',e.message);process.exitCode=1;});
