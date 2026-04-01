// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Package,
  Palette,
  BookOpen,
  Activity,
  Users,
  Plus,
  Zap,
  Lightbulb,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductsManagement from "@/components/admin/ProductsManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import CatalogsManagement from "@/components/admin/CatalogsManagement";
import ActivityLogs from "@/components/admin/ActivityLogs";
import UsersManagement from "@/components/admin/UsersManagement";

type Section = "products" | "categories" | "catalogs" | "activities" | "users" | "overview";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const response = await fetch("/api/admin/auth/session");
        if (!response.ok) {
          router.push("/admin/login");
          return;
        }

        const session = await response.json();
        setUserRole(session.role ?? null);
        setUserName(session.name ?? null);
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    void bootstrapSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading...</p>
        </div>
      </div>
    );
  }

  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const handleNavigate = (section: Section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex h-screen bg-[var(--color-mist-white)]">
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        userRole={userRole}
        userName={userName}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeSection === "overview" && (
            <DashboardOverview
              userRole={userRole}
              userName={userName}
              onNavigate={handleNavigate}
            />
          )}
          {activeSection === "products" && <ProductsManagement />}
          {activeSection === "categories" && <CategoriesManagement userRole={userRole} />}
          {activeSection === "catalogs" && <CatalogsManagement />}
          {activeSection === "activities" && isSuperAdmin && <ActivityLogs />}
          {activeSection === "users" && isSuperAdmin && <UsersManagement />}
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({
  userRole,
  userName,
  onNavigate,
}: {
  userRole: string | null;
  userName: string | null;
  onNavigate: (section: Section) => void;
}) {
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)] rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, {userName}!</h1>
            <p className="text-blue-100 text-lg">
              Role: <span className="font-semibold">{userRole === "SUPER_ADMIN" ? "Super Administrator" : "Administrator"}</span>
            </p>
          </div>
          <BarChart3 size={64} className="text-white opacity-80" />
        </div>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-4 flex items-center gap-2">
          <BarChart3 size={28} className="text-[var(--color-dark-teal)]" />
          Management Sections
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Products"
            description="Add, edit, delete products"
            icon={<Package size={40} />}
            color="from-blue-500 to-blue-600"
            count="Management"
            onClick={() => onNavigate("products")}
          />
          <DashboardCard
            title="Categories"
            description="Manage & customize colors"
            icon={<Palette size={40} />}
            color="from-purple-500 to-purple-600"
            count="Management"
            onClick={() => onNavigate("categories")}
          />
          <DashboardCard
            title="Catalogs"
            description="Organize product groups"
            icon={<BookOpen size={40} />}
            color="from-green-500 to-green-600"
            count="Management"
            onClick={() => onNavigate("catalogs")}
          />
          {isSuperAdmin && (
            <>
              <DashboardCard
                title="Activity Logs"
                description="Track all admin actions"
                icon={<Activity size={40} />}
                color="from-orange-500 to-orange-600"
                count="Monitoring"
                onClick={() => onNavigate("activities")}
              />
              <DashboardCard
                title="Users"
                description="Manage admin accounts"
                icon={<Users size={40} />}
                color="from-red-500 to-red-600"
                count="Control"
                onClick={() => onNavigate("users")}
              />
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-[var(--color-charcoal)] mb-6 flex items-center gap-2">
          <Zap size={28} className="text-amber-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionItem
            icon={<Plus size={32} />}
            title="Add New Product"
            description="Create a new product and assign to catalogs"
            onClick={() => onNavigate("products")}
          />
          <QuickActionItem
            icon={<Palette size={32} />}
            title="Customize Category"
            description="Design color palettes for categories"
            onClick={() => onNavigate("categories")}
          />
          <QuickActionItem
            icon={<BookOpen size={32} />}
            title="Create Catalog"
            description="Organize products into catalogs"
            onClick={() => onNavigate("catalogs")}
          />
          {isSuperAdmin && (
            <>
              <QuickActionItem
                icon={<Activity size={32} />}
                title="View Activities"
                description="Monitor all admin activities and changes"
                onClick={() => onNavigate("activities")}
              />
              <QuickActionItem
                icon={<Users size={32} />}
                title="Manage Admins"
                description="Add or remove administrator accounts"
                onClick={() => onNavigate("users")}
              />
              <QuickActionItem
                icon={<BarChart3 size={32} />}
                title="View Logs"
                description="Detailed audit trail of all actions"
                onClick={() => onNavigate("activities")}
              />
            </>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-8">
        <h2 className="text-xl font-bold text-[var(--color-charcoal)] mb-4 flex items-center gap-2">
          <Lightbulb size={24} className="text-yellow-500" />
          Tips
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="text-blue-600 font-bold">•</span>
            <span>Use color palettes to maintain brand consistency across categories</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-purple-600 font-bold">•</span>
            <span>Mark products as "Best Seller" and "New" to highlight important items</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 font-bold">•</span>
            <span>{isSuperAdmin ? "Review activity logs regularly to track system usage" : "Contact your Super Admin for access to activity logs"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  icon,
  color,
  count,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer border-0 text-left w-full`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-white">{icon}</div>
        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          {count}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </button>
  );
}

function QuickActionItem({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-lg p-4 hover:border-[var(--color-dark-teal)] hover:shadow-md transition-all cursor-pointer text-left w-full hover:bg-blue-50"
    >
      <div className="text-[var(--color-dark-teal)] mb-3">{icon}</div>
      <h3 className="font-bold text-[var(--color-charcoal)] mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}
