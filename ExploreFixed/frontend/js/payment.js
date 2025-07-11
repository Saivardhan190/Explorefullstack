// Frontend JavaScript for handling payment page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!token || !user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html?redirect=payment';
        return;
    }
    
    // Get booking details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    const travelDate = urlParams.get('date');
    const adults = parseInt(urlParams.get('adults') || '1');
    const children = parseInt(urlParams.get('children') || '0');
    const roomType = urlParams.get('room') || 'Standard';
    
    // If no package ID, redirect to packages page
    if (!packageId) {
        window.location.href = 'packages.html';
        return;
    }
    
    // Load package details and populate payment form
    loadPackageDetails(packageId, travelDate, adults, children, roomType);
    
    // Set up payment form submission
    setupPaymentForm(packageId, travelDate, adults, children, roomType);
});

// Function to load package details and populate payment form
async function loadPackageDetails(packageId, travelDate, adults, children, roomType) {
    try {
        const paymentSummary = document.getElementById('payment-summary');
        if (!paymentSummary) return;
        
        // Show loading state
        paymentSummary.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading payment details...</div>';
        
        // Get package details from API
        const response = await window.exploreAPI.getPackage(packageId);
        
        if (response.success && response.data) {
            const pkg = response.data;
            
            // Calculate total price
            const adultPrice = pkg.price;
            const childPrice = pkg.price * 0.5;
            const totalPrice = (adultPrice * adults) + (childPrice * children);
            
            // Format travel date
            const formattedDate = travelDate ? new Date(travelDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified';
            
            // Update payment summary
            paymentSummary.innerHTML = `
                <h3>Payment Summary</h3>
                <div class="summary-item">
                    <span>Package:</span>
                    <span>${pkg.name}</span>
                </div>
                <div class="summary-item">
                    <span>Duration:</span>
                    <span>${pkg.duration}</span>
                </div>
                <div class="summary-item">
                    <span>Travel Date:</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="summary-item">
                    <span>Travelers:</span>
                    <span>${adults} Adult${adults !== 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}</span>
                </div>
                <div class="summary-item">
                    <span>Room Type:</span>
                    <span>${roomType}</span>
                </div>
                <div class="summary-item">
                    <span>Adult Price:</span>
                    <span>$${adultPrice.toLocaleString()} x ${adults}</span>
                </div>
                ${children > 0 ? `
                <div class="summary-item">
                    <span>Child Price:</span>
                    <span>$${childPrice.toLocaleString()} x ${children}</span>
                </div>
                ` : ''}
                <div class="summary-total">
                    <span>Total Amount:</span>
                    <span>$${totalPrice.toLocaleString()}</span>
                </div>
            `;
            
            // Update hidden fields in payment form
            document.getElementById('package-id').value = packageId;
            document.getElementById('travel-date').value = travelDate || '';
            document.getElementById('adults').value = adults;
            document.getElementById('children').value = children;
            document.getElementById('room-type').value = roomType;
            document.getElementById('total-amount').value = totalPrice;
            
            // Update page title
            document.title = `Payment for ${pkg.name} - Explore Travel`;
        } else {
            paymentSummary.innerHTML = '<div class="error">Failed to load package details. Please try again later.</div>';
        }
    } catch (error) {
        console.error('Error loading package details:', error);
        const paymentSummary = document.getElementById('payment-summary');
        if (paymentSummary) {
            paymentSummary.innerHTML = '<div class="error">Failed to load package details. Please try again later.</div>';
        }
    }
}

// Function to set up payment form submission
function setupPaymentForm(packageId, travelDate, adults, children, roomType) {
    const paymentForm = document.getElementById('payment-form');
    const paymentMessage = document.getElementById('payment-message');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const cardName = document.getElementById('card-name').value;
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const totalAmount = document.getElementById('total-amount').value;
            
            try {
                paymentMessage.textContent = '';
                paymentMessage.className = '';
                paymentMessage.style.display = 'none';
                
                // Validate card details
                if (!validateCardDetails(cardNumber, cardExpiry, cardCvv)) {
                    throw new Error('Invalid card details');
                }
                
                // Show loading state
                document.getElementById('payment-btn').textContent = 'Processing Payment...';
                document.getElementById('payment-btn').disabled = true;
                
                // Create booking first
                const bookingData = {
                    travelDate,
                    adults,
                    children,
                    roomType,
                    specialRequests: document.getElementById('special-requests').value
                };
                
                const bookingResponse = await window.exploreAPI.createBooking(packageId, bookingData);
                
                if (!bookingResponse.success) {
                    throw new Error(bookingResponse.error || 'Failed to create booking');
                }
                
                // Process payment
                const paymentData = {
                    amount: totalAmount,
                    paymentMethod: 'card',
                    cardDetails: {
                        name: cardName,
                        number: cardNumber,
                        expiry: cardExpiry,
                        cvv: cardCvv
                    }
                };
                
                const paymentResponse = await window.exploreAPI.processPayment(bookingResponse.data._id, paymentData);
                
                if (!paymentResponse.success) {
                    throw new Error(paymentResponse.error || 'Payment processing failed');
                }
                
                // Show success message and redirect to confirmation page
                paymentMessage.textContent = 'Payment successful! Redirecting to confirmation page...';
                paymentMessage.className = 'success-message';
                paymentMessage.style.display = 'block';
                
                // Redirect to confirmation page after a short delay
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
            } catch (error) {
                console.error('Payment error:', error);
                paymentMessage.textContent = error.message || 'Payment processing failed. Please try again.';
                paymentMessage.className = 'error-message';
                paymentMessage.style.display = 'block';
                
                // Reset button state
                document.getElementById('payment-btn').textContent = 'Complete Payment';
                document.getElementById('payment-btn').disabled = false;
            }
        });
    }
}

// Function to validate card details
function validateCardDetails(cardNumber, cardExpiry, cardCvv) {
    // Remove spaces and dashes
    const number = cardNumber.replace(/[\s-]/g, '');
    
    // Check if card number is valid (simple check for demo)
    if (!/^\d{16}$/.test(number)) {
        return false;
    }
    
    // Check if expiry date is valid (MM/YY format)
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        return false;
    }
    
    // Check if CVV is valid (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cardCvv)) {
        return false;
    }
    
    return true;
}

// Function to format card number with spaces
function formatCardNumber(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Update the input value
    input.value = value;
}

// Function to format expiry date (MM/YY)
function formatExpiryDate(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, '');
    
    // Add a slash after the first 2 digits
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    // Update the input value
    input.value = value;
}

// Add event listeners for input formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('card-number');
    const cardExpiryInput = document.getElementById('card-expiry');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    }
});
