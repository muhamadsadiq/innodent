import { NextRequest } from "next/server";

type DiffEntry = {
  old: unknown;
  new: unknown;
};

export type ActivityChanges = Record<string, DiffEntry>;

function normalizeForCompare(value: unknown) {
  if (value === undefined) return null;
  return value;
}

function isEqual(a: unknown, b: unknown) {
  return JSON.stringify(normalizeForCompare(a)) === JSON.stringify(normalizeForCompare(b));
}

export function pickFields<T extends Record<string, unknown>>(source: T, fields: string[]) {
  const picked: Record<string, unknown> = {};
  for (const field of fields) {
    picked[field] = source[field];
  }
  return picked;
}

export function buildCreateChanges(afterValues: Record<string, unknown>, fields: string[]): ActivityChanges {
  const changes: ActivityChanges = {};
  for (const field of fields) {
    changes[field] = {
      old: null,
      new: normalizeForCompare(afterValues[field]),
    };
  }
  return changes;
}

export function buildDeleteChanges(beforeValues: Record<string, unknown>, fields: string[]): ActivityChanges {
  const changes: ActivityChanges = {};
  for (const field of fields) {
    changes[field] = {
      old: normalizeForCompare(beforeValues[field]),
      new: null,
    };
  }
  return changes;
}

export function buildUpdateChanges(
  beforeValues: Record<string, unknown>,
  afterValues: Record<string, unknown>,
  fields: string[],
): ActivityChanges {
  const changes: ActivityChanges = {};
  for (const field of fields) {
    const oldValue = normalizeForCompare(beforeValues[field]);
    const newValue = normalizeForCompare(afterValues[field]);
    if (!isEqual(oldValue, newValue)) {
      changes[field] = {
        old: oldValue,
        new: newValue,
      };
    }
  }
  return changes;
}

export function getRequestMetadata(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  const ipAddress = forwarded.split(",")[0]?.trim() || request.headers.get("x-real-ip") || null;
  const userAgent = request.headers.get("user-agent") || null;

  return {
    ipAddress,
    userAgent,
  };
}

