// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  Palette,
  BookOpen,
  Activity,
  Users,
  LogOut,
  User,
  Shield,
} from "lucide-react";

type Section = "products" | "categories" | "catalogs" | "activities" | "users" | "overview";

interface AdminSidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  userRole: string | null;
  userName: string | null;
  onLogout: () => void;
}

const MENU_ICONS: Record<Section, React.ReactNode> = {
  overview: <LayoutDashboard size={20} />,
  products: <Package size={20} />,
  categories: <Palette size={20} />,
  catalogs: <BookOpen size={20} />,
  activities: <Activity size={20} />,
  users: <Users size={20} />,
};

export default function AdminSidebar({
  activeSection,
  onSectionChange,
  userRole,
  userName,
  onLogout,
}: AdminSidebarProps) {
  const isSuperAdmin = userRole === "SUPER_ADMIN";

  const menuItems: Array<{ id: Section; label: string; superAdminOnly?: boolean }> = [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "categories", label: "Categories" },
    { id: "catalogs", label: "Catalogs" },
    { id: "activities", label: "Activity Logs", superAdminOnly: true },
    { id: "users", label: "Users", superAdminOnly: true },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-[var(--color-charcoal)] to-[var(--color-charcoal)]/95 text-white flex flex-col shadow-2xl border-r-2 border-[var(--color-dark-teal)]">
      {/* Logo Section */}
      <div className="p-6 border-b-2 border-[var(--color-dark-teal)] bg-gradient-to-r from-[var(--color-charcoal)] to-[var(--color-deep-dark-teal)]">
        <Image
          src="/innodent-logo.svg"
          alt="InnoDent"
          width={150}
          height={40}
          className="w-full hover:opacity-80 transition-opacity"
        />
        <p className="text-xs text-[var(--color-sky-blue)] mt-2 text-center font-semibold">Admin Panel</p>
      </div>

      {/* User Info */}
      <div className="p-4 bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)]/30 border-b border-[var(--color-dark-teal)]/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--color-dark-teal)] rounded-lg">
            {isSuperAdmin ? (
              <Shield size={20} className="text-amber-400" />
            ) : (
              <User size={20} className="text-blue-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{userName}</p>
            <p className="text-xs text-[var(--color-sky-blue)]">
              {userRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-[var(--color-sky-blue)] px-4 mb-3 uppercase tracking-wider">Menu</p>
        {menuItems.map((item) => {
          if (item.superAdminOnly && !isSuperAdmin) {
            return null;
          }

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)] text-white shadow-lg scale-105"
                  : "hover:bg-[var(--color-dark-teal)]/50 text-gray-300 hover:text-white"
              }`}
            >
              <div className="text-[var(--color-sky-blue)] group-hover:text-white group-hover:scale-110 transition-all">
                {MENU_ICONS[item.id]}
              </div>
              <span className="font-medium text-sm">{item.label}</span>
              {activeSection === item.id && (
                <span className="ml-auto"><LogOut size={16} className="rotate-180" /></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t-2 border-[var(--color-dark-teal)]/30 bg-gradient-to-r from-[var(--color-charcoal)] to-[var(--color-deep-dark-teal)]">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

