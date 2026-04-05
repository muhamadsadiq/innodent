// components/admin/ProductsManagement.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  AlertCircle,
  CheckCircle,
  UploadCloud,
  Loader2,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

interface Catalog {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

type ProductRow = {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  catalogId: string;
  categoryId: string | null;
  image: string;
  features?: string | null;
  component?: string | null;
  shades?: string | null;
  isBestSeller: boolean;
  isNew: boolean;
  catalog?: { id: string; name: string } | null;
  category?: { id: string; name: string } | null;
};

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

const FEATURE_QUICK_SUGGESTIONS = [
  "Excellent Flowability",
  "Direct or Indirect Pulp Capping",
  "Excellent radiopacity",
  "Low polymerization shrinkage",
  "Various shade",
  "Easy to Adhere to Bracket for Orthodontics",
];

function parseStringArrayField(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    // Handle JSON array string first.
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .map((item) => String(item).trim())
            .filter((item) => item.length > 0);
        }
      } catch {
        // Fall back to comma/newline parsing.
      }
    }

    return trimmed
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keepCatalogCategory, setKeepCatalogCategory] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");
  const [selectedImageSize, setSelectedImageSize] = useState<number>(0);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [featureInput, setFeatureInput] = useState("");
  const [featureError, setFeatureError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    catalogId: "",
    categoryId: "",
    image: "",
    features: [] as string[],
    component: "",
    shades: "",
    isBestSeller: false,
    isNew: false,
  });

  useEffect(() => {
    loadProducts();
    loadCatalogsAndCategories();
  }, []);

  useEffect(() => {
    if (!showForm && !editingId) {
      setImagePreview(null);
      setUploadError(null);
      setSelectedImageName("");
      setSelectedImageSize(0);
    }
  }, [showForm, editingId]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const loadProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCatalogsAndCategories = async () => {
    try {
      const [catalogsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/catalogs"),
        fetch("/api/admin/categories"),
      ]);

      const catalogsData = await catalogsRes.json();
      const categoriesData = await categoriesRes.json();

      setCatalogs(catalogsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading catalogs/categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert comma-separated shades to array
      const shadesArray = formData.shades
        .split(',')
        .map((shade) => shade.trim())
        .filter((shade) => shade.length > 0);

      const cleanedFeatures = formData.features
        .map((feature) => feature.trim())
        .filter((feature) => feature.length > 0);

      if (cleanedFeatures.length === 0) {
        setFeatureError("Add at least one feature so product details look complete.");
        setLoading(false);
        return;
      }

      const dataToSend = {
        ...formData,
        features: cleanedFeatures,
        shades: shadesArray,
      };

      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        alert("Error saving product");
        return;
      }

      await loadProducts();

      if (editingId) {
        // If editing, close the form
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: "",
          description: "",
          shortDescription: "",
          catalogId: "",
          categoryId: "",
          image: "",
          features: [],
          component: "",
          shades: "",
          isBestSeller: false,
          isNew: false,
        });
        setFeatureInput("");
        setFeatureError(null);
        setKeepCatalogCategory(false);
        setImagePreview(null);
        setSelectedImageName("");
        setSelectedImageSize(0);
      } else if (keepCatalogCategory) {
        // If adding and "keep catalog/category" is enabled, reset only the product details
        setFormData((prev) => ({
          ...prev,
          name: "",
          description: "",
          shortDescription: "",
          image: "",
          features: [],
          component: "",
          shades: "",
          isBestSeller: false,
          isNew: false,
          // Keep catalogId and categoryId
        }));
        setImagePreview(null);
        setSelectedImageName("");
        setSelectedImageSize(0);
        setFeatureInput("");
        setFeatureError(null);
      } else {
        // If adding and "keep catalog/category" is disabled, close the form
        setShowForm(false);
        setFormData({
          name: "",
          description: "",
          shortDescription: "",
          catalogId: "",
          categoryId: "",
          image: "",
          features: [],
          component: "",
          shades: "",
          isBestSeller: false,
          isNew: false,
        });
        setImagePreview(null);
        setSelectedImageName("");
        setSelectedImageSize(0);
        setFeatureInput("");
        setFeatureError(null);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ProductRow) => {
    // Parse shades array back to comma-separated string for editing
    let shadesString = "";
    if (product.shades) {
      try {
        const shadesArray = JSON.parse(product.shades);
        shadesString = Array.isArray(shadesArray) ? shadesArray.join(", ") : "";
      } catch (_error) {
        shadesString = product.shades;
      }
    }

    const featuresArray = parseStringArrayField(product.features);

    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      catalogId: product.catalogId,
      categoryId: product.categoryId || "",
      image: product.image,
      features: featuresArray,
      component: product.component || "",
      shades: shadesString,
      isBestSeller: product.isBestSeller,
      isNew: product.isNew,
    });
    setFeatureInput("");
    setFeatureError(null);
    setImagePreview(product.image || null);
    setSelectedImageName("");
    setSelectedImageSize(0);
    setEditingId(product.id);
    setShowForm(true);
  };

  const addFeature = (rawValue: string) => {
    const value = rawValue.trim();
    if (!value) return;

    const exists = formData.features.some(
      (feature) => feature.toLowerCase() === value.toLowerCase(),
    );

    if (exists) {
      setFeatureError("This feature is already added.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, value],
    }));
    setFeatureInput("");
    setFeatureError(null);
  };

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }));
  };

  const handleFeatureInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addFeature(featureInput);
    }
  };

  const applyBulkFeatures = () => {
    const parsed = parseStringArrayField(featureInput);
    if (parsed.length === 0) {
      setFeatureError("Type feature text first (comma or new line separated).");
      return;
    }

    const existingMap = new Map(
      formData.features.map((feature) => [feature.toLowerCase(), feature]),
    );

    parsed.forEach((feature) => {
      const key = feature.toLowerCase();
      if (!existingMap.has(key)) {
        existingMap.set(key, feature);
      }
    });

    setFormData((prev) => ({
      ...prev,
      features: Array.from(existingMap.values()),
    }));
    setFeatureInput("");
    setFeatureError(null);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Error deleting product");
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const clearImage = async () => {
    const currentImage = formData.image;

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }

    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
    setUploadError(null);
    setSelectedImageName("");
    setSelectedImageSize(0);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (currentImage?.startsWith("/uploads/")) {
      try {
        await fetch("/api/admin/uploads", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: currentImage }),
        });
      } catch (error) {
        console.error("Failed to delete previous uploaded image", error);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previousImage = formData.image;

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setUploadError("Only JPG, PNG, WEBP, and SVG files are allowed.");
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      setUploadError("File size must be 5MB or less.");
      return;
    }

    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(previewUrl);
    setImagePreview(previewUrl);
    setSelectedImageName(file.name);
    setSelectedImageSize(file.size);

    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("productName", formData.name || "product");
    if (previousImage) {
      formPayload.append("previousImage", previousImage);
    }

    setImageUploading(true);
    setUploadError(null);

    try {
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setLocalPreviewUrl(null);
    } catch (error) {
      console.error("Image upload failed", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setImageUploading(false);
    }
  };

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center min-h-[260px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)] rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Package size={40} />
              Products Management
            </h1>
            <p className="text-blue-100">Manage your product catalog, add new items, and organize your inventory</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            className="px-6 py-3 bg-white text-[var(--color-dark-teal)] font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-[var(--color-dark-teal)] rounded-full"></div>
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                placeholder="e.g., Composite Restoration Kit"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Short Description *</label>
              <textarea
                placeholder="Brief description of the product"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Description *</label>
              <textarea
                placeholder="Detailed description of the product"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
                rows={3}
              />
            </div>

            <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-bold text-gray-700">Features *</label>
                <span className="rounded-full bg-[var(--color-mist-white)] px-3 py-1 text-xs font-semibold text-[var(--color-dark-teal)]">
                  {formData.features.length} added
                </span>
              </div>

              <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 min-h-[52px]">
                {formData.features.length === 0 ? (
                  <span className="text-xs text-gray-500">No features yet. Add from input or quick suggestions.</span>
                ) : (
                  formData.features.map((feature) => (
                    <span
                      key={feature}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--color-dark-teal)]/30 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="rounded-full p-0.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove ${feature}`}
                      >
                        <XCircle size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {FEATURE_QUICK_SUGGESTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => addFeature(item)}
                    className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[var(--color-dark-teal)] hover:text-[var(--color-dark-teal)]"
                  >
                    + {item}
                  </button>
                ))}
              </div>

              <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto_auto]">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => {
                    setFeatureInput(e.target.value);
                    if (featureError) setFeatureError(null);
                  }}
                  onKeyDown={handleFeatureInputKeyDown}
                  placeholder="Type feature and press Enter (or paste comma/new line list)"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => addFeature(featureInput)}
                  className="rounded-lg bg-[var(--color-dark-teal)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={applyBulkFeatures}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Add All
                </button>
              </div>

              {featureError && (
                <p className="mt-2 text-xs font-medium text-red-600">{featureError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">These features appear in the product details page.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL *</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg or /uploads/filename.jpg"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                  setUploadError(null);
                }}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
              />
              <div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-[var(--color-mist-white)] p-2">
                      <UploadCloud size={20} className="text-[var(--color-dark-teal)]" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Upload Product Image</p>
                      <p className="text-xs text-gray-500">JPG, PNG, WEBP, SVG up to 5MB</p>
                    </div>
                  </div>
                  <label className="inline-flex cursor-pointer items-center rounded-lg bg-[var(--color-dark-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                    {imageUploading ? "Uploading..." : "Choose File"}
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </label>
                </div>

                {uploadError && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-2 text-sm text-red-700">
                    <AlertCircle size={16} />
                    <span>{uploadError}</span>
                  </div>
                )}

                {imagePreview && (
                  <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-contain" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {selectedImageName || formData.image || "Uploaded image"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {selectedImageSize > 0 ? formatBytes(selectedImageSize) : "Hosted image URL"}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">{formData.image}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {imageUploading ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          <Loader2 size={12} className="animate-spin" />
                          Uploading
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          <CheckCircle size={12} />
                          Ready
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={clearImage}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                      >
                        <XCircle size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {!imagePreview && !uploadError && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                    <ImageIcon size={14} />
                    <span>No image selected yet.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Component (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., 1g x 2pcs"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Shades (Optional - comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., A1, A2, A3, B2 (will be stored as array)"
                  value={formData.shades}
                  onChange={(e) => setFormData({ ...formData, shades: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Enter shades separated by commas. Not visible to users.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Catalog *</label>
                <select
                  value={formData.catalogId}
                  onChange={(e) => setFormData({ ...formData, catalogId: e.target.value })}
                  required
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all bg-white"
                >
                  <option value="">Select Catalog</option>
                  {catalogs.map((catalog) => (
                    <option key={catalog.id} value={catalog.id}>
                      {catalog.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category (Optional)</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all bg-white"
                >
                  <option value="">Select Category (Optional)</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Product Options</h3>
              <div className="flex flex-col gap-4">
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer accent-[var(--color-dark-teal)]"
                    />
                    <span className="font-semibold text-gray-700">Best Seller</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer accent-[var(--color-dark-teal)]"
                    />
                    <span className="font-semibold text-gray-700">New</span>
                  </label>
                </div>

                {!editingId && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepCatalogCategory}
                        onChange={(e) => setKeepCatalogCategory(e.target.checked)}
                        className="w-5 h-5 border-2 border-blue-300 rounded cursor-pointer accent-[var(--color-dark-teal)]"
                      />
                      <span className="font-semibold text-gray-700">
                        Keep catalog & category for next product
                      </span>
                    </label>
                    <p className="text-xs text-gray-600 mt-2 ml-8">
                      Enable this to quickly add multiple products to the same catalog/category
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={imageUploading || formData.features.length === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--color-moss-green)] to-[var(--color-dark-teal)] text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                {imageUploading ? "Please wait..." : editingId ? "Update Product" : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package size={24} className="text-[var(--color-dark-teal)]" />
            Products ({products.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
           <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Catalog</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <AlertCircle size={48} className="text-gray-300" />
                    <p className="text-lg font-semibold text-gray-500">No products yet</p>
                    <p className="text-sm text-gray-400">Create your first product to get started!</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50 transition-all duration-200">
                  <td className="px-6 py-4 font-semibold text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-gray-700">{product.catalog?.name || "-"}</td>
                  <td className="px-6 py-4 text-gray-700">{product.category?.name || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {product.isBestSeller && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold flex items-center gap-1">
                          <CheckCircle size={14} /> Best Seller
                        </span>
                      )}
                      {product.isNew && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold flex items-center gap-1">
                          <CheckCircle size={14} /> New
                        </span>
                      )}
                      {!product.isBestSeller && !product.isNew && (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1"
                        title="Edit product"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1"
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
       </div>
     </div>
   );
 }
