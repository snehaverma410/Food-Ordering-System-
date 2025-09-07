// Orders Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/orders') {
        initializeOrdersPage();
    }
});

function initializeOrdersPage() {
    // Check if user is logged in
    if (!FoodieExpress.currentUser) {
        window.location.href = '/auth';
        return;
    }
    
    loadUserOrders();
}

async function loadUserOrders() {
    const ordersContent = document.getElementById('ordersContent');
    
    try {
        const orders = await FoodieExpress.apiRequest('/api/orders');
        
        if (orders.length === 0) {
            ordersContent.innerHTML = `
                <div class="text-center" style="padding: 3rem;">
                    <h2>No orders yet</h2>
                    <p style="color: #666; margin-bottom: 2rem;">You haven't placed any orders yet. Start browsing our menu!</p>
                    <a href="/menu" class="btn btn-primary">Browse Menu</a>
                </div>
            `;
            return;
        }
        
        // Sort orders by date (newest first)
        orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        
        ordersContent.innerHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id.substring(0, 8)}</div>
                        <div style="font-size: 0.9rem; color: #666;">${FoodieExpress.formatDate(order.orderDate)}</div>
                    </div>
                    <div class="order-status status-${order.status}">${capitalizeFirst(order.status)}</div>
                </div>
                
                <div class="order-items">
                    <h4 style="margin-bottom: 0.5rem;">Items:</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>${FoodieExpress.formatPrice(item.total)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Payment:</strong> ${capitalizeFirst(order.paymentMethod.replace('_', ' '))}
                    </div>
                    <div class="order-total">Total: ${FoodieExpress.formatPrice(order.totalAmount)}</div>
                </div>
                
                ${order.deliveryAddress ? `
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666;">
                        <strong>Delivery Address:</strong><br>
                        ${order.deliveryAddress.fullName}<br>
                        ${order.deliveryAddress.address}<br>
                        ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.zipCode}<br>
                        ${order.deliveryAddress.phone}
                    </div>
                ` : ''}
                
                ${getOrderActions(order)}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersContent.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <h2>Error loading orders</h2>
                <p style="color: #666; margin-bottom: 2rem;">Something went wrong while loading your orders. Please try again.</p>
                <button onclick="loadUserOrders()" class="btn btn-primary">Try Again</button>
            </div>
        `;
    }
}

function getOrderActions(order) {
    const actions = [];
    
    // Track order button for pending/preparing orders
    if (order.status === 'pending' || order.status === 'preparing') {
        actions.push(`
            <button class="btn btn-secondary btn-small" onclick="trackOrder('${order.id}')">
                Track Order
            </button>
        `);
    }
    
    // Reorder button for completed orders
    if (order.status === 'completed') {
        actions.push(`
            <button class="btn btn-primary btn-small" onclick="reorderItems('${order.id}')">
                Order Again
            </button>
        `);
    }
    
    // Help/Support button
    actions.push(`
        <button class="btn btn-secondary btn-small" onclick="contactSupport('${order.id}')">
            Need Help?
        </button>
    `);
    
    if (actions.length === 0) return '';
    
    return `
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                ${actions.join('')}
            </div>
        </div>
    `;
}

function trackOrder(orderId) {
    FoodieExpress.showAlert('Order tracking feature coming soon! You will receive SMS updates about your order status.', 'info');
}

function reorderItems(orderId) {
    // This would typically fetch the order details and add items back to cart
    FoodieExpress.showAlert('Reorder feature coming soon! You can manually add the items from your order history.', 'info');
}

function contactSupport(orderId) {
    const supportMessage = `Hi, I need help with order #${orderId.substring(0, 8)}. Please contact me at your earliest convenience.`;
    const encodedMessage = encodeURIComponent(supportMessage);
    
    // You can customize this with your actual support contact method
    const supportOptions = [
        { name: 'Email', action: () => window.open(`mailto:support@foodieexpress.com?subject=Order Support&body=${encodedMessage}`) },
        { name: 'Phone', action: () => window.open('tel:+15551234567') },
        { name: 'Live Chat', action: () => FoodieExpress.showAlert('Live chat feature coming soon! Please email or call us for immediate assistance.', 'info') }
    ];
    
    const optionsHtml = supportOptions.map(option => 
        `<button class="btn btn-secondary" onclick="(${option.action})()" style="margin: 0.5rem;">${option.name}</button>`
    ).join('');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Contact Support</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <p>How would you like to contact our support team regarding order #${orderId.substring(0, 8)}?</p>
            <div class="text-center">
                ${optionsHtml}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}