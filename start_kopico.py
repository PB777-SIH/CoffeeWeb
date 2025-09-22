#!/usr/bin/env python3
"""
Kopico AI Coffee Assistant - Quick Launcher
Simple script to start the Kopico backend server
"""

import subprocess
import sys
import os
import time
import webbrowser
from pathlib import Path

def check_requirements():
    """Check if required packages are installed"""
    try:
        import flask
        import flask_cors
        import nltk
        import sklearn
        import numpy
        print("✅ All required packages are installed!")
        return True
    except ImportError as e:
        print(f"❌ Missing package: {e}")
        return False

def install_requirements():
    """Install required packages"""
    print("📦 Installing requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install requirements")
        return False

def download_nltk_data():
    """Download required NLTK data"""
    print("📚 Downloading NLTK data...")
    try:
        import nltk
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        print("✅ NLTK data downloaded!")
        return True
    except Exception as e:
        print(f"❌ Failed to download NLTK data: {e}")
        return False

def start_kopico_server():
    """Start the Kopico AI server"""
    print("🚀 Starting Kopico AI server...")
    try:
        # Change to the script directory
        os.chdir(Path(__file__).parent)
        
        # Start the Flask server
        subprocess.Popen([sys.executable, "kopico_bot.py"])
        print("✅ Kopico server started on http://localhost:5000")
        
        # Wait a moment for server to start
        time.sleep(3)
        
        # Try to open the website
        try:
            # Look for index.html in current directory
            index_path = Path("index.html")
            if index_path.exists():
                webbrowser.open(f"file://{index_path.absolute()}")
                print("🌐 Website opened in your browser!")
            else:
                print("📝 Please open index.html in your browser to use the website")
        except Exception:
            print("📝 Please open index.html in your browser to use the website")
            
        return True
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        return False

def main():
    """Main launcher function"""
    print("🤖 Kopico AI Coffee Assistant Launcher")
    print("=" * 40)
    
    # Check if requirements.txt exists
    if not Path("requirements.txt").exists():
        print("❌ requirements.txt not found!")
        return
    
    # Check if kopico_bot.py exists
    if not Path("kopico_bot.py").exists():
        print("❌ kopico_bot.py not found!")
        return
    
    # Check requirements
    if not check_requirements():
        print("📦 Installing missing packages...")
        if not install_requirements():
            print("❌ Installation failed. Please run manually:")
            print("   pip install -r requirements.txt")
            return
    
    # Download NLTK data
    if not download_nltk_data():
        print("⚠️  NLTK data download failed, but continuing...")
    
    # Start server
    if start_kopico_server():
        print("\n🎉 Kopico is now running!")
        print("💬 You can now chat with Kopico on your website!")
        print("🛑 Press Ctrl+C to stop the server")
        
        try:
            # Keep the launcher running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 Kopico stopped. Thanks for using our AI assistant!")
    else:
        print("❌ Failed to start Kopico. Please check the error messages above.")

if __name__ == "__main__":
    main()