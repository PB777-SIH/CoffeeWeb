// Search and Menu functionality
let search = document.querySelector('.search-box');
let navbar = document.querySelector('.navbar');

document.querySelector('#search-icon').onclick = () => {
    search.classList.toggle('active');
    navbar.classList.remove('active');
}

document.querySelector('#menu-icon').onclick = () => {
    navbar.classList.toggle('active');
    search.classList.remove('active');
}

window.onscroll = () => {
    navbar.classList.remove('active');
    search.classList.remove('active');
}

// Header shadow effect
let header = document.querySelector('header');

window.addEventListener('scroll' , () =>{
    header.classList.toggle('shadow',window.scrollY > 0);
});

// Shopping Cart functionality
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// Coffee products data for search functionality
const coffeeProducts = [
    { name: 'Ethiopian Yirgacheffe', price: 28, description: 'Bright, floral notes with citrus undertones', origin: 'Ethiopia' },
    { name: 'Colombian Supremo', price: 25, description: 'Rich, full-bodied with chocolate notes', origin: 'Colombia' },
    { name: 'Brazilian Santos', price: 22, description: 'Smooth, nutty flavor with low acidity', origin: 'Brazil' },
    { name: 'Guatemalan Antigua', price: 30, description: 'Complex, smoky with spice undertones', origin: 'Guatemala' },
    { name: 'Italian Espresso Blend', price: 26, description: 'Bold, intense flavor perfect for espresso', origin: 'Italy' },
    { name: 'House Special Blend', price: 24, description: 'Balanced blend of our finest beans', origin: 'House Blend' }
];

// Update cart count and display
function updateCartDisplay() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// Add to cart function
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: parseFloat(price.replace('$', '')),
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification(`${name} added to cart!`);
}

// Remove from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    updateCartDisplay();
    renderCartItems();
}

// Update quantity
function updateQuantity(name, newQuantity) {
    const item = cart.find(item => item.name === name);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(name);
        } else {
            item.quantity = newQuantity;
            localStorage.setItem('coffeeCart', JSON.stringify(cart));
            updateCartDisplay();
            renderCartItems();
        }
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--main-color);
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Render cart items in modal
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-quantity">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                        <button class="quantity-btn" onclick="removeFromCart('${item.name}')" style="background: #e74c3c; margin-left: 10px;">×</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        if (query.length === 0) {
            searchResults.innerHTML = '';
            return;
        }
        
        const filteredProducts = coffeeProducts.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.origin.toLowerCase().includes(query)
        );
        
        searchResults.innerHTML = filteredProducts.map(product => `
            <div class="search-result-item" onclick="scrollToProduct('${product.name}')">
                <strong>${product.name}</strong> - $${product.price}
                <br><small>${product.description}</small>
            </div>
        `).join('');
        
        if (filteredProducts.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No products found</div>';
        }
    });
}

// Scroll to product
function scrollToProduct(productName) {
    const products = document.querySelectorAll('.products-container .box h3');
    for (let product of products) {
        if (product.textContent === productName) {
            product.closest('.box').scrollIntoView({ behavior: 'smooth', block: 'center' });
            search.classList.remove('active');
            break;
        }
    }
}

// Coffee Preference Quiz (ML-inspired)
const coffeeQuiz = [
    {
        question: "What's your preferred coffee strength?",
        options: ["Mild", "Medium", "Strong", "Extra Strong"],
        weights: [1, 2, 3, 4]
    },
    {
        question: "Do you prefer acidic or smooth coffee?",
        options: ["Very acidic", "Slightly acidic", "Balanced", "Very smooth"],
        weights: [4, 3, 2, 1]
    },
    {
        question: "What flavor notes do you enjoy?",
        options: ["Fruity/Floral", "Nutty/Chocolate", "Spicy/Earthy", "Classic Coffee"],
        weights: [1, 2, 3, 4]
    },
    {
        question: "When do you usually drink coffee?",
        options: ["Morning only", "Morning & Afternoon", "Throughout the day", "Evening too"],
        weights: [2, 3, 4, 1]
    }
];

let quizAnswers = [];
let currentQuestionIndex = 0;

