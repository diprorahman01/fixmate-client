
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Save, Wrench } from "lucide-react";
import { toast } from "sonner";

import {
  SERVICE_CATEGORIES,
  type RepairService,
  type ServiceCategory,
} from "@/lib/services";

import {
  createService,
  updateService,
  uploadServiceImage,
  type ServiceInput,
} from "@/lib/technician-services";

type Props = {
  service?: RepairService;
};

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary";

const labelClass =
  "mb-2 block text-sm font-semibold";

export function ServiceForm({ service }: Props) {
  const router = useRouter();

  const editing = Boolean(service);

  const [title, setTitle] = useState(
    service?.title || ""
  );

  const [category, setCategory] =
    useState<ServiceCategory>(
      service?.category || "Smartphone"
    );

  const [description, setDescription] = useState(
    service?.description || ""
  );

  const [basePrice, setBasePrice] = useState(
    service ? String(service.basePrice) : ""
  );

  const [
    estimatedDuration,
    setEstimatedDuration,
  ] = useState(service?.estimatedDuration || "");

  const [serviceMode, setServiceMode] =
    useState<"Home Visit" | "Shop Drop-off">(
      service?.serviceMode || "Home Visit"
    );

  const [serviceArea, setServiceArea] = useState(
    service?.serviceArea || ""
  );

  const [file, setFile] = useState<File | null>(
    null
  );

  const [imageUrl, setImageUrl] = useState(
    service?.image || ""
  );

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (title.trim().length < 5) {
      toast.error("Title must have at least 5 characters");
      return;
    }

    if (description.trim().length < 20) {
      toast.error(
        "Description must have at least 20 characters"
      );
      return;
    }

    const price = Number(basePrice);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a positive base price");
      return;
    }

    if (!file && !imageUrl) {
      toast.error("Please select a service image");
      return;
    }

    setLoading(true);

    try {
      let finalImage = imageUrl;

      if (file) {
        finalImage = await uploadServiceImage(file);
      }

      const serviceData: ServiceInput = {
        title: title.trim(),
        category,
        description: description.trim(),
        image: finalImage,
        basePrice: price,
        estimatedDuration:
          estimatedDuration.trim(),
        serviceMode,
        serviceArea: serviceArea.trim(),
      };

      if (editing && service) {
        await updateService(
          service._id,
          serviceData
        );

        toast.success(
          "Service updated. Waiting for admin approval."
        );
      } else {
        await createService(serviceData);

        toast.success(
          "Service submitted. Waiting for admin approval."
        );
      }

      router.push(
        "/dashboard/technician/my-services"
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save service"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-9"
    >
      <div className="flex items-center gap-3 border-b border-border pb-6">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Wrench className="size-6" />
        </div>

        <div>
          <h2 className="text-xl font-bold">
            {editing
              ? "Edit Service"
              : "Service Information"}
          </h2>

          <p className="text-sm text-muted-foreground">
            Complete the details below.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            className={labelClass}
            htmlFor="service-title"
          >
            Service Title *
          </label>

          <input
            id="service-title"
            required
            minLength={5}
            maxLength={120}
            className={fieldClass}
            placeholder="e.g. iPhone Screen Replacement"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor="category"
          >
            Category *
          </label>

          <select
            id="category"
            className={fieldClass}
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value as ServiceCategory
              )
            }
          >
            {SERVICE_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor="price"
          >
            Base Price (USD) *
          </label>

          <input
            id="price"
            type="number"
            required
            min="0.01"
            max="1000000"
            step="0.01"
            className={fieldClass}
            placeholder="49.99"
            value={basePrice}
            onChange={(event) =>
              setBasePrice(event.target.value)
            }
          />
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor="duration"
          >
            Estimated Duration *
          </label>

          <input
            id="duration"
            required
            maxLength={100}
            className={fieldClass}
            placeholder="e.g. 2-3 hours"
            value={estimatedDuration}
            onChange={(event) =>
              setEstimatedDuration(event.target.value)
            }
          />
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor="service-mode"
          >
            Service Mode *
          </label>

          <select
            id="service-mode"
            className={fieldClass}
            value={serviceMode}
            onChange={(event) =>
              setServiceMode(
                event.target.value as
                  "Home Visit" | "Shop Drop-off"
              )
            }
          >
            <option value="Home Visit">
              Home Visit
            </option>

            <option value="Shop Drop-off">
              Shop Drop-off
            </option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            className={labelClass}
            htmlFor="area"
          >
            Service Area *
          </label>

          <input
            id="area"
            required
            maxLength={150}
            className={fieldClass}
            placeholder="e.g. Dhanmondi, Dhaka"
            value={serviceArea}
            onChange={(event) =>
              setServiceArea(event.target.value)
            }
          />
        </div>

        <div className="md:col-span-2">
          <label
            className={labelClass}
            htmlFor="description"
          >
            Description *
          </label>

          <textarea
            id="description"
            required
            minLength={20}
            maxLength={3000}
            rows={6}
            className={fieldClass}
            placeholder="Explain what this repair service includes..."
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Minimum 20 characters.
          </p>
        </div>

        <div className="md:col-span-2">
          <label
            className={labelClass}
            htmlFor="service-image"
          >
            Service Image *
          </label>

          <label
            htmlFor="service-image"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center hover:border-primary"
          >
            <ImagePlus className="mb-4 size-10 text-primary" />

            <span className="font-semibold">
              Click to select an image
            </span>

            <span className="mt-2 text-sm text-muted-foreground">
              JPG, PNG or WebP. Maximum 5 MB.
            </span>
          </label>

          <input
            id="service-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const selected =
                event.target.files?.[0] || null;

              if (
                selected &&
                selected.size > 5 * 1024 * 1024
              ) {
                toast.error(
                  "Image must be under 5 MB"
                );
                setFile(null);
                return;
              }

              setFile(selected);

              if (selected) {
                const reader = new FileReader();
                reader.onload = () => {
                  setPreview(
                    String(reader.result || "")
                  );
                };
                reader.readAsDataURL(selected);
              } else {
                setPreview("");
              }
            }}
          />

          {(preview || imageUrl) && (
            <div className="mt-4">
              {/* A native img is used for a local
                  file preview before uploading. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview || imageUrl}
                alt="Service preview"
                className="h-48 w-full rounded-2xl border border-border object-cover sm:w-80"
              />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        Your service will be submitted for admin approval.
        Editing an existing service also resets its
        approval status to Pending.
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Saving Service...
          </>
        ) : (
          <>
            <Save className="size-5" />
            {editing
              ? "Save Changes"
              : "Submit for Approval"}
          </>
        )}
      </button>
    </form>
  );
}
