#!/bin/sh
set -e

echo "[entrypoint] Waiting for MongoDB at ${MONGO_URL}..."

# Retry MongoDB connection up to 30 times (60s total)
RETRIES=30
until node -e "
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URL)
    .then(() => { mongoose.disconnect(); process.exit(0); })
    .catch(() => process.exit(1));
" 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -eq 0 ]; then
    echo "[entrypoint] MongoDB not reachable after 30 retries. Exiting."
    exit 1
  fi
  echo "[entrypoint] MongoDB not ready, retrying in 2s... ($RETRIES left)"
  sleep 2
done

echo "[entrypoint] MongoDB is ready."

echo "[entrypoint] Running seed script..."
node seed.js

echo "[entrypoint] Starting server..."
exec node ./bin/www
