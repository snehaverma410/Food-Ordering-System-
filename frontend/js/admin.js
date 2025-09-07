// Admin Page JavaScript

let allOrders = [];
let allFoodItems = [];
let allRestaurants = [];

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/admin') {
        initializeAdminPage();
    }
});

function initializeAdminPage() {
    // Check if user is logged in and is admin
    if (!FoodieExpress.currentUser || FoodieExpress.currentUser.role !== 'admin') {
        window.location.href = '/';
        return;
    }
    
    loadDashboardStats();
    loadOrders();
    loadFoodItems();
    loadRestaurants();
    setupForms();
}

async function loadDashboardStats() {
    const statsContainer = document.getElementById('dashboardStats');
    
    try {
        const stats = await FoodieExpress.apiRequest('/api/admin/stats');
        
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${stats.totalOrders}</div>
                <div class="stat-label">Total Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">$${stats.totalRevenue.toFixed(2)}</div>
                <div class="stat-label">Total Revenue</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalRestaurants}</div>
                <div class="stat-label">Restaurants</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalFoodItems}</div>
                <div class="stat-label">Food Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.totalUsers}</div>
                <div class="stat-label">Customers</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.pendingOrders}</div>
                <div class="stat-label">Pending Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.completedOrders}</div>
                <div class="stat-label">Completed Orders</div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        statsContainer.innerHTML = '<div class="text-center">Error loading dashboard stats</div>';
    }
}

async function loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    
    try {
        allOrders = await FoodieExpress.apiRequest('/api/admin/orders');
        displayOrders(allOrders);
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersTable.innerHTML = '<div class="text-center">Error loading orders</div>';
    }
}

