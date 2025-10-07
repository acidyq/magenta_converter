#!/bin/bash

# Magenta Converter Development Setup Script

echo "🎨 Setting up Magenta Converter for development..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if Redis is running (for local development)
if ! command -v redis-cli &> /dev/null; then
    echo "⚠️  Redis is not installed. Installing via Homebrew..."
    brew install redis
fi

# Start Redis if not running
if ! redis-cli ping &> /dev/null; then
    echo "🔄 Starting Redis..."
    brew services start redis
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build shared package
echo "🔧 Building shared package..."
cd packages/shared && npm run build && cd ../..

# Copy environment files
echo "📝 Setting up environment files..."
cp apps/web/.env.local.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development servers:"
echo "   npm run dev"
echo ""
echo "   Or individually:"
echo "   Terminal 1: cd apps/api && npm run dev"
echo "   Terminal 2: cd apps/web && npm run dev"
echo ""
echo "📱 Access the app at: http://localhost:4003"
