
import { auth } from "@/lib/auth";
import { SignJWT } from "jose";

// ==========================================
// JWT SETTINGS
// ==========================================

const JWT_ISSUER = "fixmate-auth";
const JWT_AUDIENCE = "fixmate-api";

// ==========================================
// GENERATE JWT
// ==========================================

export async function POST(request: Request) {
  try {
    const allowedOrigin =
      process.env.BETTER_AUTH_URL;

    const requestOrigin =
      request.headers.get("origin");

    // Verify the request comes from our site.
    if (
      !allowedOrigin ||
      requestOrigin !== allowedOrigin
    ) {
      return Response.json(
        {
          success: false,
          message: "Forbidden origin",
        },
        { status: 403 }
      );
    }

    // Get the logged-in Better Auth user.
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const secret =
      process.env.API_JWT_SECRET;

    if (!secret || secret.length < 32) {
      return Response.json(
        {
          success: false,
          message: "JWT secret not configured",
        },
        { status: 500 }
      );
    }

    // Generate short-lived JWT.
    const token = await new SignJWT({
      email: session.user.email,
    })
      .setProtectedHeader({
        alg: "HS256",
        typ: "JWT",
      })
      .setSubject(session.user.id)
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(
        new TextEncoder().encode(secret)
      );

    return Response.json(
      {
        success: true,
        token,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "JWT generation error:",
      error
    );

    return Response.json(
      {
        success: false,
        message: "Unable to issue JWT",
      },
      { status: 500 }
    );
  }
}
