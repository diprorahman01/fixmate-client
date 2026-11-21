import { authenticatedFetch } from "@/lib/api-client";

export type FixMateProfile = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "technician" | "admin";
  image: string;
  phone: string;
  area: string;
  bio: string;
};

type EditProfile = Pick<FixMateProfile, "name" | "phone" | "area" | "bio" | "image">;

async function readResponse<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json();
  if (!response.ok) {
    if (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string") {
      throw new Error(payload.message);
    }
    throw new Error(`Request failed (${response.status})`);
  }
  return payload as T;
}

export async function getProfile() {
  return readResponse<FixMateProfile>(await authenticatedFetch("/api/profile"));
}

export async function updateProfile(fields: EditProfile) {
  return readResponse<{ success: boolean; profile: FixMateProfile; message: string }>(
    await authenticatedFetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    })
  );
}

export async function uploadProfileImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPG, PNG or WebP image");
  }
  if (!file.size || file.size > 5 * 1024 * 1024) {
    throw new Error("Choose an image smaller than 5 MB");
  }
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Cannot read selected image"));
    reader.onload = () => {
      if (typeof reader.result !== "string") return reject(new Error("Cannot read image"));
      resolve(reader.result.split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  });
  return readResponse<{ success: boolean; url: string }>(
    await authenticatedFetch("/api/profile/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64, mimeType: file.type }),
    })
  );
}
