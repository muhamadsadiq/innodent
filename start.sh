#!/bin/bash
# Initialize database if needed
echo "Initializing database..."
npm run db:generate
npm run db:push -- --accept-data-loss
npm run db:seed
echo "Database ready!"
npm start


