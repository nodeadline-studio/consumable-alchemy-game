#!/bin/bash

# Consumable Alchemy - Setup Script
# This script sets up the development environment for the Consumable Alchemy project

echo "🧪 Setting up Consumable Alchemy Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file
echo "🔧 Setting up environment variables..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=https://api.consumablealchemy.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Ad Networks
NEXT_PUBLIC_AD_NETWORK_ID=your_ad_network_id

# Payment Processing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_id

# Development
NODE_ENV=development
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local already exists"
fi

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p public/images
mkdir -p public/icons
mkdir -p docs/images
mkdir -p tests/__mocks__

echo "✅ Project directories created"

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "⚠️  Type checking found issues. Please review and fix them."
else
    echo "✅ Type checking passed"
fi

# Run linting
echo "🧹 Running ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "⚠️  ESLint found issues. Please review and fix them."
else
    echo "✅ ESLint passed"
fi

# Build the project
echo "🏗️  Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build successful"

# Create git hooks
echo "🪝 Setting up git hooks..."
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run type checking
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ Type checking failed"
    exit 1
fi

# Run linting
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed"
    exit 1
fi

# Run tests
npm test -- --passWithNoTests
if [ $? -ne 0 ]; then
    echo "❌ Tests failed"
    exit 1
fi

echo "✅ Pre-commit checks passed"
EOF

chmod +x .git/hooks/pre-commit
echo "✅ Git hooks configured"

# Create development scripts
echo "📝 Creating development scripts..."
cat > dev-start.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Consumable Alchemy development server..."
npm run dev
EOF

cat > dev-test.sh << 'EOF'
#!/bin/bash
echo "🧪 Running Consumable Alchemy tests..."
npm test
EOF

cat > dev-build.sh << 'EOF'
#!/bin/bash
echo "🏗️  Building Consumable Alchemy for production..."
npm run build
EOF

chmod +x dev-*.sh
echo "✅ Development scripts created"

# Display completion message
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env.local with your actual API keys"
echo "   2. Run './dev-start.sh' to start the development server"
echo "   3. Open http://localhost:3000 in your browser"
echo "   4. Read the documentation in the docs/ folder"
echo ""
echo "🔗 Useful commands:"
echo "   ./dev-start.sh    - Start development server"
echo "   ./dev-test.sh     - Run tests"
echo "   ./dev-build.sh    - Build for production"
echo "   npm run lint      - Run ESLint"
echo "   npm run type-check - Run TypeScript checks"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - docs/DEVELOPMENT_GUIDE.md - Development instructions"
echo "   - docs/MONETIZATION_STRATEGY.md - Business strategy"
echo "   - docs/STARTUP_ACCELERATION_GUIDE.md - Growth strategy"
echo ""
echo "Happy coding! 🧪✨"
