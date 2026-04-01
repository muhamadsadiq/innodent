// components/admin/CatalogsManagement.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  RefreshCw,
  UploadCloud,
  FileText,
  Link as LinkIcon,
  XCircle,
} from "lucide-react";

interface Catalog {
  id: string;
  name: string;
  shortName?: string | null;
  brochureUrl?: string | null;
  isProductClickable?: boolean;
}

const MAX_PDF_SIZE = 15 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function isValidBrochureUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return true;

  // Accept local uploaded paths and absolute URLs.
  if (trimmed.startsWith("/")) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function CatalogsManagement() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [brochureUploading, setBrochureUploading] = useState(false);
  const [brochureError, setBrochureError] = useState<string | null>(null);
  const [selectedBrochureName, setSelectedBrochureName] = useState("");
  const [selectedBrochureSize, setSelectedBrochureSize] = useState(0);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    brochureUrl: "",
    isProductClickable: true,
  });
  const [initialBrochureUrl, setInitialBrochureUrl] = useState("");
  const [uploadedBrochureUrl, setUploadedBrochureUrl] = useState("");

  useEffect(() => {
    void loadCatalogs();
  }, []);

  const loadCatalogs = async (isManualRefresh = false) => {
    try {
      setError(null);
      if (isManualRefresh) {
        setRefreshing(true);
      }

      const response = await fetch("/api/admin/catalogs");
      if (!response.ok) {
        throw new Error(`Failed to load catalogs (${response.status}).`);
      }

      const data = (await response.json()) as Catalog[];
      setCatalogs(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error loading catalogs:", error);
      setError(error instanceof Error ? error.message : "Error loading catalogs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", shortName: "", brochureUrl: "", isProductClickable: true });
    setBrochureError(null);
    setSelectedBrochureName("");
    setSelectedBrochureSize(0);
    setInitialBrochureUrl("");
    setUploadedBrochureUrl("");
    if (brochureInputRef.current) {
      brochureInputRef.current.value = "";
    }
  };

  const deleteBrochureIfManaged = async (url: string | null | undefined) => {
    if (!url || !url.startsWith("/uploads/catalogs/")) return;
    try {
      await fetch("/api/admin/catalog-brochures", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
    } catch (error) {
      console.error("Failed to delete catalog brochure", error);
    }
  };

  const handleCancelForm = async () => {
    const shouldDeleteUnsavedUpload =
      Boolean(uploadedBrochureUrl) &&
      uploadedBrochureUrl !== initialBrochureUrl &&
      formData.brochureUrl === uploadedBrochureUrl;

    if (shouldDeleteUnsavedUpload) {
      await deleteBrochureIfManaged(uploadedBrochureUrl);
    }

    resetFormState();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isValidBrochureUrl(formData.brochureUrl)) {
      setError("Please enter a valid brochure link or keep the uploaded file path.");
      setLoading(false);
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/catalogs/${editingId}`
        : "/api/admin/catalogs";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save catalog (${response.status}).`);
      }

      // If edit saved with a replacement brochure, clean old managed file now.
      if (editingId && initialBrochureUrl && initialBrochureUrl !== formData.brochureUrl) {
        await deleteBrochureIfManaged(initialBrochureUrl);
      }

      await loadCatalogs();
      resetFormState();
    } catch (error) {
      console.error("Error saving catalog:", error);
      setError(error instanceof Error ? error.message : "Error saving catalog.");
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    if (showForm) {
      void handleCancelForm();
      return;
    }

    setEditingId(null);
    setFormData({ name: "", shortName: "", brochureUrl: "", isProductClickable: true });
    setBrochureError(null);
    setSelectedBrochureName("");
    setSelectedBrochureSize(0);
    setInitialBrochureUrl("");
    setUploadedBrochureUrl("");
    setShowForm(true);
  };

  const handleEdit = (catalog: Catalog) => {
    setFormData({
      name: catalog.name,
      shortName: catalog.shortName || "",
      brochureUrl: catalog.brochureUrl || "",
      isProductClickable: catalog.isProductClickable !== false,
    });
    setBrochureError(null);
    setSelectedBrochureName("");
    setSelectedBrochureSize(0);
    setInitialBrochureUrl(catalog.brochureUrl || "");
    setUploadedBrochureUrl("");
    setEditingId(catalog.id);
    setShowForm(true);
  };

  const clearBrochure = async () => {
    const currentBrochure = formData.brochureUrl;
    setFormData((prev) => ({ ...prev, brochureUrl: "" }));
    setSelectedBrochureName("");
    setSelectedBrochureSize(0);
    setBrochureError(null);

    if (brochureInputRef.current) {
      brochureInputRef.current.value = "";
    }

    await deleteBrochureIfManaged(currentBrochure);

    if (currentBrochure === uploadedBrochureUrl) {
      setUploadedBrochureUrl("");
    }
  };

  const handleBrochureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setBrochureError("Only PDF files are allowed.");
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setBrochureError("PDF size must be 15MB or less.");
      return;
    }

    setBrochureUploading(true);
    setBrochureError(null);
    setSelectedBrochureName(file.name);
    setSelectedBrochureSize(file.size);

    const formPayload = new FormData();
    formPayload.append("file", file);
    formPayload.append("catalogName", formData.name || "catalog");

    try {
      const response = await fetch("/api/admin/catalog-brochures", {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // If user uploads again in same edit session, remove previous unsaved upload.
      if (uploadedBrochureUrl && uploadedBrochureUrl !== data.url) {
        await deleteBrochureIfManaged(uploadedBrochureUrl);
      }

      setFormData((prev) => ({ ...prev, brochureUrl: data.url }));
      setUploadedBrochureUrl(data.url);
    } catch (error) {
      console.error("Brochure upload failed", error);
      setBrochureError("Failed to upload PDF. Please try again.");
    } finally {
      setBrochureUploading(false);
    }
  };

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center min-h-[260px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading catalogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      <div className="bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)] rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <BookOpen size={40} />
              Catalogs Management
            </h1>
            <p className="text-blue-100">Organize products into catalogs and maintain structure.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void loadCatalogs(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-[var(--color-dark-teal)] hover:opacity-90"
            >
              <Plus size={18} />
              {showForm ? "Cancel" : "Add Catalog"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className="mt-0.5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {editingId ? "Edit Catalog" : "Add New Catalog"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Catalog Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none"
            />

            <input
              type="text"
              placeholder="Short Name for badge (optional)"
              value={formData.shortName}
              onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none"
            />

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Catalog PDF URL (optional)</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  inputMode="url"
                  placeholder="https://drive.google.com/... or /uploads/catalogs/file.pdf"
                  value={formData.brochureUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, brochureUrl: e.target.value });
                    setBrochureError(null);
                  }}
                  className="w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 bg-white p-3">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <UploadCloud size={16} className="text-[var(--color-dark-teal)]" />
                  Upload PDF instead of pasting a link
                </div>
                <label className="inline-flex cursor-pointer items-center rounded-lg bg-[var(--color-dark-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                  {brochureUploading ? "Uploading..." : "Choose PDF"}
                  <input
                    ref={brochureInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleBrochureUpload}
                    className="hidden"
                    disabled={brochureUploading}
                  />
                </label>
              </div>

              {brochureError && <p className="text-sm text-red-600">{brochureError}</p>}

              {formData.brochureUrl && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <FileText size={14} />
                      {selectedBrochureName || "Brochure attached"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 truncate">{formData.brochureUrl}</p>
                    {selectedBrochureSize > 0 && (
                      <p className="text-xs text-gray-500">{formatBytes(selectedBrochureSize)}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void clearBrochure()}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    <XCircle size={13} />
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
              <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.isProductClickable}
                  onChange={(e) => setFormData({ ...formData, isProductClickable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[var(--color-dark-teal)] focus:ring-[var(--color-sky-tint)]"
                />
                Products in this catalog are clickable on website
              </label>
              <p className="text-xs text-gray-500">
                Disable this to make products view-only and remove hover effects for this catalog.
              </p>
            </div>

            <button
              type="submit"
              disabled={brochureUploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-moss-green)] text-white rounded-lg hover:opacity-90 font-semibold disabled:opacity-60"
            >
              {editingId ? "Update Catalog" : "Create Catalog"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BookOpen size={24} className="text-[var(--color-dark-teal)]" />
              Catalogs ({catalogs.length})
            </h2>
            {lastSyncedAt && (
              <span className="text-xs font-medium text-gray-500">Last synced: {lastSyncedAt}</span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] table-fixed">
            <colgroup>
              <col className="w-[24%]" />
              <col className="w-[20%]" />
              <col className="w-[24%]" />
              <col className="w-[12%]" />
              <col className="w-[20%]" />
            </colgroup>
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Catalog Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Short Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">PDF / Link</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Clickable</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {catalogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <AlertCircle size={48} className="text-gray-300" />
                      <p className="text-lg font-semibold text-gray-500">No catalogs yet</p>
                      <p className="text-sm text-gray-400">Add your first catalog to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                catalogs.map((catalog) => (
                  <tr key={catalog.id} className="hover:bg-blue-50 transition-all duration-200">
                    <td className="px-6 py-4 font-semibold text-gray-800 truncate" title={catalog.name}>
                      {catalog.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 truncate" title={catalog.shortName || ""}>
                      {catalog.shortName || <span className="text-gray-400">Not set</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {catalog.brochureUrl ? (
                        <a
                          href={catalog.brochureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[var(--color-dark-teal)] hover:underline"
                        >
                          <FileText size={14} />
                          Open brochure
                        </a>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {catalog.isProductClickable !== false ? (
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          View Only
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-nowrap items-center gap-2">
                        <button
                          onClick={() => handleEdit(catalog)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1 whitespace-nowrap"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm(`Are you sure you want to delete "${catalog.name}"?`)) return;
                            try {
                              setError(null);
                              const response = await fetch(`/api/admin/catalogs/${catalog.id}`, {
                                method: "DELETE",
                              });
                              if (!response.ok) {
                                throw new Error(`Failed to delete catalog (${response.status}).`);
                              }
                              await loadCatalogs();
                            } catch (error) {
                              console.error("Error deleting catalog:", error);
                              setError(error instanceof Error ? error.message : "Error deleting catalog.");
                            }
                          }}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1 whitespace-nowrap"
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