function startQuiz() {
    quizAnswers = [];
    currentQuestionIndex = 0;
    document.getElementById('quizModal').style.display = 'block';
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const quizBody = document.getElementById('quizBody');
    const question = coffeeQuiz[currentQuestionIndex];
    
    quizBody.innerHTML = `
        <div style="padding: 20px;">
            <h3>Question ${currentQuestionIndex + 1} of ${coffeeQuiz.length}</h3>
            <p style="font-size: 1.1em; margin: 20px 0;">${question.question}</p>
            <div class="quiz-options">
                ${question.options.map((option, index) => `
                    <button class="quiz-option btn" onclick="selectAnswer(${index})" style="margin: 5px; width: 100%;">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function selectAnswer(answerIndex) {
    quizAnswers.push({
        questionIndex: currentQuestionIndex,
        answerIndex: answerIndex,
        weight: coffeeQuiz[currentQuestionIndex].weights[answerIndex]
    });
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < coffeeQuiz.length) {
        renderQuizQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const totalScore = quizAnswers.reduce((sum, answer) => sum + answer.weight, 0);
    const avgScore = totalScore / quizAnswers.length;
    
    let recommendation;
    if (avgScore <= 1.5) {
        recommendation = "Ethiopian Yirgacheffe";
    } else if (avgScore <= 2.5) {
        recommendation = "Brazilian Santos";
    } else if (avgScore <= 3.5) {
        recommendation = "Colombian Supremo";
    } else {
        recommendation = "Italian Espresso Blend";
    }
    
    const quizBody = document.getElementById('quizBody');
    quizBody.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h3>Your Perfect Coffee Match!</h3>
            <div style="background: var(--second-color); padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: var(--main-color);">${recommendation}</h2>
                <p>Based on your preferences, this coffee is perfect for you!</p>
            </div>
            <button class="btn" onclick="scrollToProduct('${recommendation}'); closeQuiz();">
                View This Coffee
            </button>
            <button class="btn btn-outline" onclick="closeQuiz()" style="margin-left: 10px;">
                Close
            </button>
        </div>
    `;
}

function closeQuiz() {
    document.getElementById('quizModal').style.display = 'none';
}

// Smooth scrolling for navigation links
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                }, function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.products-container .box .content a');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productBox = this.closest('.box');
            const productName = productBox.querySelector('h3').textContent;
            const productPrice = productBox.querySelector('span').textContent;
            const productImage = productBox.querySelector('img').src;
            addToCart(productName, productPrice, productImage);
        });
    });
    
    // Cart modal functionality
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartModal.style.display = 'block';
            renderCartItems();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    // Clear cart functionality
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            cart = [];
            localStorage.removeItem('coffeeCart');
            updateCartDisplay();
            renderCartItems();
            showNotification('Cart cleared!');
        });
    }
    
    // Checkout functionality (placeholder)
    const checkoutBtn = document.getElementById('checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            showNotification('Checkout functionality coming soon!');
        });
    }
    
    // Quiz functionality
    const startQuizBtn = document.getElementById('startQuiz');
    const closeQuizBtn = document.querySelector('.close-quiz');
    
    if (startQuizBtn) {
        startQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startQuiz();
        });
    }
    
    if (closeQuizBtn) {
        closeQuizBtn.addEventListener('click', closeQuiz);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target === document.getElementById('quizModal')) {
            closeQuiz();
        }
    });
    
    // Initialize search and cart display
    initializeSearch();
    updateCartDisplay();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Initialize analytics charts
    initializeCharts();
    
    // Start real-time stats animation
    animateRealTimeStats();
    
    // Add install prompt for PWA
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPromotion();
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);
            
            // Send analytics (in a real app, you'd send this to your analytics service)
            if (pageLoadTime > 3000) {
                console.warn('Page load time is slow, consider optimization');
            }
        });
    }
});

// PWA Install Promotion
function showInstallPromotion() {
    const installBanner = document.createElement('div');
    installBanner.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: var(--main-color);
            color: white;
            padding: 15px;
            border-radius: 10px;
            z-index: 10000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        ">
            <span>Install our app for a better experience!</span>
            <div>
                <button id="installBtn" style="
                    background: white;
                    color: var(--main-color);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    margin-right: 10px;
                    cursor: pointer;
                    font-weight: bold;
                ">Install</button>
                <button id="dismissBtn" style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Later</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(installBanner);
    
    document.getElementById('installBtn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
        }
        document.body.removeChild(installBanner);
    });
    
    document.getElementById('dismissBtn').addEventListener('click', () => {
        document.body.removeChild(installBanner);
    });
}

// Offline detection
window.addEventListener('online', () => {
    showNotification('Back online! 📶');
});

window.addEventListener('offline', () => {
    showNotification('You are offline. Some features may be limited. 📱');
});

// Analytics Charts
function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
                    borderColor: '#bc9667',
                    backgroundColor: 'rgba(188, 150, 103, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Popularity Chart
    const popularityCtx = document.getElementById('popularityChart');
    if (popularityCtx) {
        new Chart(popularityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Ethiopian Yirgacheffe', 'Colombian Supremo', 'Brazilian Santos', 'Italian Espresso', 'Others'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#bc9667',
                        '#8b4513',
                        '#d4b896',
                        '#a0522d',
                        '#deb887'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Animate real-time stats
function animateRealTimeStats() {
    const cupsServed = document.getElementById('cupsServed');
    const activeUsers = document.getElementById('activeUsers');
    const conversionRate = document.getElementById('conversionRate');
    
    // Simulate real-time updates
    setInterval(() => {
        if (cupsServed) {
            const currentCups = parseInt(cupsServed.textContent.replace(',', ''));
            cupsServed.textContent = (currentCups + Math.floor(Math.random() * 5) + 1).toLocaleString();
        }
        
        if (activeUsers) {
            const currentUsers = parseInt(activeUsers.textContent);
            const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
            const newUsers = Math.max(100, currentUsers + change);
            activeUsers.textContent = newUsers;
        }
        
        if (conversionRate) {
            const currentRate = parseFloat(conversionRate.textContent.replace('%', ''));
            const change = (Math.random() * 0.4) - 0.2; // -0.2 to +0.2
            const newRate = Math.max(1.0, Math.min(5.0, currentRate + change));
            conversionRate.textContent = newRate.toFixed(1) + '%';
        }
    }, 5000); // Update every 5 seconds
}

// Coffee recommendation ML algorithm (simplified)
function getPersonalizedRecommendations(userPreferences) {
    const preferences = userPreferences || {
        strength: 3,
        acidity: 2,
        flavor: 2,
        timing: 3
    };
    
    const coffeeScores = coffeeProducts.map(coffee => {
        let score = 0;
        
        // Simple scoring algorithm based on preferences
        switch(coffee.name) {
            case 'Ethiopian Yirgacheffe':
                score = (5 - preferences.strength) + preferences.acidity + (preferences.flavor === 1 ? 4 : 1);
                break;
            case 'Colombian Supremo':
                score = preferences.strength + (4 - preferences.acidity) + (preferences.flavor === 2 ? 4 : 2);
                break;
            case 'Brazilian Santos':
                score = (preferences.strength - 1) + (4 - preferences.acidity) + (preferences.flavor === 2 ? 3 : 1);
                break;
            case 'Guatemalan Antigua':
                score = preferences.strength + preferences.acidity + (preferences.flavor === 3 ? 4 : 2);
                break;
            case 'Italian Espresso Blend':
                score = preferences.strength + (3 - preferences.acidity) + preferences.timing;
                break;
            case 'House Special Blend':
                score = 3; // Baseline score for balanced blend
                break;
        }
        
        return {
            ...coffee,
            recommendationScore: score
        };
    });
    
    return coffeeScores.sort((a, b) => b.recommendationScore - a.recommendationScore);
}

// Advanced search with ML-like features
function intelligentSearch(query) {
    const searchTerms = query.toLowerCase().split(' ');
    const results = coffeeProducts.map(product => {
        let relevanceScore = 0;
        
        // Exact matches get highest score
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 10;
        }
        
        // Description matches
        if (product.description.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 5;
        }
        
        // Origin matches
        if (product.origin.toLowerCase().includes(query.toLowerCase())) {
            relevanceScore += 7;
        }
        
        // Individual term matches
        searchTerms.forEach(term => {
            if (product.name.toLowerCase().includes(term)) relevanceScore += 3;
            if (product.description.toLowerCase().includes(term)) relevanceScore += 2;
            if (product.origin.toLowerCase().includes(term)) relevanceScore += 2;
        });
        
        // Semantic similarity (simplified)
        const semanticTerms = {
            'strong': ['espresso', 'bold', 'intense'],
            'mild': ['smooth', 'light', 'gentle'],
            'sweet': ['chocolate', 'caramel', 'honey'],
            'fruity': ['floral', 'citrus', 'berry']
        };
        
        searchTerms.forEach(term => {
            Object.keys(semanticTerms).forEach(concept => {
                if (semanticTerms[concept].includes(term)) {
                    if (product.description.toLowerCase().includes(concept)) {
                        relevanceScore += 4;
                    }
                }
            });
        });
        
        return {
            ...product,
            relevanceScore
        };
    }).filter(product => product.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return results;
}

// Simple fallback responses when all else fails
function getSimpleFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "Hello! I'm Kopico, your coffee assistant! ☕ How can I help you today?";
    }
    
    // Coffee recommendation requests
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best coffee')) {
        return "I'd love to help you find the perfect coffee! 🌟\n\nHere are some great options:\n• **Ethiopian Yirgacheffe** - Bright, floral, citrusy ($28)\n• **Colombian Supremo** - Rich, chocolate notes ($25)\n• **Brazilian Santos** - Smooth, nutty, mild ($22)\n\nWhat flavor profile interests you most?";
    }
    
    // Brewing questions
    if (lowerMessage.includes('brew') || lowerMessage.includes('how to make') || lowerMessage.includes('preparation')) {
        return "Great brewing question! ☕ Here are some quick tips:\n\n**Pour Over**: 1:15 ratio, medium grind, 90-95°C water\n**French Press**: 1:12 ratio, coarse grind, 4-minute steep\n**Espresso**: Fine grind, 25-30 seconds extraction\n\nWhat brewing method are you using?";
    }
    
    // Product questions
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('buy')) {
        return "Our coffee prices range from $22-$30:\n• Brazilian Santos - $22\n• Colombian Supremo - $25\n• Italian Espresso Blend - $26\n• Ethiopian Yirgacheffe - $28\n• Guatemalan Antigua - $30\n• House Special Blend - $24\n\nYou can add any coffee to your cart using the 'Add to Cart' buttons!";
    }
    
    // Taste/flavor questions
    if (lowerMessage.includes('strong') || lowerMessage.includes('bold')) {
        return "For strong coffee lovers! 💪\n\nTry these bold options:\n• **Italian Espresso Blend** - Intense and bold ($26)\n• **Guatemalan Antigua** - Complex, smoky flavors ($30)\n\nBoth are perfect for those who want powerful coffee experiences!";
    }
    
    if (lowerMessage.includes('mild') || lowerMessage.includes('smooth')) {
        return "For a smooth coffee experience! 😌\n\n• **Brazilian Santos** - Nutty, low acidity ($22)\n• **Colombian Supremo** - Rich but gentle ($25)\n\nBoth are perfect for a mellow coffee moment!";
    }
    
    // Default response with helpful suggestions
    return "I'm Kopico, your AI coffee assistant! ☕ I can help you with:\n\n🌟 **Coffee Recommendations** - Find your perfect coffee\n☕ **Brewing Tips** - Learn the best techniques\n🛒 **Product Info** - Details about our coffees\n📞 **Order Help** - Shopping cart assistance\n\nWhat would you like to know about coffee today?";
}

// Kopico AI System - Python Backend Integration
class KopicoAssistant {
    constructor() {
        this.apiUrl = 'http://localhost:5000';
        this.isOnline = false;
        this.fallbackMode = true;
        
        // Fallback responses when Python backend is not available
        this.fallbackResponses = {
            greeting: [
                "Hello! I'm Kopico, your AI coffee assistant! ☕ (Running in offline mode)",
                "Hi there! Kopico here, ready to help with coffee! 🤖",
                "Welcome! I'm here to help you discover amazing coffee! 🌟"
            ],
            recommend: [
                "I'd love to help you find the perfect coffee! Try our Ethiopian Yirgacheffe for floral notes, or Colombian Supremo for rich chocolate flavors. What taste profile interests you?",
                "For coffee recommendations, I suggest checking out our products section! Each coffee has unique characteristics - would you like something strong or mild?",
                "Our Brazilian Santos is perfect for smooth, nutty flavors, while our Italian Espresso Blend offers bold intensity. What's your preference?"
            ],
            brewing: [
                "For brewing tips: Pour-over works great with medium grind and 90-95°C water. French press needs coarse grind and 4-minute steep. What method are you using?",
                "Brewing perfect coffee depends on your method! Espresso needs fine grind and 25-30 seconds extraction. What brewing equipment do you have?",
                "Great brewing starts with fresh beans and proper ratios. Generally use 1:15 ratio for pour-over, 1:12 for French press. Need specific method tips?"
            ],
            orders: [
                "I can help guide you through our products! Check out our coffee selection and use the 'Add to Cart' buttons. Need help choosing the right coffee?",
                "For orders, browse our products section and add items to your cart. I'm here to help you choose the perfect coffee for your taste!",
                "Our ordering system is integrated with the website. Add coffees to your cart and proceed to checkout. Want recommendations first?"
            ]
        };
        
        this.checkBackendStatus();
    }
    
    async checkBackendStatus() {
        try {
            const response = await fetch(`${this.apiUrl}/health`, {
                method: 'GET',
                timeout: 3000
            });
            
            if (response.ok) {
                this.isOnline = true;
                this.fallbackMode = false;
                console.log("🤖 Kopico AI backend is online!");
            }
        } catch (error) {
            console.log("⚠️ Kopico AI backend not available, using fallback mode");
            this.isOnline = false;
            this.fallbackMode = true;
        }
    }
    
    async processMessage(message) {
        // Try Python backend first
        if (!this.fallbackMode) {
            try {
                const response = await fetch(`${this.apiUrl}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        user_id: 'web_user_' + Date.now()
                    }),
                    timeout: 10000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return data.response;
                } else {
                    throw new Error('Backend response error');
                }
            } catch (error) {
                console.log("🔄 Falling back to offline mode due to:", error.message);
                this.fallbackMode = true;
            }
        }
        
        // Fallback to local processing
        return this.processFallbackMessage(message);
    }
    
    processFallbackMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        // Simple intent recognition
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse('greeting');
        }
        
        if (this.isRecommendationRequest(lowerMessage)) {
            return this.handleFallbackRecommendation(lowerMessage);
        }
        
        if (this.isBrewingQuestion(lowerMessage)) {
            return this.getRandomResponse('brewing');
        }
        
        if (this.isOrderQuestion(lowerMessage)) {
            return this.getRandomResponse('orders');
        }
        
        if (this.isProductQuery(lowerMessage)) {
            return this.handleFallbackProductQuery(lowerMessage);
        }
        
        // Default response
        return "I'm Kopico, your AI coffee assistant! I can help with:\n• Coffee recommendations 🌟\n• Brewing tips ☕\n• Product information 📖\n• Order assistance 🛒\n\nWhat would you like to know? (Note: Advanced AI features require the Python backend)";
    }
    
    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    }
    
    isRecommendationRequest(message) {
        const keywords = ['recommend', 'suggest', 'best coffee', 'what coffee', 'help me choose', 'perfect coffee'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isBrewingQuestion(message) {
        const keywords = ['brew', 'brewing', 'how to make', 'preparation', 'temperature', 'grind', 'ratio'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isOrderQuestion(message) {
        const keywords = ['order', 'buy', 'purchase', 'cart', 'checkout', 'shipping', 'delivery'];
        return keywords.some(keyword => message.includes(keyword));
    }
    
    isProductQuery(message) {
        return coffeeProducts.some(product => 
            message.includes(product.name.toLowerCase()) || 
            message.includes(product.origin.toLowerCase())
        );
    }
    
    handleFallbackRecommendation(message) {
        if (message.includes('strong') || message.includes('bold')) {
            return "For strong coffee lovers, I recommend our Italian Espresso Blend ($26) - bold and intense! Also try Guatemalan Antigua ($30) for complex, smoky flavors. Perfect for those who want powerful coffee! ☕💪";
        }
        
        if (message.includes('mild') || message.includes('smooth')) {
            return "For smooth experiences, try Brazilian Santos ($22) - nutty and mild, or Colombian Supremo ($25) with rich chocolate notes. Both are perfect for a gentle coffee experience! 🌟";
        }
        
        if (message.includes('fruity') || message.includes('floral')) {
            return "Ethiopian Yirgacheffe ($28) is perfect for you! Bright, floral notes with citrus undertones - a delightful fruity experience! ✨🍊";
        }
        
        return this.getRandomResponse('recommend');
    }
    
    handleFallbackProductQuery(message) {
        const product = coffeeProducts.find(p => 
            message.includes(p.name.toLowerCase()) || 
            message.includes(p.origin.toLowerCase())
        );
        
        if (product) {
            return `**${product.name}** ($${product.price}) - ${product.description}. Origin: ${product.origin}. This coffee offers unique characteristics perfect for coffee enthusiasts! Would you like to add it to your cart? 🛒`;
        }
        
        return "I'd love to tell you about our amazing coffee selection! We have Ethiopian Yirgacheffe, Colombian Supremo, Brazilian Santos, Guatemalan Antigua, Italian Espresso Blend, and House Special Blend. Each has unique flavor profiles - which interests you? ☕";
    }
    
    getRandomResponse(type) {
        const responses = this.fallbackResponses[type];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    async getPersonalizedRecommendations(preferences) {
        if (!this.fallbackMode) {
            try {
                const response = await fetch(`${this.apiUrl}/coffee-recommendations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ preferences }),
                    timeout: 8000
                });
                
                if (response.ok) {
                    const data = await response.json();
                    return data.recommendations;
                }
            } catch (error) {
                console.log("Using fallback recommendations:", error.message);
            }
        }
        
        // Fallback recommendations
        return coffeeProducts.slice(0, 3);
    }
}

// Initialize Kopico with better error handling
let kopico;
try {
    kopico = new KopicoAssistant();
    console.log("✅ Kopico AI Assistant initialized");
} catch (error) {
    console.error("❌ Kopico initialization failed:", error);
    // Create a simple fallback object
    kopico = {
        processMessage: async function(message) {
            return getSimpleFallbackResponse(message);
        },
        isOnline: false,
        fallbackMode: true
    };
    console.log("⚠️ Using basic fallback chatbot");
}
let chatContainer, chatMessages, chatInput, sendButton, typingIndicator;

function initializeChatbot() {
    chatContainer = document.getElementById('chatbotContainer');
    chatMessages = document.getElementById('chatMessages');
    chatInput = document.getElementById('chatInput');
    sendButton = document.getElementById('sendMessage');
    typingIndicator = document.getElementById('typingIndicator');
    
    // Chat toggle functionality
    const chatToggle = document.getElementById('chatToggle');
    const chatIcon = document.getElementById('chat-icon');
    const closeChat = document.getElementById('closeChat');
    const minimizeChat = document.getElementById('minimizeChat');
    
    if (chatToggle) {
        chatToggle.addEventListener('click', openChat);
    }
    
    if (chatIcon) {
        chatIcon.addEventListener('click', openChat);
    }
    
    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatContainer.classList.remove('active');
            document.getElementById('chatNotification').style.display = 'flex';
        });
    }
    
    if (minimizeChat) {
        minimizeChat.addEventListener('click', () => {
            chatContainer.classList.toggle('minimized');
        });
    }
    
    // Send message functionality
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        chatInput.addEventListener('input', function() {
            if (sendButton) {
                sendButton.disabled = this.value.trim() === '';
            }
        });
    }
    
    // Quick action buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-btn')) {
            const action = e.target.getAttribute('data-action');
            handleQuickAction(action);
        }
    });
}

function openChat() {
    chatContainer.classList.add('active');
    chatContainer.classList.remove('minimized');
    document.getElementById('chatNotification').style.display = 'none';
    chatInput.focus();
    
    // Add welcome message if chat is empty
    if (chatMessages.children.length === 0) {
        addMessage("Hello! I'm Kopico, your AI coffee assistant! ☕ How can I help you today?", 'bot');
    }
}

function sendMessage() {
    const message = chatInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Always provide immediate fallback response if Kopico fails
    try {
        // Use Kopico AI system for response
        kopico.processMessage(message)
            .then(response => {
                hideTypingIndicator();
                addMessage(response, 'bot');
                sendButton.disabled = false;
            })
            .catch(error => {
                console.error('Kopico error:', error);
                hideTypingIndicator();
                // Use simple fallback response
                const fallbackResponse = getSimpleFallbackResponse(message);
                addMessage(fallbackResponse, 'bot');
                sendButton.disabled = false;
            });
    } catch (error) {
        console.error('Critical chatbot error:', error);
        hideTypingIndicator();
        const fallbackResponse = getSimpleFallbackResponse(message);
        addMessage(fallbackResponse, 'bot');
        sendButton.disabled = false;
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'bot' ? '<i class="bx bx-coffee-togo"></i>' : '<i class="bx bx-user"></i>';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    content.appendChild(paragraph);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    typingIndicator.classList.add('active');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    typingIndicator.classList.remove('active');
}

function handleQuickAction(action) {
    let message = '';
    switch(action) {
        case 'recommend':
            message = 'Can you recommend some coffee for me?';
            break;
        case 'brewing':
            message = 'I need help with brewing tips';
            break;
        case 'orders':
            message = 'I have questions about orders';
            break;
    }
    
    if (message) {
        addMessage(message, 'user');
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = getSimpleFallbackResponse(message);
            addMessage(response, 'bot');
        }, 1500);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .quiz-option {
        transition: all 0.3s ease;
    }
    
    .quiz-option:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);