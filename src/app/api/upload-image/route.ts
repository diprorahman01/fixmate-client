
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// ==========================================
// UPLOAD IMAGE TO IMGBB
// ==========================================

export async function POST(request: Request) {
  try {
    // Only logged-in technicians can upload
    // service images through this endpoint.
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "technician") {
      return Response.json(
        { message: "Technicians only" },
        { status: 403 }
      );
    }

    const origin = request.headers.get("origin");
    const expectedOrigin =
      process.env.BETTER_AUTH_URL;

    if (!origin || origin !== expectedOrigin) {
      return Response.json(
        { message: "Forbidden origin" },
        { status: 403 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return Response.json(
        { message: "ImgBB API key is missing" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return Response.json(
        { message: "Please select an image" },
        { status: 400 }
      );
    }

    // Limit service images to 5 MB.
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      return Response.json(
        { message: "Image must be under 5 MB" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { message: "Use JPG, PNG or WebP" },
        { status: 400 }
      );
    }

    // Check basic file signatures, not only
    // the MIME type supplied by the browser.
    const bytes = new Uint8Array(
      await file.slice(0, 12).arrayBuffer()
    );

    const jpeg =
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff;

    const png =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47;

    const webp =
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";

    if (
      !(file.type === "image/jpeg" && jpeg) &&
      !(file.type === "image/png" && png) &&
      !(file.type === "image/webp" && webp)
    ) {
      return Response.json(
        { message: "Invalid image file" },
        { status: 400 }
      );
    }

    const uploadData = new FormData();
    uploadData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
        cache: "no-store",
        signal: AbortSignal.timeout(30000),
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.success ||
      typeof result.data?.url !== "string"
    ) {
      return Response.json(
        { message: "ImgBB upload failed" },
        { status: 502 }
      );
    }

    const url = new URL(result.data.url);

    if (
      url.protocol !== "https:" ||
      !["i.ibb.co", "i.ibb.co.com"].includes(url.hostname)
    ) {
      return Response.json(
        { message: "Invalid image host" },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      url: url.toString(),
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return Response.json(
      { message: "Image upload failed" },
      { status: 500 }
    );
  }
}
