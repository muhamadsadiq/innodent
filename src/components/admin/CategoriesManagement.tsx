// components/admin/CategoriesManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Palette, AlertCircle, CheckCircle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  bgColor?: string;
  borderColor?: string;
  titleColor?: string;
}

const DEFAULT_CATEGORY_FORM = {
  name: "",
  bgColor: "var(--color-deep-blue)",
  borderColor: "var(--color-sky-tint)",
  borderHoverColor: "var(--color-deep-blue)",
  titleColor: "var(--color-blue)",
  titleBgColor: "var(--color-sky-blue)",
  chipBorderColor: "var(--color-deep-blue)",
  chipTextColor: "var(--color-sky-blue)",
  imageBorderColor: "var(--color-muted-teal)",
};

const PREDEFINED_COLORS = {
  "var(--color-white)": "#ffffff",
  "var(--color-dark-teal)": "#1c9c9e",
  "var(--color-blue)": "#4e8fcc",
  "var(--color-sage)": "#9caf8d",
  "var(--color-lavender)": "#938dac",
  "var(--color-charcoal)": "#1e1e1e",
  "var(--color-gray)": "#8a8a8a",
  "var(--color-deep-blue)": "rgba(78, 143, 204, 0.7)",
  "var(--color-muted-sage)": "rgba(156, 175, 141, 0.4)",
  "var(--color-sky-blue)": "#83b1db",
  "var(--color-sky-tint)": "rgba(131, 177, 219, 0.4)",
  "var(--color-muted-teal)": "rgba(93, 182, 184, 0.4)",
  "var(--color-moss-green)": "#718c5c",
  "var(--color-deep-indigo)": "rgba(102, 92, 137, 0.7)",
  "var(--color-muted-lavender)": "rgba(147, 141, 172, 0.4)",
  "var(--color-deep-sage)": "rgba(156, 175, 141, 0.7)",
  "var(--color-deep-lavender)": "rgba(147, 141, 172, 0.7)",
  "var(--color-muted-blue)": "rgba(78, 143, 204, 0.4)",
  "var(--color-mist-white)": "#e2e2e2",
  "var(--color-ash-gray)": "#bdbdbd",
};

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [useCustom, setUseCustom] = useState(!Object.keys(PREDEFINED_COLORS).includes(value));
  const [customColor, setCustomColor] = useState(value);

  const handlePredefinedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedColor = e.target.value;
    if (selectedColor) {
      onChange(selectedColor);
      setUseCustom(false);
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
    onChange(e.target.value);
    setUseCustom(true);
  };

  const getDisplayValue = () => {
    if (useCustom) return customColor;
    return value;
  };

  const getHexValue = () => {
    if (useCustom) return customColor.startsWith("#") ? customColor : "#000000";
    return PREDEFINED_COLORS[value as keyof typeof PREDEFINED_COLORS] || "#000000";
  };

  const currentColor = useCustom
    ? customColor
    : PREDEFINED_COLORS[value as keyof typeof PREDEFINED_COLORS] || value;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-gray-300 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
            {useCustom ? "Custom" : "Preset"}
          </span>
          <div className="h-5 w-5 rounded-md border border-gray-300" style={{ backgroundColor: currentColor }} />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <select
          value={useCustom ? "" : value}
          onChange={handlePredefinedChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-2 py-2 text-xs focus:border-[var(--color-dark-teal)] focus:outline-none"
        >
          <option value="">Preset colors</option>
          {Object.entries(PREDEFINED_COLORS).map(([varName, hexValue]) => (
            <option key={varName} value={varName}>
              {varName.replace("var(--color-", "").replace(")", "")} ({hexValue})
            </option>
          ))}
        </select>

        <input
          type="color"
          value={getHexValue()}
          onChange={(e) => {
            setCustomColor(e.target.value);
            onChange(e.target.value);
            setUseCustom(true);
          }}
          className="h-[34px] w-12 cursor-pointer rounded-md border border-gray-300"
        />
      </div>

      <input
        type="text"
        value={getDisplayValue()}
        onChange={handleCustomChange}
        placeholder="Custom value (#hex or rgba)"
        className="mt-2 w-full rounded-lg border border-gray-300 px-2 py-2 text-xs font-mono focus:border-[var(--color-dark-teal)] focus:outline-none"
      />
    </div>
  );
}

