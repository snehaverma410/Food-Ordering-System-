// Global variables
let currentUser = null;
let cartItems = [];

// API Base URL
const API_BASE = '/api';

// DOM Elements
const cartBadge = document.getElementById('cartBadge');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupMobileMenu();
    checkAuthStatus();
    updateCartBadge();
    loadRestaurants();
});

// Initialize the application
function initializeApp() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartBadge();
    }
}

// Setup mobile menu toggle
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                updateAuthUI();
            } else {
                // Token is invalid, remove it
                localStorage.removeItem('token');
                currentUser = null;
                updateAuthUI();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            currentUser = null;
            updateAuthUI();
        }
    } else {
        updateAuthUI();
    }
}

// Update auth UI based on user status
function updateAuthUI() {
    const authMenu = document.querySelectorAll('.auth-menu');
    const userMenu = document.querySelectorAll('.user-menu');
    const adminMenu = document.querySelectorAll('.admin-menu');
    const authLink = document.getElementById('authLink');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (currentUser) {
        // User is logged in
        authMenu.forEach(menu => menu.style.display = 'none');
        userMenu.forEach(menu => menu.style.display = 'block');
        
        if (currentUser.role === 'admin') {
            adminMenu.forEach(menu => menu.style.display = 'block');
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    } else {
        // User is not logged in
        authMenu.forEach(menu => menu.style.display = 'block');
        userMenu.forEach(menu => menu.style.display = 'none');
        adminMenu.forEach(menu => menu.style.display = 'none');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    cartItems = [];
    localStorage.removeItem('cart');
    updateAuthUI();
    updateCartBadge();
    showAlert('Logged out successfully', 'success');
    
    // Redirect to home if on protected pages
    const protectedPages = ['/orders', '/admin'];
    if (protectedPages.some(page => window.location.pathname === page)) {
        window.location.href = '/';
    }
}

// Load restaurants for home page
async function loadRestaurants() {
    const restaurantsGrid = document.getElementById('restaurantsGrid');
    if (!restaurantsGrid) return;
    
    try {
        restaurantsGrid.innerHTML = '<div class="loading">Loading restaurants...</div>';
        
        const response = await fetch(`${API_BASE}/food/restaurants`);
        const restaurants = await response.json();
        
        if (restaurants.length === 0) {
            restaurantsGrid.innerHTML = '<p class="text-center">No restaurants available at the moment.</p>';
            return;
        }
        
        restaurantsGrid.innerHTML = restaurants.map(restaurant => `
            <div class="restaurant-card" onclick="goToMenu('${restaurant.id}')">
                <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
                <div class="restaurant-info">
                    <h3>${restaurant.name}</h3>
                    <div class="restaurant-meta">
                        <span class="restaurant-cuisine">${restaurant.cuisine}</span>
                        <span class="restaurant-rating">⭐ ${restaurant.rating}</span>
                    </div>
                    <p class="restaurant-delivery">🚚 ${restaurant.deliveryTime}</p>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading restaurants:', error);
        restaurantsGrid.innerHTML = '<p class="text-center">Error loading restaurants. Please try again.</p>';
    }
}

// Navigate to menu with optional restaurant filter
function goToMenu(restaurantId = null) {
    if (restaurantId) {
        window.location.href = `/menu?restaurant=${restaurantId}`;
    } else {
        window.location.href = '/menu';
    }
}

// Cart functions
function addToCart(foodItem) {
    const existingItem = cartItems.find(item => item.id === foodItem.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...foodItem,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartBadge();
    showAlert(`${foodItem.name} added to cart!`, 'success');
}

function removeFromCart(foodItemId) {
    const itemIndex = cartItems.findIndex(item => item.id === foodItemId);
    if (itemIndex > -1) {
        const itemName = cartItems[itemIndex].name;
        cartItems.splice(itemIndex, 1);
        saveCart();
        updateCartBadge();
        showAlert(`${itemName} removed from cart!`, 'info');
        
        // Reload cart page if currently viewing
        if (window.location.pathname === '/cart') {
            window.location.reload();
        }
    }
}

function updateQuantity(foodItemId, newQuantity) {
    const item = cartItems.find(item => item.id === foodItemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(foodItemId);
        } else {
            item.quantity = newQuantity;
            saveCart();
            updateCartBadge();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function updateCartBadge() {
    if (cartBadge) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

function getCartTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Alert system
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Insert at the top of the page content
    const main = document.querySelector('main') || document.body;
    main.insertBefore(alert, main.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// API helper function
async function apiRequest(url, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    
    return response.json();
}

// Export functions for use in other files
window.FoodieExpress = {
    addToCart,
    removeFromCart,
    updateQuantity,
    showAlert,
    formatPrice,
    formatDate,
    apiRequest,
    API_BASE,
    cartItems,
    currentUser,
    goToMenu
};