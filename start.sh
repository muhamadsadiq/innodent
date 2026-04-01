#!/usr/bin/env bash
set -euo pipefail

echo "Initializing database client..."
npm run db:generate

echo "Syncing database schema..."
npm run db:push

if [[ "${SEED_ON_BOOT:-false}" == "true" ]]; then
  echo "Seeding database..."
  npm run db:seed
fi

echo "Starting application..."
npm run start
