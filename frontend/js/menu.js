// Menu Page JavaScript

let allFoodItems = [];
let restaurants = [];

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/menu') {
        initializeMenuPage();
    }
});

async function initializeMenuPage() {
    await loadRestaurants();
    await loadFoodItems();
    setupFilters();
    
    // Check for restaurant filter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant');
    if (restaurantId) {
        const restaurantFilter = document.getElementById('restaurantFilter');
        if (restaurantFilter) {
            restaurantFilter.value = restaurantId;
            filterFoodItems();
        }
    }
}

async function loadRestaurants() {
    try {
        const response = await fetch(`${FoodieExpress.API_BASE}/food/restaurants`);
        restaurants = await response.json();
        
        // Populate restaurant filter dropdown
        const restaurantFilter = document.getElementById('restaurantFilter');
        if (restaurantFilter) {
            restaurants.forEach(restaurant => {
                const option = document.createElement('option');
                option.value = restaurant.id;
                option.textContent = restaurant.name;
                restaurantFilter.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

async function loadFoodItems() {
    const foodGrid = document.getElementById('foodGrid');
    
    try {
        const response = await fetch(`${FoodieExpress.API_BASE}/food/items`);
        allFoodItems = await response.json();
        
        displayFoodItems(allFoodItems);
    } catch (error) {
        console.error('Error loading food items:', error);
        foodGrid.innerHTML = '<p class="text-center">Error loading menu items. Please try again.</p>';
    }
}

function displayFoodItems(items) {
    const foodGrid = document.getElementById('foodGrid');
    
    if (items.length === 0) {
        foodGrid.innerHTML = '<p class="text-center">No menu items found.</p>';
        return;
    }
    
    foodGrid.innerHTML = items.map(item => {
        const restaurant = restaurants.find(r => r.id === item.restaurantId);
        const restaurantName = restaurant ? restaurant.name : 'Unknown Restaurant';
        
        return `
            <div class="food-card fade-in">
                <img src="${item.image}" alt="${item.name}" class="food-image">
                <div class="food-info">
                    <h3>${item.name}</h3>
                    <p class="food-description">${item.description}</p>
                    <div style="margin-bottom: 1rem;">
                        <span style="font-size: 0.9rem; color: #666;">From ${restaurantName}</span>
                        <br>
                        <span style="font-size: 0.8rem; color: #999;">${item.category}</span>
                    </div>
                    <div class="food-footer">
                        <span class="food-price">${FoodieExpress.formatPrice(item.price)}</span>
                        <button class="btn btn-primary btn-small" onclick="addToCartFromMenu('${item.id}')" 
                                ${!item.available ? 'disabled' : ''}>
                            ${item.available ? 'Add to Cart' : 'Unavailable'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilters() {
    const restaurantFilter = document.getElementById('restaurantFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    if (restaurantFilter) {
        restaurantFilter.addEventListener('change', filterFoodItems);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterFoodItems);
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            restaurantFilter.value = '';
            categoryFilter.value = '';
            displayFoodItems(allFoodItems);
            
            // Update URL to remove restaurant parameter
            const url = new URL(window.location);
            url.searchParams.delete('restaurant');
            window.history.replaceState(null, '', url);
        });
    }
}

function filterFoodItems() {
    const restaurantFilter = document.getElementById('restaurantFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    const selectedRestaurant = restaurantFilter?.value || '';
    const selectedCategory = categoryFilter?.value || '';
    
    let filteredItems = [...allFoodItems];
    
    if (selectedRestaurant) {
        filteredItems = filteredItems.filter(item => item.restaurantId === selectedRestaurant);
    }
    
    if (selectedCategory) {
        filteredItems = filteredItems.filter(item => item.category === selectedCategory);
    }
    
    displayFoodItems(filteredItems);
}

function addToCartFromMenu(foodItemId) {
    const foodItem = allFoodItems.find(item => item.id === foodItemId);
    if (foodItem) {
        FoodieExpress.addToCart(foodItem);
    }
}