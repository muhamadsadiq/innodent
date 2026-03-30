// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRole", data.role);

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[var(--color-deep-dark-teal)] to-[var(--color-dark-teal-tint)]">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src="/innodent-logo.svg"
              alt="InnoDent"
              width={150}
              height={40}
            />
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-charcoal)]">Admin Dashboard</h1>
          <p className="mt-2 text-[var(--color-gray)]">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[var(--color-light-gray)] px-4 py-2 focus:border-[var(--color-dark-teal)] focus:outline-none"
              placeholder="admin@innodent.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-charcoal)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-[var(--color-light-gray)] px-4 py-2 focus:border-[var(--color-dark-teal)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-dark-teal)] py-2 font-semibold text-white transition-colors hover:bg-[var(--color-pale-blue)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--color-gray)]">
          Demo credentials:<br />
          Super Admin: superadmin@innodent.com / password123<br />
          Admin: admin@innodent.com / password123
        </p>
      </div>
    </div>
  );
}


