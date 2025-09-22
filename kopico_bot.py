#!/usr/bin/env python3
"""
Kopico - AI Coffee Assistant
A Python-based chatbot for coffee recommendations and brewing assistance
"""

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import random
import re
import json
from datetime import datetime
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

class KopicoAI:
    """
    Kopico AI Coffee Assistant - Advanced chatbot for coffee recommendations
    """
    
    def __init__(self):
        self.name = "Kopico"
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
        # Coffee database
        self.coffee_products = [
            {
                "name": "Ethiopian Yirgacheffe",
                "price": 28,
                "description": "Bright, floral notes with citrus undertones",
                "origin": "Ethiopia",
                "strength": 2,
                "acidity": 5,
                "flavor_profile": ["floral", "citrus", "bright", "tea-like"],
                "brewing_methods": ["pour-over", "aeropress", "chemex"]
            },
            {
                "name": "Colombian Supremo",
                "price": 25,
                "description": "Rich, full-bodied with chocolate notes",
                "origin": "Colombia",
                "strength": 4,
                "acidity": 3,
                "flavor_profile": ["chocolate", "nuts", "caramel", "balanced"],
                "brewing_methods": ["drip", "french-press", "espresso"]
            },
            {
                "name": "Brazilian Santos",
                "price": 22,
                "description": "Smooth, nutty flavor with low acidity",
                "origin": "Brazil",
                "strength": 3,
                "acidity": 2,
                "flavor_profile": ["nutty", "smooth", "mild", "chocolate"],
                "brewing_methods": ["french-press", "cold-brew", "drip"]
            },
            {
                "name": "Guatemalan Antigua",
                "price": 30,
                "description": "Complex, smoky with spice undertones",
                "origin": "Guatemala",
                "strength": 4,
                "acidity": 4,
                "flavor_profile": ["smoky", "spicy", "complex", "wine-like"],
                "brewing_methods": ["espresso", "pour-over", "french-press"]
            },
            {
                "name": "Italian Espresso Blend",
                "price": 26,
                "description": "Bold, intense flavor perfect for espresso",
                "origin": "Italy",
                "strength": 5,
                "acidity": 2,
                "flavor_profile": ["bold", "intense", "dark", "roasted"],
                "brewing_methods": ["espresso", "moka-pot", "drip"]
            },
            {
                "name": "House Special Blend",
                "price": 24,
                "description": "Balanced blend of our finest beans",
                "origin": "House Blend",
                "strength": 3,
                "acidity": 3,
                "flavor_profile": ["balanced", "smooth", "versatile", "classic"],
                "brewing_methods": ["drip", "french-press", "pour-over"]
            }
        ]
        
        # Brewing methods database
        self.brewing_methods = {
            "espresso": {
                "grind": "fine",
                "ratio": "1:2",
                "time": "25-30 seconds",
                "temperature": "90-96°C",
                "tips": "Use 18-20g coffee, extract 30-40ml espresso. Tamp evenly."
            },
            "pour-over": {
                "grind": "medium",
                "ratio": "1:15",
                "time": "3-4 minutes",
                "temperature": "90-95°C",
                "tips": "Pour in circles, bloom for 30 seconds, multiple pours."
            },
            "french-press": {
                "grind": "coarse",
                "ratio": "1:12",
                "time": "4 minutes",
                "temperature": "95°C",
                "tips": "Steep for 4 minutes, press slowly, serve immediately."
            },
            "aeropress": {
                "grind": "medium-fine",
                "ratio": "1:14",
                "time": "2 minutes",
                "temperature": "85-90°C",
                "tips": "Stir for 10 seconds, press gently for 30 seconds."
            },
            "cold-brew": {
                "grind": "coarse",
                "ratio": "1:8",
                "time": "12-24 hours",
                "temperature": "room temperature",
                "tips": "Steep at room temp, strain through fine filter."
            }
        }
        
        # Intent patterns
        self.intent_patterns = {
            "greeting": ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "what's up"],
            "recommend": ["recommend", "suggest", "best coffee", "what coffee", "help me choose", "perfect coffee", "good for"],
            "brewing": ["brew", "brewing", "how to make", "preparation", "temperature", "grind", "ratio", "method"],
            "product": ["price", "cost", "buy", "purchase", "tell me about", "what is", "describe"],
            "order": ["order", "cart", "checkout", "shipping", "delivery", "buy now"],
            "goodbye": ["bye", "goodbye", "see you", "thanks", "thank you"]
        }
        
        # Response templates
        self.responses = {
            "greeting": [
                f"Hello! I'm {self.name}, your AI coffee assistant! ☕ How can I help you discover amazing coffee today?",
                f"Hi there! {self.name} here, ready to help you with all things coffee! What can I do for you?",
                f"Welcome! I'm {self.name}, and I'm excited to help you find the perfect coffee experience! 🌟"
            ],
            "goodbye": [
                "Thanks for chatting with me! Enjoy your coffee journey! ☕✨",
                "Goodbye! Feel free to come back anytime for more coffee wisdom! 👋",
                "Have a great day and enjoy your perfect cup of coffee! 🌟"
            ],
            "default": [
                "I'm here to help with coffee recommendations, brewing tips, and product information! What would you like to know?",
                "I can assist you with finding the perfect coffee, brewing methods, or answering questions about our products. How can I help?",
                "Let me help you discover amazing coffee! Ask me about recommendations, brewing techniques, or our products."
            ]
        }
        
        # Initialize TF-IDF vectorizer for similarity matching
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
        self._prepare_coffee_corpus()
    
    def _prepare_coffee_corpus(self):
        """Prepare coffee product corpus for similarity matching"""
        corpus = []
        for coffee in self.coffee_products:
            text = f"{coffee['name']} {coffee['description']} {coffee['origin']} {' '.join(coffee['flavor_profile'])}"
            corpus.append(text.lower())
        
        self.coffee_vectors = self.vectorizer.fit_transform(corpus)
    
    def preprocess_text(self, text):
        """Preprocess text for better understanding"""
        # Convert to lowercase
        text = text.lower()
        
        # Tokenize
        tokens = word_tokenize(text)
        
        # Remove stopwords and stem
        tokens = [self.stemmer.stem(token) for token in tokens if token not in self.stop_words and token.isalpha()]
        
        return tokens
    
    def detect_intent(self, message):
        """Detect user intent from message"""
        message_lower = message.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if pattern in message_lower:
                    return intent
        
        # Check for product names
        for coffee in self.coffee_products:
            if coffee['name'].lower() in message_lower or coffee['origin'].lower() in message_lower:
                return "product"
        
        # Check for brewing methods
        for method in self.brewing_methods.keys():
            if method.replace('-', ' ') in message_lower or method.replace('-', '') in message_lower:
                return "brewing"
        
        return "default"
    
    def find_similar_coffee(self, query):
        """Find coffee similar to user query using TF-IDF"""
        query_vector = self.vectorizer.transform([query.lower()])
        similarities = cosine_similarity(query_vector, self.coffee_vectors)[0]
        
        # Get top 3 most similar coffees
        top_indices = np.argsort(similarities)[-3:][::-1]
        
        recommendations = []
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Threshold for relevance
                recommendations.append(self.coffee_products[idx])
        
        return recommendations
    
    def recommend_coffee(self, message):
        """Provide coffee recommendations based on user preferences"""
        message_lower = message.lower()
        
        # Strength preferences
        if any(word in message_lower for word in ["strong", "bold", "intense", "dark"]):
            recommendations = [coffee for coffee in self.coffee_products if coffee['strength'] >= 4]
            response = "For strong coffee lovers, I recommend:\n\n"
        elif any(word in message_lower for word in ["mild", "light", "smooth", "gentle"]):
            recommendations = [coffee for coffee in self.coffee_products if coffee['strength'] <= 3]
            response = "For those who prefer milder coffees:\n\n"
        elif any(word in message_lower for word in ["fruity", "floral", "bright", "citrus"]):
            recommendations = [coffee for coffee in self.coffee_products if 
                             any(flavor in coffee['flavor_profile'] for flavor in ["floral", "citrus", "bright"])]
            response = "For fruity and floral coffee enthusiasts:\n\n"
        elif any(word in message_lower for word in ["chocolate", "nutty", "caramel", "sweet"]):
            recommendations = [coffee for coffee in self.coffee_products if 
                             any(flavor in coffee['flavor_profile'] for flavor in ["chocolate", "nuts", "caramel"])]
            response = "For chocolate and nutty flavor lovers:\n\n"
        else:
            # Use similarity matching
            recommendations = self.find_similar_coffee(message)
            if not recommendations:
                recommendations = random.sample(self.coffee_products, 2)
            response = "Based on your preferences, I recommend:\n\n"
        
        # Format recommendations
        for i, coffee in enumerate(recommendations[:2], 1):
            response += f"{i}. **{coffee['name']}** (${coffee['price']})\n"
            response += f"   {coffee['description']}\n"
            response += f"   Origin: {coffee['origin']}\n"
            response += f"   Best for: {', '.join(coffee['brewing_methods'][:2])}\n\n"
        
        response += "Would you like to know more about any of these coffees or need brewing tips? ☕"
        
        return response
    
    def provide_brewing_tips(self, message):
        """Provide brewing tips based on method"""
        message_lower = message.lower()
        
        # Find brewing method in message
        method = None
        for brewing_method in self.brewing_methods.keys():
            if brewing_method.replace('-', ' ') in message_lower or brewing_method.replace('-', '') in message_lower:
                method = brewing_method
                break
        
        if method:
            info = self.brewing_methods[method]
            response = f"**{method.replace('-', ' ').title()} Brewing Guide:**\n\n"
            response += f"☕ **Grind Size:** {info['grind']}\n"
            response += f"⚖️ **Ratio:** {info['ratio']} (coffee:water)\n"
            response += f"⏱️ **Brew Time:** {info['time']}\n"
            response += f"🌡️ **Temperature:** {info['temperature']}\n"
            response += f"💡 **Pro Tips:** {info['tips']}\n\n"
            
            # Recommend suitable coffees
            suitable_coffees = [coffee for coffee in self.coffee_products if method in coffee['brewing_methods']]
            if suitable_coffees:
                response += f"**Perfect coffees for {method.replace('-', ' ')}:**\n"
                for coffee in suitable_coffees[:2]:
                    response += f"• {coffee['name']} - {coffee['description']}\n"
        else:
            response = "I can help with brewing methods like:\n"
            response += "☕ Espresso • 🌊 Pour-over • 🫖 French Press\n"
            response += "💨 AeroPress • 🧊 Cold Brew\n\n"
            response += "Which brewing method interests you?"
        
        return response
    
    def get_product_info(self, message):
        """Get specific product information"""
        message_lower = message.lower()
        
        # Find mentioned coffee
        for coffee in self.coffee_products:
            if coffee['name'].lower() in message_lower or coffee['origin'].lower() in message_lower:
                response = f"**{coffee['name']}** 🌟\n\n"
                response += f"💰 **Price:** ${coffee['price']}\n"
                response += f"🌍 **Origin:** {coffee['origin']}\n"
                response += f"📝 **Description:** {coffee['description']}\n"
                response += f"💪 **Strength:** {coffee['strength']}/5\n"
                response += f"🍋 **Acidity:** {coffee['acidity']}/5\n"
                response += f"🎯 **Flavor Profile:** {', '.join(coffee['flavor_profile'])}\n"
                response += f"☕ **Best Brewing Methods:** {', '.join(coffee['brewing_methods'])}\n\n"
                response += "Would you like to add this to your cart or learn about brewing tips?"
                
                return response
        
        return "I'd be happy to tell you about our coffee products! We have Ethiopian Yirgacheffe, Colombian Supremo, Brazilian Santos, Guatemalan Antigua, Italian Espresso Blend, and House Special Blend. Which one interests you?"
    
    def process_message(self, message, user_id=None):
        """Main message processing function"""
        intent = self.detect_intent(message)
        
        if intent == "greeting":
            return random.choice(self.responses["greeting"])
        elif intent == "goodbye":
            return random.choice(self.responses["goodbye"])
        elif intent == "recommend":
            return self.recommend_coffee(message)
        elif intent == "brewing":
            return self.provide_brewing_tips(message)
        elif intent == "product":
            return self.get_product_info(message)
        elif intent == "order":
            return "I can help guide you through our products! Check out our coffee selection and use the 'Add to Cart' buttons on the website. Need help choosing the right coffee for you? 🛒"
        else:
            return random.choice(self.responses["default"])

