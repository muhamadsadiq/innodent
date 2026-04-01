// components/admin/ActivityLogs.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Activity,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock3,
  Monitor,
  Shield,
  User,
} from "lucide-react";

type DiffValue = {
  old?: unknown;
  new?: unknown;
};

type ActivityLogRow = {
  id: string;
  action: string;
  actionSummary?: string;
  entityType: string;
  entityId?: string;
  entityName?: string | null;
  createdAt: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  changes?: Record<string, unknown> | null;
  user?: { name?: string | null; email?: string | null; role?: string | null } | null;
};

function prettyText(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function shortUserAgent(ua: string | null | undefined) {
  if (!ua) return "-";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Firefox")) return "Firefox";
  return ua.slice(0, 40);
}

function stringifyValue(value: unknown) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "[unreadable]";
  }
}

function getDiffRows(changes: Record<string, unknown> | null | undefined): Array<{ key: string; oldValue: unknown; newValue: unknown }> {
  if (!changes) return [];

  return Object.entries(changes).map(([key, raw]) => {
    const typed = (raw || {}) as DiffValue;
    return {
      key,
      oldValue: typed.old,
      newValue: typed.new,
    };
  });
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void loadLogs();
  }, []);

  const loadLogs = async (isManualRefresh = false) => {
    try {
      setError(null);
      if (isManualRefresh) {
        setRefreshing(true);
      }

      const response = await fetch("/api/admin/activities", { method: "GET" });

      if (!response.ok) {
        if (response.status === 403) throw new Error("Only Super Admin can access activity logs.");
        if (response.status === 401) throw new Error("Your session has expired. Please log in again.");
        throw new Error(`Failed to load activity logs (${response.status}).`);
      }

      const data = (await response.json()) as ActivityLogRow[];
      setLogs(Array.isArray(data) ? data : []);
      setLastSyncedAt(new Date().toLocaleTimeString());
      setExpanded({});
    } catch (err) {
      console.error("Error loading activity logs:", err);
      setError(err instanceof Error ? err.message : "Failed to load activity logs.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalChanges = useMemo(
    () => logs.reduce((acc, log) => acc + getDiffRows(log.changes).length, 0),
    [logs],
  );

  if (loading) {
    return (
      <div className="flex min-h-[260px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-dark-teal)] border-t-transparent"></div>
          <p className="mt-4 text-[var(--color-gray)]">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="rounded-xl bg-gradient-to-r from-[var(--color-dark-teal)] to-[var(--color-moss-green)] p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2 flex items-center gap-3 text-4xl font-bold">
              <Activity size={40} />
              Activity Logs
            </h1>
            <p className="text-blue-100">Detailed audit trail of admin actions, changes, and request context</p>
          </div>
          <button
            type="button"
            onClick={() => void loadLogs(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="overflow-hidden rounded-xl border-2 border-gray-100 bg-white shadow-lg">
        <div className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
              <Activity size={24} className="text-[var(--color-dark-teal)]" />
              Recent Activities ({logs.length})
            </h2>
            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">Total field changes: {totalChanges}</p>
              {lastSyncedAt && <p className="text-xs font-medium text-gray-500">Last synced: {lastSyncedAt}</p>}
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 border-l-4 border-red-500 bg-red-50 p-6">
            <AlertCircle size={24} className="mt-0.5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-bold text-red-800">{error}</p>
              <p className="mt-1 text-sm text-red-600">Please try again or contact administrator.</p>
              <button
                type="button"
                onClick={() => void loadLogs(true)}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold text-gray-500">No activity logs yet</p>
            <p className="mt-1 text-sm text-gray-400">Admin activities will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => {
              const isOpen = Boolean(expanded[log.id]);
              const diffRows = getDiffRows(log.changes);
              return (
                <div key={log.id} className="p-4 hover:bg-blue-50/60">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(log.id)}
                    className="w-full rounded-lg p-2 text-left hover:bg-white"
                  >
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1.2fr_1.8fr_1.2fr_1fr_auto] lg:items-center">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-800">{log.user?.name || "Unknown"}</p>
                        <p className="truncate text-xs text-gray-500">{log.user?.email || "No email"}</p>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--color-charcoal)]">
                          {log.actionSummary || `${prettyText(log.action)} ${log.entityName || log.entityType}`}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {log.entityType} {log.entityId ? `#${log.entityId.slice(0, 8)}` : ""}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                          {prettyText(log.action)}
                        </span>
                        {diffRows.length > 0 && (
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                            {diffRows.length} change{diffRows.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-600">
                        <p className="font-medium">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="text-gray-500">{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
                      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-gray-500">
                            <User size={13} /> Actor
                          </p>
                          <p className="text-sm font-medium text-gray-800">{log.user?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-600">{log.user?.email || "No email"}</p>
                          <p className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                            {log.user?.role || "-"}
                          </p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-gray-500">
                            <Clock3 size={13} /> Entity
                          </p>
                          <p className="text-sm font-medium text-gray-800">{log.entityName || log.entityType}</p>
                          <p className="text-xs text-gray-600">Type: {log.entityType}</p>
                          <p className="text-xs text-gray-600">ID: {log.entityId || "-"}</p>
                        </div>

                        <div className="rounded-lg bg-gray-50 p-3">
                          <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-gray-500">
                            <Shield size={13} /> Request
                          </p>
                          <p className="text-xs text-gray-700">IP: {log.ipAddress || "-"}</p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-gray-700">
                            <Monitor size={12} />
                            {shortUserAgent(log.userAgent)}
                          </p>
                        </div>
                      </div>

                      {diffRows.length > 0 ? (
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                          <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-100 px-3 py-2 text-xs font-bold uppercase tracking-wide text-gray-600">
                            <span>Field</span>
                            <span>Before</span>
                            <span>After</span>
                          </div>
                          {diffRows.map((row) => (
                            <div key={row.key} className="grid grid-cols-[1fr_1fr_1fr] border-t border-gray-100 px-3 py-2 text-sm">
                              <span className="font-medium text-gray-700">{prettyText(row.key)}</span>
                              <span className="truncate text-gray-600" title={stringifyValue(row.oldValue)}>
                                {stringifyValue(row.oldValue)}
                              </span>
                              <span className="truncate text-gray-800" title={stringifyValue(row.newValue)}>
                                {stringifyValue(row.newValue)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No field-level diff captured for this activity.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
