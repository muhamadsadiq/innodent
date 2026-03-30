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

  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-6 h-6 rounded-lg border-2 border-gray-300 shadow-sm flex-shrink-0"
          style={{
            backgroundColor: useCustom ? customColor : PREDEFINED_COLORS[value as keyof typeof PREDEFINED_COLORS] || value,
          }}
        ></div>
        <label className="text-sm font-bold text-gray-800">{label}</label>
      </div>

      <div className="space-y-2">
        {/* Predefined Colors Dropdown */}
        <select
          value={useCustom ? "" : value}
          onChange={handlePredefinedChange}
          className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all bg-white"
        >
          <option value="">-- Select a color --</option>
          {Object.entries(PREDEFINED_COLORS).map(([varName, hexValue]) => (
            <option key={varName} value={varName}>
              {varName.replace("var(--color-", "").replace(")", "")} - {hexValue}
            </option>
          ))}
        </select>

        {/* OR Divider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs font-semibold text-gray-500 px-2">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Custom Color Input */}
        <div className="flex gap-2">
          <input
            type="color"
            value={getHexValue()}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onChange(e.target.value);
              setUseCustom(true);
            }}
            className="w-12 h-10 border-2 border-gray-300 rounded-lg cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
          />
          <input
            type="text"
            value={getDisplayValue()}
            onChange={handleCustomChange}
            placeholder="e.g., #ff0000 or rgba(255,0,0,0.5)"
            className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Color Preview */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div
          className="w-full h-12 rounded-lg border-2 border-gray-300 shadow-sm transition-all"
          style={{
            backgroundColor: useCustom ? customColor : PREDEFINED_COLORS[value as keyof typeof PREDEFINED_COLORS] || value,
          }}
        ></div>
        <p className="text-xs text-gray-500 mt-2 text-center font-mono">
          {useCustom ? customColor : value}
        </p>
      </div>
    </div>
  );
}

export default function CategoriesManagement({ userRole }: { userRole: string | null }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    bgColor: "var(--color-deep-blue)",
    borderColor: "var(--color-sky-tint)",
    borderHoverColor: "var(--color-deep-blue)",
    titleColor: "var(--color-blue)",
    titleBgColor: "var(--color-sky-blue)",
    chipBorderColor: "var(--color-deep-blue)",
    chipTextColor: "var(--color-sky-blue)",
    imageBorderColor: "var(--color-muted-teal)",
  });

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
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
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
      setFormData({
        name: "",
        bgColor: "var(--color-deep-blue)",
        borderColor: "var(--color-sky-tint)",
        borderHoverColor: "var(--color-deep-blue)",
        titleColor: "var(--color-blue)",
        titleBgColor: "var(--color-sky-blue)",
        chipBorderColor: "var(--color-deep-blue)",
        chipTextColor: "var(--color-sky-blue)",
        imageBorderColor: "var(--color-muted-teal)",
      });
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
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
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
      <div className="flex items-center justify-center min-h-screen">
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
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category Name *</label>
              <input
                type="text"
                placeholder="e.g., Restorative Materials"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-base focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
              />
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Palette size={24} className="text-[var(--color-dark-teal)]" />
                Color Palette
              </h3>
              <div className="space-y-5">
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

            <div className="flex gap-3 pt-4">
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

        <table className="w-full">
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
  );
}