# Initialize Kopico AI
kopico = KopicoAI()

@app.route('/')
def index():
    return "Kopico AI Coffee Assistant API is running! 🤖☕"

@app.route('/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        user_id = data.get('user_id', 'anonymous')
        
        if not message:
            return jsonify({
                'error': 'No message provided'
            }), 400
        
        # Process message with Kopico AI
        response = kopico.process_message(message, user_id)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat(),
            'bot_name': 'Kopico'
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Error processing message: {str(e)}'
        }), 500

@app.route('/coffee-recommendations', methods=['POST'])
def get_recommendations():
    """Get personalized coffee recommendations"""
    try:
        data = request.get_json()
        preferences = data.get('preferences', {})
        
        # Simple recommendation based on preferences
        strength = preferences.get('strength', 3)
        acidity = preferences.get('acidity', 3)
        
        recommendations = []
        for coffee in kopico.coffee_products:
            score = 0
            if abs(coffee['strength'] - strength) <= 1:
                score += 2
            if abs(coffee['acidity'] - acidity) <= 1:
                score += 2
            
            recommendations.append({
                'coffee': coffee,
                'score': score
            })
        
        # Sort by score and return top 3
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        top_recommendations = [rec['coffee'] for rec in recommendations[:3]]
        
        return jsonify({
            'recommendations': top_recommendations,
            'message': 'Here are my personalized recommendations for you!'
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Error getting recommendations: {str(e)}'
        }), 500

@app.route('/brewing-guide/<method>', methods=['GET'])
def get_brewing_guide(method):
    """Get brewing guide for specific method"""
    try:
        method = method.lower().replace(' ', '-')
        
        if method in kopico.brewing_methods:
            guide = kopico.brewing_methods[method]
            return jsonify({
                'method': method,
                'guide': guide,
                'suitable_coffees': [
                    coffee for coffee in kopico.coffee_products 
                    if method in coffee['brewing_methods']
                ]
            })
        else:
            return jsonify({
                'error': 'Brewing method not found',
                'available_methods': list(kopico.brewing_methods.keys())
            }), 404
    
    except Exception as e:
        return jsonify({
            'error': f'Error getting brewing guide: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'bot_name': 'Kopico',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🤖 Starting Kopico AI Coffee Assistant...")
    print("📡 API will be available at http://localhost:5000")
    print("☕ Ready to help with coffee recommendations and brewing tips!")
    
    app.run(debug=True, host='0.0.0.0', port=5000)