// components/admin/ProductsManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/db";
import type { Product } from "@/types";
import { Plus, Edit2, Trash2, Package, AlertCircle, CheckCircle, Info } from "lucide-react";

interface ProductsManagementProps {
  userRole: string | null;
}

interface Catalog {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsManagement({ userRole }: ProductsManagementProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [keepCatalogCategory, setKeepCatalogCategory] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    catalogId: "",
    categoryId: "",
    image: "",
    component: "",
    shades: "",
    isBestSeller: false,
    isNew: false,
  });

  useEffect(() => {
    loadProducts();
    loadCatalogsAndCategories();
  }, []);

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

      const dataToSend = {
        ...formData,
        shades: JSON.stringify(shadesArray),
      };

      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
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
          component: "",
          shades: "",
          isBestSeller: false,
          isNew: false,
        });
        setKeepCatalogCategory(false);
      } else if (keepCatalogCategory) {
        // If adding and "keep catalog/category" is enabled, reset only the product details
        setFormData((prev) => ({
          ...prev,
          name: "",
          description: "",
          shortDescription: "",
          image: "",
          component: "",
          shades: "",
          isBestSeller: false,
          isNew: false,
          // Keep catalogId and categoryId
        }));
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
          component: "",
          shades: "",
          isBestSeller: false,
          isNew: false,
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    // Parse shades array back to comma-separated string for editing
    let shadesString = "";
    if (product.shades) {
      try {
        const shadesArray = JSON.parse(product.shades);
        shadesString = Array.isArray(shadesArray) ? shadesArray.join(", ") : "";
      } catch (e) {
        shadesString = product.shades;
      }
    }

    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      catalogId: product.catalogId,
      categoryId: product.categoryId || "",
      image: product.image,
      component: product.component || "",
      shades: shadesString,
      isBestSeller: product.isBestSeller,
      isNew: product.isNew,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
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

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL *</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-sky-tint)] focus:outline-none transition-all"
              />
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--color-moss-green)] to-[var(--color-dark-teal)] text-white font-bold rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                {editingId ? "Update Product" : "Create Product"}
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

        <table className="w-full">
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
  );
}

