
import "server-only";

import { betterAuth } from "better-auth";
import {
  createAuthMiddleware,
  APIError,
} from "better-auth/api";

import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";

import { db, mongoClient } from "@/lib/mongodb";

export const auth = betterAuth({
  // ======================================
  // DATABASE
  // ======================================

  database: mongodbAdapter(db, {
    client: mongoClient,
  }),

  baseURL:
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000",

  trustedOrigins: [
    process.env.BETTER_AUTH_URL ||
      "http://localhost:3000",
  ],

  // ======================================
  // EMAIL AND PASSWORD
  // ======================================

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  // ======================================
  // ADDITIONAL USER FIELDS
  // ======================================

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "customer",
        input: true,
      },

      phone: {
        type: "string",
        required: false,
        input: false,
      },

      area: {
        type: "string",
        required: false,
        input: false,
      },

      bio: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  // ======================================
  // SERVER-SIDE VALIDATION
  // ======================================

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const body = ctx.body;

        if (!body) {
          throw new APIError("BAD_REQUEST", {
            message: "Registration data is required",
          });
        }

        const password = body.password;

        if (
          typeof password !== "string" ||
          password.length < 6 ||
          !/[A-Z]/.test(password) ||
          !/[a-z]/.test(password)
        ) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password needs at least 6 characters, one uppercase letter and one lowercase letter",
          });
        }

        // Never accept admin registration.
        const role =
          body.role === "technician"
            ? "technician"
            : "customer";

        return {
          context: {
            ...ctx,
            body: {
              ...body,
              role,
            },
          },
        };
      }

      // Prevent ordinary users from changing
      // their roles through other auth endpoints.
      if (
        ctx.body &&
        Object.prototype.hasOwnProperty.call(
          ctx.body,
          "role"
        )
      ) {
        throw new APIError("FORBIDDEN", {
          message:
            "Role cannot be updated from this endpoint",
        });
      }
    }),
  },

  // ======================================
  // NEXT.JS INTEGRATION
  // ======================================

  plugins: [nextCookies()],
});