function displayOrders(orders) {
    const ordersTable = document.getElementById('ordersTable');
    
    if (orders.length === 0) {
        ordersTable.innerHTML = '<div class="text-center">No orders found</div>';
        return;
    }
    
    ordersTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td>#${order.id.substring(0, 8)}</td>
                        <td>${order.deliveryAddress?.fullName || 'N/A'}</td>
                        <td>${order.items.length} items</td>
                        <td>${FoodieExpress.formatPrice(order.totalAmount)}</td>
                        <td>
                            <span class="order-status status-${order.status}">
                                ${capitalizeFirst(order.status)}
                            </span>
                        </td>
                        <td>${new Date(order.orderDate).toLocaleDateString()}</td>
                        <td>
                            <div class="action-buttons">
                                <select onchange="updateOrderStatus('${order.id}', this.value)" class="form-control form-select btn-small">
                                    <option value="">Update Status</option>
                                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                    <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                                <button class="btn btn-secondary btn-small" onclick="viewOrderDetails('${order.id}')">View</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function loadFoodItems() {
    const foodItemsTable = document.getElementById('foodItemsTable');
    
    try {
        allFoodItems = await FoodieExpress.apiRequest('/api/food/items');
        allRestaurants = await FoodieExpress.apiRequest('/api/food/restaurants');
        displayFoodItems(allFoodItems);
    } catch (error) {
        console.error('Error loading food items:', error);
        foodItemsTable.innerHTML = '<div class="text-center">Error loading food items</div>';
    }
}

function displayFoodItems(items) {
    const foodItemsTable = document.getElementById('foodItemsTable');
    
    if (items.length === 0) {
        foodItemsTable.innerHTML = '<div class="text-center">No food items found</div>';
        return;
    }
    
    foodItemsTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Restaurant</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${items.map(item => {
                    const restaurant = allRestaurants.find(r => r.id === item.restaurantId);
                    return `
                        <tr>
                            <td><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                            <td>${item.name}</td>
                            <td>${restaurant ? restaurant.name : 'Unknown'}</td>
                            <td>${item.category}</td>
                            <td>${FoodieExpress.formatPrice(item.price)}</td>
                            <td>
                                <span style="color: ${item.available ? 'green' : 'red'};">
                                    ${item.available ? '✓ Yes' : '✗ No'}
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn btn-secondary btn-small" onclick="editFoodItem('${item.id}')">Edit</button>
                                    <button class="btn btn-danger btn-small" onclick="deleteFoodItem('${item.id}')">Delete</button>
                                </div>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

async function loadRestaurants() {
    const restaurantsTable = document.getElementById('restaurantsTable');
    
    try {
        allRestaurants = await FoodieExpress.apiRequest('/api/food/restaurants');
        displayRestaurants(allRestaurants);
    } catch (error) {
        console.error('Error loading restaurants:', error);
        restaurantsTable.innerHTML = '<div class="text-center">Error loading restaurants</div>';
    }
}

function displayRestaurants(restaurants) {
    const restaurantsTable = document.getElementById('restaurantsTable');
    
    if (restaurants.length === 0) {
        restaurantsTable.innerHTML = '<div class="text-center">No restaurants found</div>';
        return;
    }
    
    restaurantsTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Cuisine</th>
                    <th>Rating</th>
                    <th>Delivery Time</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${restaurants.map(restaurant => `
                    <tr>
                        <td><img src="${restaurant.image}" alt="${restaurant.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                        <td>${restaurant.name}</td>
                        <td>${restaurant.cuisine}</td>
                        <td>⭐ ${restaurant.rating}</td>
                        <td>${restaurant.deliveryTime}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-secondary btn-small" onclick="editRestaurant('${restaurant.id}')">Edit</button>
                                <button class="btn btn-danger btn-small" onclick="deleteRestaurant('${restaurant.id}')">Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Order Management Functions
async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    
    try {
        await FoodieExpress.apiRequest(`/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        
        FoodieExpress.showAlert('Order status updated successfully!', 'success');
        loadOrders();
        loadDashboardStats();
    } catch (error) {
        console.error('Error updating order status:', error);
        FoodieExpress.showAlert(error.message, 'error');
    }
}

function filterOrders() {
    const filterValue = document.getElementById('orderStatusFilter').value;
    const filteredOrders = filterValue ? allOrders.filter(order => order.status === filterValue) : allOrders;
    displayOrders(filteredOrders);
}

function refreshOrders() {
    loadOrders();
    loadDashboardStats();
}

function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Order Details - #${order.id.substring(0, 8)}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div>
                <p><strong>Customer:</strong> ${order.deliveryAddress?.fullName || 'N/A'}</p>
                <p><strong>Phone:</strong> ${order.deliveryAddress?.phone || 'N/A'}</p>
                <p><strong>Address:</strong> ${order.deliveryAddress ? `${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}` : 'N/A'}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod.replace('_', ' ')}</p>
                <p><strong>Status:</strong> <span class="order-status status-${order.status}">${capitalizeFirst(order.status)}</span></p>
                <p><strong>Order Date:</strong> ${FoodieExpress.formatDate(order.orderDate)}</p>
                
                <h4>Items:</h4>
                <div style="margin-bottom: 1rem;">
                    ${order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${FoodieExpress.formatPrice(item.total)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="font-size: 1.2rem; font-weight: bold; text-align: right;">
                    Total: ${FoodieExpress.formatPrice(order.totalAmount)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Food Item Management Functions
function setupForms() {
    // Food Item Form
    const foodItemForm = document.getElementById('foodItemForm');
    if (foodItemForm) {
        foodItemForm.addEventListener('submit', handleFoodItemSubmit);
    }
    
    // Restaurant Form
    const restaurantForm = document.getElementById('restaurantForm');
    if (restaurantForm) {
        restaurantForm.addEventListener('submit', handleRestaurantSubmit);
    }
}

function showFoodItemModal(foodItem = null) {
    const modal = document.getElementById('foodItemModal');
    const title = document.getElementById('foodItemModalTitle');
    const form = document.getElementById('foodItemForm');
    const restaurantSelect = document.getElementById('foodItemRestaurant');
    
    // Populate restaurant dropdown
    restaurantSelect.innerHTML = '<option value="">Select Restaurant</option>' +
        allRestaurants.map(restaurant => 
            `<option value="${restaurant.id}">${restaurant.name}</option>`
        ).join('');
    
    if (foodItem) {
        title.textContent = 'Edit Food Item';
        document.getElementById('foodItemId').value = foodItem.id;
        document.getElementById('foodItemName').value = foodItem.name;
        document.getElementById('foodItemDescription').value = foodItem.description;
        document.getElementById('foodItemPrice').value = foodItem.price;
        document.getElementById('foodItemImage').value = foodItem.image;
        document.getElementById('foodItemRestaurant').value = foodItem.restaurantId;
        document.getElementById('foodItemCategory').value = foodItem.category;
        document.getElementById('foodItemAvailable').checked = foodItem.available;
    } else {
        title.textContent = 'Add Food Item';
        form.reset();
        document.getElementById('foodItemId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeFoodItemModal() {
    document.getElementById('foodItemModal').style.display = 'none';
}

async function handleFoodItemSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const foodItemData = {
        name: formData.get('foodItemName') || document.getElementById('foodItemName').value,
        description: formData.get('foodItemDescription') || document.getElementById('foodItemDescription').value,
        price: parseFloat(formData.get('foodItemPrice') || document.getElementById('foodItemPrice').value),
        image: formData.get('foodItemImage') || document.getElementById('foodItemImage').value,
        restaurantId: formData.get('foodItemRestaurant') || document.getElementById('foodItemRestaurant').value,
        category: formData.get('foodItemCategory') || document.getElementById('foodItemCategory').value,
        available: document.getElementById('foodItemAvailable').checked
    };
    
    const foodItemId = document.getElementById('foodItemId').value;
    
    try {
        if (foodItemId) {
            // Update existing food item
            await FoodieExpress.apiRequest(`/api/admin/food-items/${foodItemId}`, {
                method: 'PUT',
                body: JSON.stringify(foodItemData)
            });
            FoodieExpress.showAlert('Food item updated successfully!', 'success');
        } else {
            // Create new food item
            await FoodieExpress.apiRequest('/api/admin/food-items', {
                method: 'POST',
                body: JSON.stringify(foodItemData)
            });
            FoodieExpress.showAlert('Food item added successfully!', 'success');
        }
        
        closeFoodItemModal();
        loadFoodItems();
    } catch (error) {
        console.error('Error saving food item:', error);
        FoodieExpress.showAlert(error.message, 'error');
    }
}

function editFoodItem(foodItemId) {
    const foodItem = allFoodItems.find(item => item.id === foodItemId);
    if (foodItem) {
        showFoodItemModal(foodItem);
    }
}

async function deleteFoodItem(foodItemId) {
    if (!confirm('Are you sure you want to delete this food item?')) return;
    
    try {
        await FoodieExpress.apiRequest(`/api/admin/food-items/${foodItemId}`, {
            method: 'DELETE'
        });
        
        FoodieExpress.showAlert('Food item deleted successfully!', 'success');
        loadFoodItems();
    } catch (error) {
        console.error('Error deleting food item:', error);
        FoodieExpress.showAlert(error.message, 'error');
    }
}

function refreshFoodItems() {
    loadFoodItems();
}

// Restaurant Management Functions
function showRestaurantModal(restaurant = null) {
    const modal = document.getElementById('restaurantModal');
    const title = document.getElementById('restaurantModalTitle');
    const form = document.getElementById('restaurantForm');
    
    if (restaurant) {
        title.textContent = 'Edit Restaurant';
        document.getElementById('restaurantId').value = restaurant.id;
        document.getElementById('restaurantName').value = restaurant.name;
        document.getElementById('restaurantImage').value = restaurant.image;
        document.getElementById('restaurantCuisine').value = restaurant.cuisine;
        document.getElementById('restaurantRating').value = restaurant.rating;
        document.getElementById('restaurantDeliveryTime').value = restaurant.deliveryTime;
    } else {
        title.textContent = 'Add Restaurant';
        form.reset();
        document.getElementById('restaurantId').value = '';
    }
    
    modal.style.display = 'block';
}

function closeRestaurantModal() {
    document.getElementById('restaurantModal').style.display = 'none';
}

async function handleRestaurantSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const restaurantData = {
        name: formData.get('restaurantName') || document.getElementById('restaurantName').value,
        image: formData.get('restaurantImage') || document.getElementById('restaurantImage').value,
        cuisine: formData.get('restaurantCuisine') || document.getElementById('restaurantCuisine').value,
        rating: parseFloat(formData.get('restaurantRating') || document.getElementById('restaurantRating').value),
        deliveryTime: formData.get('restaurantDeliveryTime') || document.getElementById('restaurantDeliveryTime').value
    };
    
    const restaurantId = document.getElementById('restaurantId').value;
    
    try {
        if (restaurantId) {
            // Update existing restaurant
            await FoodieExpress.apiRequest(`/api/admin/restaurants/${restaurantId}`, {
                method: 'PUT',
                body: JSON.stringify(restaurantData)
            });
            FoodieExpress.showAlert('Restaurant updated successfully!', 'success');
        } else {
            // Create new restaurant
            await FoodieExpress.apiRequest('/api/admin/restaurants', {
                method: 'POST',
                body: JSON.stringify(restaurantData)
            });
            FoodieExpress.showAlert('Restaurant added successfully!', 'success');
        }
        
        closeRestaurantModal();
        loadRestaurants();
        loadFoodItems(); // Refresh food items to update restaurant names
    } catch (error) {
        console.error('Error saving restaurant:', error);
        FoodieExpress.showAlert(error.message, 'error');
    }
}

function editRestaurant(restaurantId) {
    const restaurant = allRestaurants.find(r => r.id === restaurantId);
    if (restaurant) {
        showRestaurantModal(restaurant);
    }
}

async function deleteRestaurant(restaurantId) {
    if (!confirm('Are you sure you want to delete this restaurant? This will also affect associated food items.')) return;
    
    try {
        await FoodieExpress.apiRequest(`/api/admin/restaurants/${restaurantId}`, {
            method: 'DELETE'
        });
        
        FoodieExpress.showAlert('Restaurant deleted successfully!', 'success');
        loadRestaurants();
        loadFoodItems(); // Refresh food items as they might be affected
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        FoodieExpress.showAlert(error.message, 'error');
    }
}

function refreshRestaurants() {
    loadRestaurants();
}

// Utility function
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}