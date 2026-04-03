#!/usr/bin/env bash
set -euo pipefail

echo "Initializing Prisma client..."
npm run db:generate

echo "Applying database migrations..."
npm run db:migrate:deploy

if [[ "${SEED_ON_BOOT:-false}" == "true" ]]; then
  echo "SEED_ON_BOOT=true -> seeding database..."
  npm run db:seed
fi

echo "Starting application..."
exec npm run start
