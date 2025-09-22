#!/usr/bin/env python3
"""
Kopico AI System Test Suite
Tests all components of the AI-powered coffee website
"""

import requests
import time
import json
import sys
from pathlib import Path

def test_backend_health():
    """Test if the backend is running and responding"""
    try:
        response = requests.get('http://localhost:5000/health', timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check passed")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Backend not reachable: {e}")
        return False

def test_chat_endpoint():
    """Test the main chat functionality"""
    test_messages = [
        "Hello",
        "Can you recommend a coffee?",
        "How do I brew pour-over coffee?",
        "Tell me about Ethiopian coffee",
        "I like strong, nutty flavors"
    ]
    
    print("\n🧪 Testing Chat Endpoint:")
    for message in test_messages:
        try:
            response = requests.post(
                'http://localhost:5000/chat',
                json={
                    'message': message,
                    'user_id': 'test_user'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ '{message}' -> {data['response'][:50]}...")
            else:
                print(f"❌ '{message}' -> Failed ({response.status_code})")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ '{message}' -> Error: {e}")
    
    return True

def test_recommendations_endpoint():
    """Test the coffee recommendations endpoint"""
    print("\n🧪 Testing Recommendations Endpoint:")
    try:
        response = requests.post(
            'http://localhost:5000/coffee-recommendations',
            json={
                'preferences': {
                    'strength': 'strong',
                    'flavor': 'nutty',
                    'acidity': 'low'
                }
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Recommendations: {len(data.get('recommendations', []))} coffees recommended")
            return True
        else:
            print(f"❌ Recommendations failed: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Recommendations error: {e}")
        return False

def test_frontend_files():
    """Test if all frontend files exist"""
    print("\n🧪 Testing Frontend Files:")
    required_files = [
        'index.html',
        'style.css',
        'main.js',
        'kopico_bot.py',
        'requirements.txt',
        'start_kopico.py'
    ]
    
    all_exist = True
    for file in required_files:
        if Path(file).exists():
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} missing")
            all_exist = False
    
    return all_exist

def test_ai_intelligence():
    """Test AI reasoning capabilities"""
    print("\n🧪 Testing AI Intelligence:")
    
    intelligent_queries = [
        {
            'query': 'I want something between espresso and regular coffee',
            'expected_keywords': ['medium', 'blend', 'strength']
        },
        {
            'query': 'What coffee goes well with milk?',
            'expected_keywords': ['latte', 'cappuccino', 'milk', 'espresso']
        },
        {
            'query': 'I am a beginner to coffee',
            'expected_keywords': ['mild', 'beginner', 'smooth', 'start']
        }
    ]
    
    for test in intelligent_queries:
        try:
            response = requests.post(
                'http://localhost:5000/chat',
                json={
                    'message': test['query'],
                    'user_id': 'intelligence_test'
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                response_text = data['response'].lower()
                
                # Check if response contains expected keywords
                found_keywords = [kw for kw in test['expected_keywords'] if kw in response_text]
                
                if found_keywords:
                    print(f"✅ Intelligent response for: '{test['query']}'")
                    print(f"   Found keywords: {found_keywords}")
                else:
                    print(f"⚠️  Basic response for: '{test['query']}'")
                    print(f"   Expected: {test['expected_keywords']}")
            else:
                print(f"❌ Query failed: '{test['query']}'")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Intelligence test error: {e}")

def run_performance_test():
    """Test response times"""
    print("\n🧪 Testing Performance:")
    
    start_time = time.time()
    try:
        response = requests.post(
            'http://localhost:5000/chat',
            json={
                'message': 'Hello, how are you?',
                'user_id': 'performance_test'
            },
            timeout=10
        )
        
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            if response_time < 2.0:
                print(f"✅ Fast response time: {response_time:.2f}s")
            elif response_time < 5.0:
                print(f"⚠️  Acceptable response time: {response_time:.2f}s")
            else:
                print(f"❌ Slow response time: {response_time:.2f}s")
        else:
            print(f"❌ Performance test failed: {response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Performance test error: {e}")

def main():
    """Run all tests"""
    print("🤖 Kopico AI System Test Suite")
    print("=" * 40)
    
    # Test frontend files first
    if not test_frontend_files():
        print("\n❌ Frontend files missing. Please ensure all files are in place.")
        return
    
    # Test backend
    print("\n🔌 Testing Backend Connection...")
    if not test_backend_health():
        print("\n❌ Backend not running. Please start the backend first:")
        print("   python kopico_bot.py")
        print("   or")
        print("   python start_kopico.py")
        return
    
    # Run all tests
    test_chat_endpoint()
    test_recommendations_endpoint()
    test_ai_intelligence()
    run_performance_test()
    
    print("\n🎉 Test Suite Complete!")
    print("💡 Tips:")
    print("   - Open index.html in your browser to test the full interface")
    print("   - Try chatting with Kopico using the chat icon")
    print("   - Test the shopping cart and analytics features")
    print("   - Check browser console for any JavaScript errors")

if __name__ == "__main__":
    main()