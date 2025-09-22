# ☕ Premium Coffee Co - AI-Powered Coffee E-commerce Platform

A modern, responsive coffee e-commerce website featuring **Kopico**, an AI-powered chatbot assistant that provides personalized coffee recommendations, brewing tips, and customer support using machine learning and natural language processing.

## 🚀 Features

### 🌟 Core Features
- **Responsive Design**: Mobile-first, modern UI with smooth animations
- **Interactive Shopping Cart**: Add/remove products with local storage persistence
- **Coffee Analytics Dashboard**: Visual insights with Chart.js integration
- **Progressive Web App (PWA)**: Installable app with offline capabilities
- **Advanced Search**: Real-time product filtering and search functionality

### 🤖 AI-Powered Features
- **Kopico AI Assistant**: Intelligent chatbot powered by Python Flask backend
- **Machine Learning Recommendations**: Personalized coffee suggestions based on preferences
- **Natural Language Processing**: Understands customer queries and provides helpful responses
- **Sentiment Analysis**: Analyzes customer feedback for better service
- **Brewing Intelligence**: AI-driven brewing tips and coffee preparation guidance

### 💼 E-commerce Features
- **Product Catalog**: Premium coffee selection with detailed descriptions
- **Shopping Cart System**: Seamless add-to-cart functionality
- **Customer Reviews**: Social proof with customer testimonials
- **About Section**: Company story and values
- **Contact Information**: Easy ways to get in touch

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup with modern standards
- **CSS3**: Advanced styling with animations, gradients, and responsive design
- **JavaScript ES6+**: Modern JavaScript with async/await, classes, and modules
- **Chart.js**: Data visualization for analytics dashboard
- **PWA**: Service worker for offline functionality

### Backend (AI System)
- **Python 3.7+**: Core backend language
- **Flask**: Lightweight web framework for API
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **NLTK**: Natural Language Toolkit for text processing
- **scikit-learn**: Machine learning library for recommendations
- **NumPy**: Numerical computing for data processing

## 📦 Installation & Setup

### Quick Start (Recommended)
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd CoffeeWeb
   ```

2. **Run the AI launcher**:
   ```bash
   python start_kopico.py
   ```
   This automatically installs dependencies, sets up NLTK data, and starts the AI backend!

### Manual Setup

#### Frontend Only
Simply open `index.html` in your browser for basic functionality (without AI features).

#### Full Setup with AI Backend

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Download NLTK data**:
   ```python
   import nltk
   nltk.download('punkt')
   nltk.download('stopwords')
   nltk.download('wordnet')
   ```

3. **Start the AI backend**:
   ```bash
   python kopico_bot.py
   ```

4. **Open the website**:
   Open `index.html` in your browser or serve it through a local web server.

### Using Setup Scripts

#### Windows:
```cmd
setup_kopico.bat
```

#### Linux/macOS:
```bash
chmod +x setup_kopico.sh
./setup_kopico.sh
```

## 🤖 Kopico AI Assistant

Kopico is the intelligent heart of this coffee platform, providing:

### 🧠 AI Capabilities
- **Intent Recognition**: Understands customer questions about coffee, brewing, and orders
- **Recommendation Engine**: ML-powered suggestions based on taste preferences
- **Context Awareness**: Maintains conversation context for natural interactions
- **Sentiment Analysis**: Analyzes customer mood and adapts responses accordingly
- **Product Knowledge**: Deep understanding of coffee varieties, origins, and characteristics

### 💬 Chat Features
- **Natural Conversations**: Understands complex queries about coffee
- **Brewing Assistance**: Step-by-step brewing guides for different methods
- **Product Recommendations**: Personalized suggestions based on preferences
- **Order Support**: Helps with shopping cart and purchase decisions
- **Coffee Education**: Shares knowledge about coffee origins, flavors, and preparation

### 🔧 Technical Features
- **Fallback Mode**: Works offline with reduced functionality if backend is unavailable
- **API Integration**: RESTful API endpoints for seamless frontend-backend communication
- **Error Handling**: Graceful degradation when AI services are unavailable
- **Performance Optimization**: Efficient response times and resource usage

## 📡 API Endpoints

The Kopico AI backend provides these endpoints:

- `GET /health` - Health check for backend status
- `POST /chat` - Main chat endpoint for conversations
- `POST /coffee-recommendations` - Get personalized coffee recommendations
- `GET /analytics` - Coffee analytics and insights

## 🎨 UI/UX Features

### Design Elements
- **Modern Gradient Backgrounds**: Eye-catching color schemes
- **Smooth Animations**: CSS transitions and hover effects
- **Responsive Typography**: Optimized text for all screen sizes
- **Interactive Elements**: Engaging buttons and form controls
- **Loading States**: Visual feedback for user actions

### User Experience
- **Intuitive Navigation**: Clear menu structure and user flow
- **Fast Loading**: Optimized images and efficient code
- **Accessibility**: Semantic HTML and proper contrast ratios
- **Mobile-First**: Designed for mobile devices, enhanced for desktop

## 📊 Analytics Dashboard

The analytics section provides insights into:
- **Sales Trends**: Coffee sales performance over time
- **Popular Products**: Best-selling coffee varieties
- **Customer Satisfaction**: Review scores and feedback analysis
- **Geographic Data**: Sales distribution by region

## 🔄 PWA Features

Progressive Web App capabilities include:
- **Offline Functionality**: Basic features work without internet
- **Install Prompt**: Users can install the app to their device
- **Service Worker**: Caches resources for faster loading
- **App-like Experience**: Full-screen mode and app icons

## 🛒 Shopping Cart System

Advanced cart functionality:
- **Local Storage**: Persists cart items between sessions
- **Real-time Updates**: Instant cart total calculations
- **Product Management**: Add/remove items with quantity controls
- **Checkout Ready**: Prepared for payment integration

## 🧪 Testing the AI Features

### Basic Chat Testing
1. Open the website
2. Click the chat icon (🤖) in the bottom right
3. Try these sample queries:
   - "Hello" - Test greeting recognition
   - "Recommend a coffee for me" - Test recommendation engine
   - "How do I brew pour-over coffee?" - Test brewing assistance
   - "Tell me about Ethiopian coffee" - Test product knowledge

### Advanced AI Testing
1. Start the Python backend: `python kopico_bot.py`
2. Test with complex queries:
   - "I like strong, nutty flavors with low acidity"
   - "What's the best brewing method for Ethiopian Yirgacheffe?"
   - "I'm new to coffee, what should I try first?"

## 🚀 Deployment

### Local Development
- Frontend: Open `index.html` in browser or use live server
- Backend: Run `python kopico_bot.py` for AI features

### Production Deployment
1. **Frontend**: Deploy to any static hosting (Netlify, Vercel, GitHub Pages)
2. **Backend**: Deploy Flask app to cloud platforms (Heroku, AWS, DigitalOcean)
3. **Environment**: Update API URLs in `main.js` for production backend




## 🙏 Acknowledgments

- **Chart.js** for beautiful data visualizations
- **NLTK** for natural language processing capabilities
- **Flask** for the lightweight and powerful backend framework
- **scikit-learn** for machine learning algorithms
- **Coffee community** for inspiration and domain knowledge

---

**Built with ❤️ and lots of ☕ for coffee enthusiasts worldwide!**

*Experience the future of coffee e-commerce with AI-powered assistance.*
