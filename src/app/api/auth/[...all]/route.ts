import { toNextJsHandler } from "better-auth/next-js";
import { connectToMongoDB } from "@/lib/mongodb";

export const runtime = "nodejs";

// Initialize Better Auth only after a successful MongoDB connection.
async function getAuthHandlers() {
  await connectToMongoDB();
  const { auth } = await import("@/lib/auth");
  return toNextJsHandler(auth);
}

export async function GET(request: Request) {
  const handlers = await getAuthHandlers();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  const handlers = await getAuthHandlers();
  return handlers.POST(request);
}
