# Port Configuration Guide

This project uses environment variables for all port configurations to avoid hardcoded values and port collisions.

## Environment Variables

| Variable | Default | Description |
|----------|---------|------------|
| `PORT` | 3000 | Frontend development server |
| `QA_PORT` | 3001 | QA testing server |
| `API_PORT` | 3002 | API server |
| `BACKEND_PORT` | 3003 | Backend server |

## Quick Setup

```bash
# Create environment file with default ports
node scripts/setup-env.js

# Or manually create .env.local
echo "PORT=3000" > .env.local
echo "QA_PORT=3001" >> .env.local
echo "API_PORT=3002" >> .env.local
echo "BACKEND_PORT=3003" >> .env.local
```

## Usage

### Development Servers

```bash
# Frontend (default port 3000)
npm run dev

# QA Testing (port 3001)
npm run dev:qa

# API Server (port 3002)
npm run dev:api

# Backend Server (port 3003)
npm run dev:backend
```

### Custom Ports

```bash
# Use custom ports
PORT=4000 npm run dev
QA_PORT=4001 npm run dev:qa
API_PORT=4002 npm run dev:api
BACKEND_PORT=4003 npm run dev:backend
```

### Testing

```bash
# Run tests with specific QA port
QA_PORT=3001 node test-api-search.js

# Run all tests
QA_PORT=3001 npm run test:all
```

## Configuration Files

- **`.env.local`** - Local environment variables (not committed)
- **`env.example`** - Example environment file (committed)
- **`lib/config/ports.ts`** - Port configuration utility
- **`lib/config/test-config.ts`** - Test configuration utility

## Port Management

### Frontend (PORT)
- **Default**: 3000
- **Usage**: Main application development
- **Script**: `npm run dev`

### QA Testing (QA_PORT)
- **Default**: 3001
- **Usage**: Automated testing and QA
- **Script**: `npm run dev:qa`

### API Server (API_PORT)
- **Default**: 3002
- **Usage**: API endpoints and services
- **Script**: `npm run dev:api`

### Backend (BACKEND_PORT)
- **Default**: 3003
- **Usage**: Backend services and database
- **Script**: `npm run dev:backend`

## Test Configuration

Test files automatically use the `QA_PORT` environment variable:

```javascript
const { getTestConfig } = require('./lib/config/test-config');

const testConfig = getTestConfig();
// Uses QA_PORT from environment
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Kill process using the port
kill -9 $(lsof -t -i:3000)

# Use different port
PORT=4000 npm run dev
```

### Environment Variables Not Loading
```bash
# Check if .env.local exists
ls -la .env.local

# Recreate environment file
node scripts/setup-env.js
```

## Best Practices

1. **Never hardcode ports** - Always use environment variables
2. **Use different ports** for different services to avoid conflicts
3. **Document port usage** in your team's development guide
4. **Use .env.local** for local development (not committed)
5. **Use env.example** for sharing configuration templates

## Examples

### Development Workflow
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: QA Testing
npm run dev:qa

# Terminal 3: Run Tests
QA_PORT=3001 node test-api-search.js
```

### Production Deployment
```bash
# Set production ports
PORT=8080 npm run start
```

### Team Development
```bash
# Developer A
PORT=3000 npm run dev

# Developer B (different port to avoid conflict)
PORT=3004 npm run dev
```
