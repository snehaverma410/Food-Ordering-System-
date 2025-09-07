// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/cart') {
        displayCart();
    }
});

function displayCart() {
    const cartContent = document.getElementById('cartContent');
    const cartItems = FoodieExpress.cartItems;
    
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <h2>Your cart is empty</h2>
                <p style="color: #666; margin-bottom: 2rem;">Looks like you haven't added any items to your cart yet.</p>
                <a href="/menu" class="btn btn-primary">Browse Menu</a>
            </div>
        `;
        return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start;">
            <!-- Cart Items -->
            <div>
                ${cartItems.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-details">
                                <h3>${item.name}</h3>
                                <p style="color: #666; margin-bottom: 0.5rem;">${item.description}</p>
                                <div class="cart-item-price">${FoodieExpress.formatPrice(item.price)} each</div>
                            </div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                            <div style="font-size: 1.1rem; font-weight: bold; color: #e74c3c;">
                                Subtotal: ${FoodieExpress.formatPrice(item.price * item.quantity)}
                            </div>
                            <button class="btn btn-danger btn-small" onclick="removeCartItem('${item.id}')">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Order Summary -->
            <div class="card" style="position: sticky; top: 100px; min-width: 300px;">
                <h3>Order Summary</h3>
                <div style="margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>${FoodieExpress.formatPrice(total)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Delivery Fee:</span>
                        <span>$2.99</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Tax:</span>
                        <span>${FoodieExpress.formatPrice(total * 0.08)}</span>
                    </div>
                    <hr>
                    <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold;">
                        <span>Total:</span>
                        <span style="color: #e74c3c;">${FoodieExpress.formatPrice(total + 2.99 + (total * 0.08))}</span>
                    </div>
                </div>
                <button class="btn btn-primary w-full" onclick="proceedToCheckout()">Proceed to Checkout</button>
                <a href="/menu" class="btn btn-secondary w-full" style="margin-top: 1rem;">Continue Shopping</a>
            </div>
        </div>
    `;
}

function updateCartQuantity(itemId, newQuantity) {
    FoodieExpress.updateQuantity(itemId, newQuantity);
    displayCart(); // Refresh the cart display
}

function removeCartItem(itemId) {
    FoodieExpress.removeFromCart(itemId);
    displayCart(); // Refresh the cart display
}

function proceedToCheckout() {
    // Check if user is logged in
    if (!FoodieExpress.currentUser) {
        FoodieExpress.showAlert('Please login to proceed with checkout', 'info');
        setTimeout(() => {
            window.location.href = '/auth';
        }, 2000);
        return;
    }
    
    // Redirect to checkout
    window.location.href = '/checkout';
}