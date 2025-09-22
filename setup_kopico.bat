@echo off
echo 🤖 Setting up Kopico AI Coffee Assistant...

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

:: Create virtual environment
echo 📦 Creating virtual environment...
python -m venv kopico_env

:: Activate virtual environment
echo 🔄 Activating virtual environment...
call kopico_env\Scripts\activate.bat

:: Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

echo ✅ Setup complete!
echo.
echo 🚀 To start Kopico AI:
echo 1. Run: kopico_env\Scripts\activate.bat
echo 2. Run: python kopico_bot.py
echo.
echo 🌐 The API will be available at http://localhost:5000
echo ☕ Your website will connect to Kopico for AI-powered coffee assistance!
pause