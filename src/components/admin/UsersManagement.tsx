// components/admin/UsersManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Users, AlertCircle, Shield, User as UserIcon, RefreshCw, UserPlus } from "lucide-react";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt?: string;
};

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    void loadUsers();
  }, []);

  const loadUsers = async (isManualRefresh = false) => {
    try {
      setError(null);
      if (isManualRefresh) {
        setRefreshing(true);
      }

      const response = await fetch("/api/admin/users", {
        method: "GET",
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Only Super Admin can access user management.");
        }
        if (response.status === 401) {
          throw new Error("Your session has expired. Please log in again.");
        }
        throw new Error(`Failed to load users (${response.status}).`);
      }

      const data = (await response.json()) as AdminUser[];
      setUsers(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error loading users:", error);
      setError(error instanceof Error ? error.message : "Failed to load users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    const name = newAdmin.name.trim();
    const email = newAdmin.email.trim();

    if (!name || !email || !newAdmin.password) {
      setCreateError("Name, email, and password are required.");
      return;
    }

    if (newAdmin.password.length < 8) {
      setCreateError("Password must be at least 8 characters.");
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setCreateError("Passwords do not match.");
      return;
    }

    try {
      setCreatingUser(true);
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password: newAdmin.password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error || `Failed to create user (${response.status}).`);
      }

      setCreateSuccess("Admin user created successfully.");
      setNewAdmin({ name: "", email: "", password: "", confirmPassword: "" });
      await loadUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Failed to create admin user.");
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading users...</p>
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
              <Users size={40} />
              Users Management
            </h1>
            <p className="text-blue-100">Manage administrator accounts and permissions</p>
          </div>
          <button
            type="button"
            onClick={() => void loadUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800">
          <UserPlus size={22} className="text-[var(--color-dark-teal)]" />
          Add Admin User
        </h2>

        <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <input
            type="text"
            placeholder="Full name"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin((prev) => ({ ...prev, name: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email address"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin((prev) => ({ ...prev, email: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin((prev) => ({ ...prev, password: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:outline-none"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={newAdmin.confirmPassword}
            onChange={(e) => setNewAdmin((prev) => ({ ...prev, confirmPassword: e.target.value }))}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-dark-teal)] focus:outline-none"
          />

          <div className="lg:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={creatingUser}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-dark-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus size={16} />
              {creatingUser ? "Creating..." : "Create Admin"}
            </button>
            {createError && <p className="text-sm font-medium text-red-600">{createError}</p>}
            {createSuccess && <p className="text-sm font-medium text-green-700">{createSuccess}</p>}
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users size={24} className="text-[var(--color-dark-teal)]" />
              Admin Users ({users.length})
            </h2>
            {lastSyncedAt && (
              <span className="text-xs font-medium text-gray-500">Last synced: {lastSyncedAt}</span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-800">{error}</p>
              <p className="text-sm text-red-600 mt-1">Please try again or contact administrator.</p>
              <button
                type="button"
                onClick={() => void loadUsers(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          </div>
        )}

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-500">No users found</p>
            <p className="text-sm text-gray-400 mt-1">There are no admin users in the system</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50 transition-all duration-200">
                  <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.role === "SUPER_ADMIN" ? (
                        <>
                          <Shield size={16} className="text-amber-600" />
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold">
                            Super Admin
                          </span>
                        </>
                      ) : (
                        <>
                          <UserIcon size={16} className="text-blue-600" />
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Admin
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
