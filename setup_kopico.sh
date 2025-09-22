#!/bin/bash

# Kopico AI Coffee Assistant Setup Script

echo "🤖 Setting up Kopico AI Coffee Assistant..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv kopico_env

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source kopico_env/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🚀 To start Kopico AI:"
echo "1. Activate environment: source kopico_env/bin/activate"
echo "2. Run the bot: python kopico_bot.py"
echo ""
echo "🌐 The API will be available at http://localhost:5000"
echo "☕ Your website will connect to Kopico for AI-powered coffee assistance!"