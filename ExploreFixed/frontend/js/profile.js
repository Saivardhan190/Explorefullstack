document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (!token || !user) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI with user information
    updateProfileUI(user);
    
    // Set up profile menu tabs
    setupProfileTabs();
    
    // Set up logout functionality
    setupLogout();
    
    // Load initial tab content (Bookings)
    loadTabContent('bookings');
});

function updateProfileUI(user) {
    // Update profile sidebar
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const profileImage = document.querySelector('.profile-image img');
    
    if (profileName) profileName.textContent = user.name || 'User';
    if (profileEmail) profileEmail.textContent = user.email || 'user@example.com';
    
    // Set profile image (using placeholder if no image)
    if (profileImage) {
        profileImage.src = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`;
    }
    
    // Update username in header if exists
    const usernameElement = document.getElementById('username');
    if (usernameElement) {
        usernameElement.textContent = user.name || 'User';
    }
}

function setupProfileTabs() {
    const menuItems = document.querySelectorAll('.profile-menu-item[data-tab]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items and tabs
            document.querySelectorAll('.profile-menu-item').forEach(i => i.classList.remove('active'));
            document.querySelectorAll('.profile-tab').forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Load the corresponding tab content
            const tabId = this.getAttribute('data-tab');
            loadTabContent(tabId);
        });
    });
}

function loadTabContent(tabId) {
    const tabElement = document.getElementById(`${tabId}-tab`);
    if (!tabElement) return;
    
    // Show loading state
    tabElement.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    
    // Add active class to tab
    tabElement.classList.add('active');
    
    // Simulate loading content (in a real app, you would fetch data from API)
    setTimeout(() => {
        switch(tabId) {
            case 'bookings':
                loadBookingsContent(tabElement);
                break;
            case 'profile':
                loadProfileContent(tabElement);
                break;
            case 'wishlist':
                loadWishlistContent(tabElement);
                break;
            case 'reviews':
                loadReviewsContent(tabElement);
                break;
            case 'settings':
                loadSettingsContent(tabElement);
                break;
        }
    }, 500);
}

function loadBookingsContent(container) {
    // Simulate fetching bookings data
    const bookings = [
        {
            id: '1',
            package: {
                name: 'Bali Paradise Package',
                image: 'bali.jpg',
                location: 'Bali, Indonesia',
                duration: '7 Days'
            },
            travelDate: '2025-06-15',
            adults: 2,
            children: 0,
            roomType: 'Deluxe Suite',
            totalPrice: 2598,
            status: 'confirmed',
            paymentStatus: 'paid'
        },
        {
            id: '2',
            package: {
                name: 'Paris Getaway',
                image: 'paris.jpg',
                location: 'Paris, France',
                duration: '5 Days'
            },
            travelDate: '2025-08-10',
            adults: 2,
            children: 1,
            roomType: 'Standard Room',
            totalPrice: 2998,
            status: 'pending',
            paymentStatus: 'unpaid'
        }
    ];
    
    if (bookings.length === 0) {
        container.innerHTML = '<div class="no-content">You have no bookings yet. <a href="packages.html">Browse packages</a> to book your next adventure!</div>';
        return;
    }
    
    let html = '<div class="bookings-list">';
    
    bookings.forEach(booking => {
        const travelDate = new Date(booking.travelDate);
        const formattedDate = travelDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        html += `
            <div class="booking-card">
                <div class="booking-image">
                    <img src="../images/destinations/${booking.package.image}" alt="${booking.package.name}">
                </div>
                <div class="booking-details">
                    <h3>${booking.package.name}</h3>
                    <div class="booking-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${booking.package.location}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${booking.package.duration}</span>
                    </div>
                    <div class="booking-info">
                        <div class="info-item">
                            <span class="label">Travel Date:</span>
                            <span class="value">${formattedDate}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Travelers:</span>
                            <span class="value">${booking.adults} Adult${booking.adults !== 1 ? 's' : ''}${booking.children > 0 ? `, ${booking.children} Child${booking.children !== 1 ? 'ren' : ''}` : ''}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Room Type:</span>
                            <span class="value">${booking.roomType}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Total Price:</span>
                            <span class="value price">$${booking.totalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <div class="booking-status">
                        <span class="status-badge ${booking.status}">${booking.status.toUpperCase()}</span>
                        <span class="payment-badge ${booking.paymentStatus}">${booking.paymentStatus.toUpperCase()}</span>
                    </div>
                    <div class="booking-actions">
                        ${booking.paymentStatus === 'unpaid' ? 
                            `<a href="payment.html?booking=${booking.id}" class="btn btn-primary">Complete Payment</a>` : ''}
                        ${booking.status === 'pending' ? 
                            `<button class="btn btn-danger cancel-booking" data-id="${booking.id}">Cancel Booking</button>` : ''}
                        <a href="package-details.html?id=${booking.id}" class="btn btn-secondary">View Package</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add event listeners for cancel buttons
    document.querySelectorAll('.cancel-booking').forEach(button => {
        button.addEventListener('click', function() {
            const bookingId = this.getAttribute('data-id');
            cancelBooking(bookingId);
        });
    });
}

function loadProfileContent(container) {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    
    container.innerHTML = `
        <form id="profile-form" class="profile-form">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" class="form-control" value="${user.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control" value="${user.email || ''}" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" class="form-control" value="${user.phone || ''}">
            </div>
            <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" class="form-control" value="${user.address || ''}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="city">City</label>
                    <input type="text" id="city" class="form-control" value="${user.city || ''}">
                </div>
                <div class="form-group">
                    <label for="country">Country</label>
                    <input type="text" id="country" class="form-control" value="${user.country || ''}">
                </div>
            </div>
            <div class="form-group">
                <label for="bio">Bio</label>
                <textarea id="bio" class="form-control" rows="4">${user.bio || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <div id="profile-message" class="message"></div>
        </form>
    `;
    
    // Set up form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const city = document.getElementById('city').value;
            const country = document.getElementById('country').value;
            const bio = document.getElementById('bio').value;
            
            // Update user data in localStorage
            const user = JSON.parse(localStorage.getItem('user')) || {};
            user.name = name;
            user.email = email;
            user.phone = phone;
            user.address = address;
            user.city = city;
            user.country = country;
            user.bio = bio;
            
            localStorage.setItem('user', JSON.stringify(user));
            
            // Show success message
            const message = document.getElementById('profile-message');
            message.textContent = 'Profile updated successfully!';
            message.className = 'message success';
            
            // Update profile sidebar
            updateProfileUI(user);
            
            // Hide message after 3 seconds
            setTimeout(() => {
                message.textContent = '';
                message.className = 'message';
            }, 3000);
        });
    }
}

