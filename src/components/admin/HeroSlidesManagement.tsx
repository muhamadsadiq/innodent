"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Images, Plus, Edit2, Trash2, UploadCloud, XCircle, RefreshCw } from "lucide-react";

interface HeroSlide {
  id: string;
  imageUrl: string;
  alt: string | null;
  sortOrder: number;
  isActive: boolean;
}

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function HeroSlidesManagement() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    imageUrl: "",
    alt: "",
    sortOrder: 0,
    isActive: true,
  });

  const [initialImageUrl, setInitialImageUrl] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [selectedFileSize, setSelectedFileSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void loadSlides();
  }, []);

  const loadSlides = async (isManual = false) => {
    try {
      setError(null);
      if (isManual) setRefreshing(true);

      const response = await fetch("/api/admin/hero-slides");
      if (!response.ok) throw new Error("Failed to load hero slides");

      const data = (await response.json()) as HeroSlide[];
      setSlides(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load hero slides");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const deleteManagedImage = async (url: string | null | undefined, excludeHeroSlideId?: string) => {
    if (!url || !url.startsWith("/uploads/")) return;

    try {
      await fetch("/api/admin/uploads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, excludeHeroSlideId }),
      });
    } catch {
      // Ignore cleanup failures to avoid blocking UI.
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ imageUrl: "", alt: "", sortOrder: 0, isActive: true });
    setUploadError(null);
    setSelectedFileName("");
    setSelectedFileSize(0);
    setInitialImageUrl("");
    setUploadedImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = async () => {
    const hasUnsavedUpload =
      Boolean(uploadedImageUrl) &&
      uploadedImageUrl !== initialImageUrl &&
      formData.imageUrl === uploadedImageUrl;

    if (hasUnsavedUpload) {
      await deleteManagedImage(uploadedImageUrl);
    }

    resetForm();
  };

  const openCreate = () => {
    if (showForm) {
      void handleCancel();
      return;
    }

    setShowForm(true);
    setEditingId(null);
    setFormData({ imageUrl: "", alt: "", sortOrder: slides.length, isActive: true });
    setInitialImageUrl("");
    setUploadedImageUrl("");
    setUploadError(null);
    setSelectedFileName("");
    setSelectedFileSize(0);
  };

  const handleEdit = (slide: HeroSlide) => {
    setShowForm(true);
    setEditingId(slide.id);
    setFormData({
      imageUrl: slide.imageUrl,
      alt: slide.alt || "",
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
    });
    setInitialImageUrl(slide.imageUrl);
    setUploadedImageUrl("");
    setUploadError(null);
    setSelectedFileName("");
    setSelectedFileSize(0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setUploadError("Only JPG, PNG, WEBP, and SVG files are allowed.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadError("File size must be 5MB or less.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);

    const payload = new FormData();
    payload.append("file", file);
    payload.append("productName", formData.alt || "hero-slide");
    payload.append("folder", "slider");

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = (await response.json()) as { url: string };

      if (uploadedImageUrl && uploadedImageUrl !== data.url) {
        await deleteManagedImage(uploadedImageUrl);
      }

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setUploadedImageUrl(data.url);
    } catch {
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const clearImage = async () => {
    const currentImage = formData.imageUrl;
    setFormData((prev) => ({ ...prev, imageUrl: "" }));

    if (fileInputRef.current) fileInputRef.current.value = "";
    setSelectedFileName("");
    setSelectedFileSize(0);
    setUploadError(null);

    if (currentImage && currentImage === uploadedImageUrl) {
      await deleteManagedImage(currentImage);
      setUploadedImageUrl("");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    if (!formData.imageUrl) {
      setError("Please upload or provide an image URL.");
      setSaving(false);
      return;
    }

    try {
      const endpoint = editingId ? `/api/admin/hero-slides/${editingId}` : "/api/admin/hero-slides";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: formData.imageUrl,
          alt: formData.alt,
          sortOrder: Number(formData.sortOrder) || 0,
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "Failed to save slide");
        return;
      }

      if (editingId && initialImageUrl && initialImageUrl !== formData.imageUrl) {
        await deleteManagedImage(initialImageUrl, editingId);
      }

      await loadSlides();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save slide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slide: HeroSlide) => {
    if (!confirm("Delete this hero slide?")) return;

    try {
      const response = await fetch(`/api/admin/hero-slides/${slide.id}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error || "Failed to delete slide");
        return;
      }
      await loadSlides();
    } catch {
      setError("Failed to delete slide");
    }
  };

  if (loading && !showForm) {
    return (
      <div className="flex min-h-[260px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading hero slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)] p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold">
              <Images size={40} />
              Hero Slider Management
            </h1>
            <p className="text-blue-100">Manage homepage highlights slider images and ordering.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadSlides(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[var(--color-dark-teal)] hover:opacity-90"
            >
              <Plus size={16} />
              {showForm ? "Close" : "Add Slide"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border-2 border-gray-100 bg-white p-8 shadow-lg space-y-5">
          <h2 className="text-2xl font-bold text-[var(--color-charcoal)]">
            {editingId ? "Edit Hero Slide" : "Add Hero Slide"}
          </h2>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-2 lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700">Slide Image *</label>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--color-dark-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                    <UploadCloud size={16} />
                    {uploading ? "Uploading..." : "Upload image"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>

                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => void clearImage()}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      <XCircle size={16} />
                      Remove
                    </button>
                  )}

                  {selectedFileName && (
                    <p className="text-sm text-gray-600">
                      {selectedFileName} ({formatBytes(selectedFileSize)})
                    </p>
                  )}
                </div>

                {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}

                {formData.imageUrl && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <div className="relative h-[220px] w-full">
                      <Image src={formData.imageUrl} alt={formData.alt || "Hero slide preview"} fill className="object-cover" />
                    </div>
                    <div className="px-3 py-2 text-xs text-gray-600">{formData.imageUrl}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Alt Text</label>
              <input
                type="text"
                value={formData.alt}
                onChange={(e) => setFormData((prev) => ({ ...prev, alt: e.target.value }))}
                placeholder="Innodent highlights slide"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Sort Order</label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:outline-none"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[var(--color-dark-teal)] focus:ring-[var(--color-dark-teal)]"
                />
                Active (show on homepage)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => void handleCancel()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-lg bg-[var(--color-dark-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Slide" : "Create Slide"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-[var(--color-mist-white)]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">Preview</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">Alt</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">Order</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-600">Status</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                  No hero slides yet. Add your first slide.
                </td>
              </tr>
            ) : (
              slides.map((slide) => (
                <tr key={slide.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="relative h-16 w-28 overflow-hidden rounded-md border border-gray-200">
                      <Image src={slide.imageUrl} alt={slide.alt || "Hero slide"} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{slide.alt || "-"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{slide.sortOrder}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${slide.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(slide)}
                        className="rounded-md border border-blue-200 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                        aria-label="Edit slide"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(slide)}
                        disabled={slides.length <= 3}
                        title={slides.length <= 3 ? "At least 3 slides are required" : "Delete slide"}
                        className="rounded-md border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Delete slide"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-right text-xs font-medium text-gray-500">
        Minimum 3 hero slides are required. Add a 4th slide before deleting any.
      </p>
    </div>
  );
}