export default function CategoriesManagement({ userRole: _userRole }: { userRole: string | null }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_CATEGORY_FORM);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      alert("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `/api/admin/categories/${editingId}`
        : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        alert("Error saving category");
        return;
      }

      await loadCategories();
      setShowForm(false);
      setEditingId(null);
      setFormData(DEFAULT_CATEGORY_FORM);
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Error saving category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      bgColor: category.bgColor || "var(--color-deep-blue)",
      borderColor: category.borderColor || "var(--color-sky-tint)",
      borderHoverColor: "var(--color-deep-blue)",
      titleColor: category.titleColor || "var(--color-blue)",
      titleBgColor: "var(--color-sky-blue)",
      chipBorderColor: "var(--color-deep-blue)",
      chipTextColor: "var(--color-sky-blue)",
      imageBorderColor: "var(--color-muted-teal)",
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Error deleting category");
        return;
      }

      await loadCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error deleting category");
    }
  };

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center min-h-[260px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading categories...</p>
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
              <Palette size={40} />
              Categories Management
            </h1>
            <p className="text-blue-100">Manage your product categories and customize color palettes</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
            }}
            className="px-6 py-3 bg-white text-[var(--color-dark-teal)] font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
            <div className="w-1 h-8 bg-[var(--color-dark-teal)] rounded-full"></div>
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
              <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">Category Name *</label>
                  <input
                    type="text"
                    placeholder="e.g., Restorative Materials"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-sm focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none"
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-700">Live preview</p>
                  <div className="rounded-xl border-2 p-3" style={{ borderColor: formData.borderColor, backgroundColor: formData.bgColor }}>
                    <div className="mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold" style={{ borderColor: formData.chipBorderColor, color: formData.chipTextColor }}>
                      {formData.name || "Category"}
                    </div>
                    <p className="text-sm font-bold" style={{ color: formData.titleColor }}>
                      Sample Product Title
                    </p>
                    <div className="mt-3 h-14 w-full rounded-lg border" style={{ borderColor: formData.imageBorderColor, backgroundColor: formData.titleBgColor }} />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-800">
                  <Palette size={18} className="text-[var(--color-dark-teal)]" />
                  Color Palette
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                 <ColorPicker
                   label="Background Color"
                   value={formData.bgColor}
                   onChange={(value) => setFormData({ ...formData, bgColor: value })}
                 />
                 <ColorPicker
                   label="Border Color"
                   value={formData.borderColor}
                   onChange={(value) => setFormData({ ...formData, borderColor: value })}
                 />
                 <ColorPicker
                   label="Border Hover Color"
                   value={formData.borderHoverColor}
                   onChange={(value) => setFormData({ ...formData, borderHoverColor: value })}
                 />
                 <ColorPicker
                   label="Title Color"
                   value={formData.titleColor}
                   onChange={(value) => setFormData({ ...formData, titleColor: value })}
                 />
                 <ColorPicker
                   label="Title Background Color"
                   value={formData.titleBgColor}
                   onChange={(value) => setFormData({ ...formData, titleBgColor: value })}
                 />
                 <ColorPicker
                   label="Chip Border Color"
                   value={formData.chipBorderColor}
                   onChange={(value) => setFormData({ ...formData, chipBorderColor: value })}
                 />
                 <ColorPicker
                   label="Chip Text Color"
                   value={formData.chipTextColor}
                   onChange={(value) => setFormData({ ...formData, chipTextColor: value })}
                 />
                 <ColorPicker
                   label="Image Border Color"
                   value={formData.imageBorderColor}
                   onChange={(value) => setFormData({ ...formData, imageBorderColor: value })}
                 />
                </div>
               </div>
             </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...DEFAULT_CATEGORY_FORM, name: prev.name }))}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-100 transition-all"
              >
                Reset Colors
              </button>
               <button
                 type="submit"
                 className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--color-moss-green)] to-[var(--color-dark-teal)] text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
               >
                 {editingId ? "Update Category" : "Create Category"}
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

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Palette size={24} className="text-[var(--color-dark-teal)]" />
            Categories ({categories.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
        <table className="w-full min-w-[920px]">
           <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Category Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Color Palette</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <AlertCircle size={48} className="text-gray-300" />
                    <p className="text-lg font-semibold text-gray-500">No categories yet</p>
                    <p className="text-sm text-gray-400">Create your first category to get started!</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">{category.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 items-center">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md transition-all hover:scale-110"
                        style={{
                          backgroundColor:
                            PREDEFINED_COLORS[category.bgColor as keyof typeof PREDEFINED_COLORS] ||
                            category.bgColor,
                        }}
                        title={`Background: ${category.bgColor}`}
                      ></div>
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md transition-all hover:scale-110"
                        style={{
                          backgroundColor:
                            PREDEFINED_COLORS[category.borderColor as keyof typeof PREDEFINED_COLORS] ||
                            category.borderColor,
                        }}
                        title={`Border: ${category.borderColor}`}
                      ></div>
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-sm hover:shadow-md transition-all hover:scale-110"
                        style={{
                          backgroundColor:
                            PREDEFINED_COLORS[category.titleColor as keyof typeof PREDEFINED_COLORS] ||
                            category.titleColor,
                        }}
                        title={`Title: ${category.titleColor}`}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1"
                        title="Edit category"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex items-center gap-1"
                        title="Delete category"
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
