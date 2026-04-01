const REQUIRED_IN_PRODUCTION = ["DATABASE_URL", "JWT_SECRET"] as const;

export function validateRequiredServerEnv() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missing = REQUIRED_IN_PRODUCTION.filter((name) => {
    const value = process.env[name];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

