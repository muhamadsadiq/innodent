// components/admin/CatalogsManagement.tsx
"use client";

import { useState, useEffect } from "react";

interface Catalog {
  id: string;
  name: string;
}

export default function CatalogsManagement({ userRole }: { userRole: string | null }) {
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    try {
      const response = await fetch("/api/admin/catalogs");
      const data = await response.json();
      setCatalogs(data);
    } catch (error) {
      console.error("Error loading catalogs:", error);
      alert("Error loading catalogs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId
        ? `/api/admin/catalogs/${editingId}`
        : "/api/admin/catalogs";
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
        alert("Error saving catalog");
        return;
      }

      await loadCatalogs();
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error saving catalog:", error);
      alert("Error saving catalog");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (catalog: Catalog) => {
    setFormData({ name: catalog.name });
    setEditingId(catalog.id);
    setShowForm(true);
  };

  const handleDelete = async (catalogId: string, catalogName: string) => {
    if (!confirm(`Are you sure you want to delete "${catalogName}"?`)) return;

    try {
      const response = await fetch(`/api/admin/catalogs/${catalogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        alert("Error deleting catalog");
        return;
      }

      await loadCatalogs();
    } catch (error) {
      console.error("Error deleting catalog:", error);
      alert("Error deleting catalog");
    }
  };

  if (loading && !showForm) {
    return <div>Loading catalogs...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--color-charcoal)]">Catalogs</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="px-4 py-2 bg-[var(--color-dark-teal)] text-white rounded-lg hover:opacity-90"
        >
          {showForm ? "Cancel" : "Add Catalog"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg mb-6 shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Catalog" : "Add New Catalog"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Catalog Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-moss-green)] text-white rounded-lg hover:opacity-90"
            >
              {editingId ? "Update Catalog" : "Create Catalog"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--color-mist-white)]">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogs.map((catalog) => (
              <tr key={catalog.id} className="border-t hover:bg-[var(--color-mist-white)]">
                <td className="px-6 py-3">{catalog.name}</td>
                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(catalog)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:opacity-90 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(catalog.id, catalog.name)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:opacity-90 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

