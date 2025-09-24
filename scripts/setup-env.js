#!/usr/bin/env node

/**
 * Environment Setup Script
 * Creates .env.local with port configurations
 */

const fs = require('fs');
const path = require('path');

const envContent = `# Port Configuration
PORT=3000
QA_PORT=3001
API_PORT=3002
BACKEND_PORT=3003

# App Configuration
NEXT_PUBLIC_APP_NAME="Consumable Alchemy Game"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Feature Flags
NEXT_PUBLIC_ENABLE_ADS="false"
NEXT_PUBLIC_ENABLE_ANALYTICS="false"
NEXT_PUBLIC_ENABLE_PAYMENTS="false"
NEXT_PUBLIC_DEBUG_MODE="true"

# Test Configuration
TEST_TIMEOUT=30000
TEST_VIEWPORT_WIDTH=1280
TEST_VIEWPORT_HEIGHT=720
TEST_HEADLESS=false
TEST_SLOW_MO=100
`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local with port configurations');
  console.log('\n📝 Port Configuration:');
  console.log('  Frontend: PORT=3000 (default)');
  console.log('  QA Tests: QA_PORT=3001');
  console.log('  API: API_PORT=3002');
  console.log('  Backend: BACKEND_PORT=3003');
  console.log('\n🚀 Usage:');
  console.log('  npm run dev          # Frontend on port 3000');
  console.log('  npm run dev:qa       # QA server on port 3001');
  console.log('  npm run dev:api      # API server on port 3002');
  console.log('  npm run dev:backend  # Backend server on port 3003');
  console.log('\n🧪 Testing:');
  console.log('  QA_PORT=3001 node test-api-search.js');
  console.log('  PORT=3000 npm run dev && QA_PORT=3001 node test-api-search.js');
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
}