function loadWishlistContent(container) {
    // Simulate fetching wishlist data
    const wishlist = [
        {
            id: '1',
            name: 'Santorini Luxury Escape',
            image: 'santorini.jpg',
            location: 'Santorini, Greece',
            duration: '6 Days',
            price: 2099
        },
        {
            id: '2',
            name: 'Swiss Alps Adventure',
            image: 'swiss_alps.jpg',
            location: 'Switzerland',
            duration: '8 Days',
            price: 1899
        }
    ];
    
    if (wishlist.length === 0) {
        container.innerHTML = '<div class="no-content">Your wishlist is empty. <a href="packages.html">Browse packages</a> to add some!</div>';
        return;
    }
    
    let html = '<div class="wishlist-grid">';
    
    wishlist.forEach(item => {
        html += `
            <div class="wishlist-item">
                <div class="wishlist-image">
                    <img src="../images/destinations/${item.image}" alt="${item.name}">
                    <div class="wishlist-price">$${item.price}</div>
                </div>
                <div class="wishlist-details">
                    <h3>${item.name}</h3>
                    <div class="wishlist-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                        <span><i class="fas fa-clock"></i> ${item.duration}</span>
                    </div>
                    <div class="wishlist-actions">
                        <button class="btn btn-danger remove-wishlist" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                        <a href="package-details.html?id=${item.id}" class="btn btn-primary">
                            Book Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.getAttribute('data-id');
            removeFromWishlist(itemId);
        });
    });
}

function loadReviewsContent(container) {
    // Simulate fetching reviews data
    const reviews = [
        {
            id: '1',
            package: {
                name: 'Bali Paradise Package',
                image: 'bali.jpg'
            },
            date: '2025-05-10',
            rating: 5,
            comment: 'This was an absolutely amazing experience! The accommodations were luxurious, the guided tours were informative, and the entire experience exceeded my expectations.'
        },
        {
            id: '2',
            package: {
                name: 'Paris Getaway',
                image: 'paris.jpg'
            },
            date: '2025-03-15',
            rating: 4,
            comment: 'The Paris Getaway was a wonderful experience overall. The hotel was centrally located, making it easy to explore the city.'
        }
    ];
    
    if (reviews.length === 0) {
        container.innerHTML = '<div class="no-content">You haven\'t written any reviews yet.</div>';
        return;
    }
    
    let html = '<div class="reviews-list">';
    
    reviews.forEach(review => {
        const reviewDate = new Date(review.date);
        const formattedDate = reviewDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        html += `
            <div class="review-card">
                <div class="review-header">
                    <div class="review-package">
                        <img src="../images/destinations/${review.package.image}" alt="${review.package.name}">
                        <div>
                            <h3>${review.package.name}</h3>
                            <div class="review-date">Reviewed on: ${formattedDate}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                        ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                        <span>${review.rating}.0</span>
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.comment}</p>
                </div>
                <div class="review-actions">
                    <button class="btn btn-outline edit-review" data-id="${review.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger delete-review" data-id="${review.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
    
    // Add event listeners for review actions
    document.querySelectorAll('.edit-review').forEach(button => {
        button.addEventListener('click', function() {
            const reviewId = this.getAttribute('data-id');
            editReview(reviewId);
        });
    });
    
    document.querySelectorAll('.delete-review').forEach(button => {
        button.addEventListener('click', function() {
            const reviewId = this.getAttribute('data-id');
            deleteReview(reviewId);
        });
    });
}

function loadSettingsContent(container) {
    container.innerHTML = `
        <div class="settings-section">
            <h3>Change Password</h3>
            <form id="password-form" class="password-form">
                <div class="form-group">
                    <label for="current-password">Current Password</label>
                    <input type="password" id="current-password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" id="new-password" class="form-control" required minlength="6">
                </div>
                <div class="form-group">
                    <label for="confirm-password">Confirm New Password</label>
                    <input type="password" id="confirm-password" class="form-control" required minlength="6">
                </div>
                <button type="submit" class="btn btn-primary">Change Password</button>
                <div id="password-message" class="message"></div>
            </form>
        </div>
        
        <div class="settings-section">
            <h3>Notification Preferences</h3>
            <div class="notification-option">
                <div>
                    <h4>Email Notifications</h4>
                    <p>Receive updates about your bookings, promotions, and travel tips</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="email-notifications" checked>
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="notification-option">
                <div>
                    <h4>SMS Notifications</h4>
                    <p>Receive text messages about booking confirmations and updates</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="sms-notifications">
                    <span class="slider round"></span>
                </label>
            </div>
            <div class="notification-option">
                <div>
                    <h4>Marketing Communications</h4>
                    <p>Receive special offers, promotions, and travel deals</p>
                </div>
                <label class="switch">
                    <input type="checkbox" id="marketing-communications" checked>
                    <span class="slider round"></span>
                </label>
            </div>
            <button class="btn btn-primary">Save Preferences</button>
        </div>
        
        <div class="settings-section danger-zone">
            <h3>Delete Account</h3>
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button class="btn btn-danger" id="delete-account-btn">
                <i class="fas fa-exclamation-triangle"></i> Delete My Account
            </button>
        </div>
    `;
    
    // Set up password form submission
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            const message = document.getElementById('password-message');
            
            // Validate passwords match
            if (newPassword !== confirmPassword) {
                message.textContent = 'New passwords do not match!';
                message.className = 'message error';
                return;
            }
            
            // Validate password length
            if (newPassword.length < 6) {
                message.textContent = 'Password must be at least 6 characters!';
                message.className = 'message error';
                return;
            }
            
            // In a real app, you would send this to your backend
            // For demo, we'll just show a success message
            message.textContent = 'Password changed successfully!';
            message.className = 'message success';
            
            // Clear form
            passwordForm.reset();
            
            // Hide message after 3 seconds
            setTimeout(() => {
                message.textContent = '';
                message.className = 'message';
            }, 3000);
        });
    }
    
    // Set up delete account button
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // In a real app, you would call an API to delete the account
                // For demo, we'll just log out and redirect
                logout();
            }
        });
    }
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        // In a real app, you would call an API to cancel the booking
        // For demo, we'll just show a success message and reload the bookings
        alert('Booking cancelled successfully!');
        loadTabContent('bookings');
    }
}

function removeFromWishlist(itemId) {
    if (confirm('Remove this item from your wishlist?')) {
        // In a real app, you would call an API to remove from wishlist
        // For demo, we'll just show a success message and reload the wishlist
        alert('Item removed from wishlist!');
        loadTabContent('wishlist');
    }
}

function editReview(reviewId) {
    // In a real app, you would show an edit form or modal
    alert(`Editing review ${reviewId}`);
}

function deleteReview(reviewId) {
    if (confirm('Delete this review?')) {
        // In a real app, you would call an API to delete the review
        // For demo, we'll just show a success message and reload the reviews
        alert('Review deleted!');
        loadTabContent('reviews');
    }
}

function setupLogout() {
    const logoutItems = document.querySelectorAll('.profile-menu-item:last-child');
    
    logoutItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
}

function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to home page
    window.location.href = '../index.html';
}