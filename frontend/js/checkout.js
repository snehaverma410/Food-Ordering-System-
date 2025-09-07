// Checkout Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/checkout') {
        initializeCheckout();
    }
});

function initializeCheckout() {
    // Check if user is logged in
    if (!FoodieExpress.currentUser) {
        window.location.href = '/auth';
        return;
    }
    
    // Check if cart has items
    if (FoodieExpress.cartItems.length === 0) {
        window.location.href = '/cart';
        return;
    }
    
    displayCheckout();
}

function displayCheckout() {
    const checkoutContent = document.getElementById('checkoutContent');
    const cartItems = FoodieExpress.cartItems;
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 2.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;
    
    checkoutContent.innerHTML = `
        <form id="checkoutForm" style="display: grid; grid-template-columns: 1fr auto; gap: 2rem; align-items: start;">
            <!-- Checkout Form -->
            <div>
                <div class="card">
                    <h2>Delivery Information</h2>
                    
                    <div class="form-group">
                        <label for="fullName">Full Name</label>
                        <input type="text" id="fullName" name="fullName" class="form-control" 
                               value="${FoodieExpress.currentUser.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" class="form-control" 
                               placeholder="(555) 123-4567" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Street Address</label>
                        <input type="text" id="address" name="address" class="form-control" 
                               placeholder="123 Main Street" required>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" name="city" class="form-control" 
                                   placeholder="New York" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="state">State</label>
                            <input type="text" id="state" name="state" class="form-control" 
                                   placeholder="NY" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="zipCode">ZIP Code</label>
                            <input type="text" id="zipCode" name="zipCode" class="form-control" 
                                   placeholder="10001" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="instructions">Delivery Instructions (Optional)</label>
                        <textarea id="instructions" name="instructions" class="form-control" 
                                  placeholder="e.g., Leave at front door, Ring doorbell, etc."></textarea>
                    </div>
                </div>
                
                <div class="card">
                    <h2>Payment Method</h2>
                    
                    <div class="form-group">
                        <label for="paymentMethod">Select Payment Method</label>
                        <select id="paymentMethod" name="paymentMethod" class="form-control form-select" required>
                            <option value="">Choose payment method</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="debit_card">Debit Card</option>
                            <option value="digital_wallet">Digital Wallet</option>
                            <option value="cash">Cash on Delivery</option>
                        </select>
                    </div>
                    
                    <div id="cardDetails" style="display: none;">
                        <div class="form-group">
                            <label for="cardNumber">Card Number</label>
                            <input type="text" id="cardNumber" name="cardNumber" class="form-control" 
                                   placeholder="1234 5678 9012 3456">
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label for="expiryMonth">Expiry Month</label>
                                <select id="expiryMonth" name="expiryMonth" class="form-control form-select">
                                    <option value="">MM</option>
                                    ${Array.from({length: 12}, (_, i) => {
                                        const month = (i + 1).toString().padStart(2, '0');
                                        return `<option value="${month}">${month}</option>`;
                                    }).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="expiryYear">Expiry Year</label>
                                <select id="expiryYear" name="expiryYear" class="form-control form-select">
                                    <option value="">YYYY</option>
                                    ${Array.from({length: 10}, (_, i) => {
                                        const year = new Date().getFullYear() + i;
                                        return `<option value="${year}">${year}</option>`;
                                    }).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" name="cvv" class="form-control" 
                                       placeholder="123" maxlength="4">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cardName">Name on Card</label>
                            <input type="text" id="cardName" name="cardName" class="form-control" 
                                   placeholder="John Doe">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Order Summary -->
            <div class="card" style="position: sticky; top: 100px; min-width: 350px;">
                <h3>Order Summary</h3>
                
                <div style="margin-bottom: 1.5rem;">
                    ${cartItems.map(item => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                            <div>
                                <div style="font-weight: 500;">${item.name}</div>
                                <div style="font-size: 0.9rem; color: #666;">Qty: ${item.quantity} × ${FoodieExpress.formatPrice(item.price)}</div>
                            </div>
                            <div style="font-weight: 600;">${FoodieExpress.formatPrice(item.price * item.quantity)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin: 1.5rem 0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>${FoodieExpress.formatPrice(subtotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Delivery Fee:</span>
                        <span>${FoodieExpress.formatPrice(deliveryFee)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Tax:</span>
                        <span>${FoodieExpress.formatPrice(tax)}</span>
                    </div>
                    <hr>
                    <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold;">
                        <span>Total:</span>
                        <span style="color: #e74c3c;">${FoodieExpress.formatPrice(total)}</span>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-full">Place Order</button>
                <a href="/cart" class="btn btn-secondary w-full" style="margin-top: 1rem;">Back to Cart</a>
                
                <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #eee; font-size: 0.9rem; color: #666; text-align: center;">
                    <p>🔒 Your payment information is secure and encrypted</p>
                    <p>📱 You will receive order updates via SMS</p>
                </div>
            </div>
        </form>
    `;
    
    setupCheckoutForm();
}

function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkoutForm');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const cardDetails = document.getElementById('cardDetails');
    
    // Show/hide card details based on payment method
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            const needsCardDetails = ['credit_card', 'debit_card'].includes(this.value);
            cardDetails.style.display = needsCardDetails ? 'block' : 'none';
            
            // Set required attributes for card fields
            const cardFields = cardDetails.querySelectorAll('input, select');
            cardFields.forEach(field => {
                if (needsCardDetails) {
                    field.setAttribute('required', '');
                } else {
                    field.removeAttribute('required');
                }
            });
        });
    }
    
    // Handle form submission
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleOrderSubmission);
    }
}

async function handleOrderSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        items: FoodieExpress.cartItems.map(item => ({
            foodItemId: item.id,
            quantity: item.quantity
        })),
        deliveryAddress: {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            instructions: formData.get('instructions')
        },
        paymentMethod: formData.get('paymentMethod')
    };
    
    try {
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Placing Order...';
        submitBtn.disabled = true;
        
        const response = await FoodieExpress.apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
        
        // Clear cart
        FoodieExpress.cartItems.length = 0;
        localStorage.removeItem('cart');
        
        FoodieExpress.showAlert('Order placed successfully! Redirecting to order details...', 'success');
        
        // Redirect to orders page after a short delay
        setTimeout(() => {
            window.location.href = `/orders`;
        }, 2000);
        
    } catch (error) {
        console.error('Order submission error:', error);
        FoodieExpress.showAlert(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
        // Reset button state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Place Order';
        submitBtn.disabled = false;
    }
}