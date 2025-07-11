// Frontend JavaScript for handling package details page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get package ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
    
    // If no package ID, redirect to packages page
    if (!packageId) {
        window.location.href = 'packages.html';
        return;
    }
    
    // Load package details
    loadPackageDetails(packageId);
    
    // Set up booking form submission
    setupBookingForm(packageId);
    
    // Check if user is logged in and update UI
    checkUserLoginStatus();
});

// Function to load package details
async function loadPackageDetails(packageId) {
    try {
        const packageContainer = document.getElementById('package-container');
        if (!packageContainer) return;
        
        // Show loading state
        packageContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading package details...</div>';
        
        // Get package details from API
        const response = await window.exploreAPI.getPackage(packageId);
        
        if (response.success && response.data) {
            const pkg = response.data;
            
            // Update page title
            document.title = `${pkg.name} - Explore Travel`;
            
            // Create package details HTML
            const packageHTML = `
                <div class="package-header">
                    <div class="package-image">
                        <img src="../images/destinations/${pkg.image}" alt="${pkg.name}">
                        <div class="package-price">
                            ${pkg.discount > 0 ? `<span class="original-price">$${(pkg.price + (pkg.price * pkg.discount / 100)).toLocaleString()}</span>` : ''}
                            <span>$${pkg.price.toLocaleString()}</span>
                        </div>
                        ${pkg.discount > 0 ? `<div class="discount-tag">${pkg.discount}% OFF</div>` : ''}
                    </div>
                    <div class="package-info">
                        <h1>${pkg.name}</h1>
                        <div class="package-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${pkg.duration}</span>
                        </div>
                        <div class="package-rating">
                            <div class="stars">
                                ${getStarRating(pkg.rating)}
                            </div>
                            <span>${pkg.rating} (${pkg.reviews ? pkg.reviews.length : 0} reviews)</span>
                        </div>
                        <p class="package-description">${pkg.description}</p>
                        <a href="#booking-section" class="btn btn-primary">Book Now</a>
                        <a href="packages.html" class="btn btn-secondary">Back to Packages</a>
                    </div>
                </div>
                
                <div class="package-details-tabs">
                    <div class="tabs">
                        <button class="tab-btn active" data-tab="itinerary">Itinerary</button>
                        <button class="tab-btn" data-tab="inclusions">Inclusions & Exclusions</button>
                        <button class="tab-btn" data-tab="reviews">Reviews</button>
                    </div>
                    
                    <div class="tab-content active" id="itinerary">
                        <h3>Detailed Itinerary</h3>
                        <div class="itinerary-timeline">
                            <div class="timeline-item">
                                <div class="day">Day 1</div>
                                <div class="content">
                                    <h4>Arrival and Welcome</h4>
                                    <p>Arrive at your destination where our representative will meet you at the airport. Transfer to your hotel and enjoy a welcome dinner in the evening.</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="day">Day 2</div>
                                <div class="content">
                                    <h4>City Exploration</h4>
                                    <p>After breakfast, embark on a guided tour of the city's main attractions. Visit historical landmarks, cultural sites, and enjoy local cuisine for lunch.</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="day">Day 3</div>
                                <div class="content">
                                    <h4>Nature and Adventure</h4>
                                    <p>Spend the day exploring natural wonders with activities tailored to the destination. Options may include hiking, snorkeling, or wildlife spotting.</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="day">Day 4</div>
                                <div class="content">
                                    <h4>Cultural Immersion</h4>
                                    <p>Immerse yourself in local culture with workshops, cooking classes, or traditional performances. Interact with locals and learn about their way of life.</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="day">Day 5</div>
                                <div class="content">
                                    <h4>Leisure Day</h4>
                                    <p>Enjoy a day at your own pace. Relax at the hotel, explore nearby attractions, or opt for additional activities (some may have extra costs).</p>
                                </div>
                            </div>
                            <div class="timeline-item">
                                <div class="day">Final Day</div>
                                <div class="content">
                                    <h4>Departure</h4>
                                    <p>After breakfast, check out from your hotel. Depending on your flight time, enjoy some last-minute shopping or sightseeing before transfer to the airport.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="inclusions">
                        <div class="inclusions-container">
                            <div class="inclusions">
                                <h3>What's Included</h3>
                                <ul>
                                    ${pkg.inclusions ? pkg.inclusions.map(item => `<li><i class="fas fa-check"></i> ${item}</li>`).join('') : `
                                    <li><i class="fas fa-check"></i> Accommodation in 4-5 star hotels</li>
                                    <li><i class="fas fa-check"></i> Daily breakfast and selected meals</li>
                                    <li><i class="fas fa-check"></i> Airport transfers and transportation</li>
                                    <li><i class="fas fa-check"></i> English-speaking local guide</li>
                                    <li><i class="fas fa-check"></i> Entrance fees to attractions in itinerary</li>
                                    <li><i class="fas fa-check"></i> 24/7 customer support</li>
                                    `}
                                </ul>
                            </div>
                            <div class="exclusions">
                                <h3>What's Not Included</h3>
                                <ul>
                                    ${pkg.exclusions ? pkg.exclusions.map(item => `<li><i class="fas fa-times"></i> ${item}</li>`).join('') : `
                                    <li><i class="fas fa-times"></i> International airfare</li>
                                    <li><i class="fas fa-times"></i> Travel insurance</li>
                                    <li><i class="fas fa-times"></i> Visa fees (if applicable)</li>
                                    <li><i class="fas fa-times"></i> Meals not mentioned in the itinerary</li>
                                    <li><i class="fas fa-times"></i> Personal expenses</li>
                                    <li><i class="fas fa-times"></i> Optional activities and excursions</li>
                                    `}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="reviews">
                        <h3>Customer Reviews</h3>
                        <div class="reviews-container">
                            ${pkg.reviews && pkg.reviews.length > 0 ? pkg.reviews.map(review => `
                                <div class="review-card">
                                    <div class="review-header">
                                        <div class="reviewer-info">
                                            <div class="reviewer-avatar">
                                                <i class="fas fa-user"></i>
                                            </div>
                                            <div class="reviewer-name-date">
                                                <h4>${review.name}</h4>
                                                <span>${new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                        <div class="review-rating">
                                            ${getStarRating(review.rating)}
                                            <span>${review.rating}</span>
                                        </div>
                                    </div>
                                    <div class="review-content">
                                        <p>${review.text}</p>
                                    </div>
                                </div>
                            `).join('') : `
                                <div class="no-reviews">
                                    <p>No reviews yet. Be the first to review this package!</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div id="booking-section" class="booking-section">
                    <h2>Book This Package</h2>
                    <div class="booking-container">
                        <form id="booking-form" class="booking-form">
                            <div class="form-group">
                                <label for="travel-date">Travel Date</label>
                                <input type="date" id="travel-date" name="travel-date" required min="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="adults">Adults</label>
                                    <input type="number" id="adults" name="adults" min="1" value="1" required>
                                </div>
                                <div class="form-group">
                                    <label for="children">Children</label>
                                    <input type="number" id="children" name="children" min="0" value="0">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="room-type">Room Type</label>
                                <select id="room-type" name="room-type" required>
                                    <option value="Standard">Standard Room</option>
                                    <option value="Deluxe">Deluxe Room</option>
                                    <option value="Suite">Suite</option>
                                    <option value="Family">Family Room</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="special-requests">Special Requests (Optional)</label>
                                <textarea id="special-requests" name="special-requests" rows="3"></textarea>
                            </div>
                            <div class="price-calculator">
                                <div class="price-item">
                                    <span>Base Price:</span>
                                    <span>$${pkg.price.toLocaleString()} per adult</span>
                                </div>
                                <div class="price-item">
                                    <span>Child Price:</span>
                                    <span>$${(pkg.price * 0.5).toLocaleString()} per child</span>
                                </div>
                                <div class="price-total">
                                    <span>Estimated Total:</span>
                                    <span id="total-price">$${pkg.price.toLocaleString()}</span>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Proceed to Payment</button>
                        </form>
                    </div>
                </div>
                
                <div class="related-packages">
                    <h2>You May Also Like</h2>
                    <div class="related-packages-container">
                        <!-- Related packages will be loaded dynamically -->
                    </div>
                </div>
            `;
            
            // Update package container
            packageContainer.innerHTML = packageHTML;
            
            // Set up tab functionality
            setupTabs();
            
            // Set up price calculator
            setupPriceCalculator(pkg.price);
            
            // Load related packages
            loadRelatedPackages(pkg.location);
        } else {
            packageContainer.innerHTML = '<div class="error">Failed to load package details. Please try again later.</div>';
        }
    } catch (error) {
        console.error('Error loading package details:', error);
        const packageContainer = document.getElementById('package-container');
        if (packageContainer) {
            packageContainer.innerHTML = '<div class="error">Failed to load package details. Please try again later.</div>';
        }
    }
}

// Function to generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Function to set up tab functionality
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Function to set up price calculator
function setupPriceCalculator(basePrice) {
    const adultsInput = document.getElementById('adults');
    const childrenInput = document.getElementById('children');
    const totalPriceElement = document.getElementById('total-price');
    
    if (adultsInput && childrenInput && totalPriceElement) {
        const updatePrice = () => {
            const adults = parseInt(adultsInput.value) || 1;
            const children = parseInt(childrenInput.value) || 0;
            
            const adultPrice = basePrice;
            const childPrice = basePrice * 0.5;
            
            const totalPrice = (adultPrice * adults) + (childPrice * children);
            
            totalPriceElement.textContent = `$${totalPrice.toLocaleString()}`;
        };
        
        adultsInput.addEventListener('change', updatePrice);
        childrenInput.addEventListener('change', updatePrice);
        
        // Initial calculation
        updatePrice();
    }
}

// Function to load related packages
async function loadRelatedPackages(location) {
    try {
        const relatedContainer = document.querySelector('.related-packages-container');
        if (!relatedContainer) return;
        
        // Show loading state
        relatedContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading related packages...</div>';
        
        // Get packages from API
        const response = await window.exploreAPI.getPackages();
        
        if (response.success && response.data.length > 0) {
            // Filter packages by location (simple matching for demo)
            const relatedPackages = response.data
                .filter(pkg => pkg.location.includes(location.split(',')[0]) || location.includes(pkg.location.split(',')[0]))
                .slice(0, 3);
            
            if (relatedPackages.length > 0) {
                // Clear loading state
                relatedContainer.innerHTML = '';
                
                // Render related packages
                relatedPackages.forEach(pkg => {
                    const packageCard = document.createElement('div');
                    packageCard.className = 'related-package-card';
                    
                    packageCard.innerHTML = `
                        <div class="package-image">
                            <img src="../images/destinations/${pkg.image}" alt="${pkg.name}">
                            <div class="package-price">
                                ${pkg.discount > 0 ? `<span class="original-price">$${(pkg.price + (pkg.price * pkg.discount / 100)).toLocaleString()}</span>` : ''}
                                <span>$${pkg.price.toLocaleString()}</span>
                            </div>
                            ${pkg.discount > 0 ? `<div class="discount-tag">${pkg.discount}% OFF</div>` : ''}
                        </div>
                        <div class="package-details">
                            <h3>${pkg.name}</h3>
                            <div class="package-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
                                <span><i class="fas fa-calendar-alt"></i> ${pkg.duration}</span>
                            </div>
                            <div class="package-rating">
                                <div class="stars">
                                    ${getStarRating(pkg.rating)}
                                </div>
                                <span>${pkg.rating}</span>
                            </div>
                            <a href="package-details.html?id=${pkg._id}" class="btn">View Details</a>
                        </div>
                    `;
                    
                    relatedContainer.appendChild(packageCard);
                });
            } else {
                relatedContainer.innerHTML = '<div class="no-packages">No related packages found.</div>';
            }
        } else {
            relatedContainer.innerHTML = '<div class="no-packages">No related packages found.</div>';
        }
    } catch (error) {
        console.error('Error loading related packages:', error);
        const relatedContainer = document.querySelector('.related-packages-container');
        if (relatedContainer) {
            relatedContainer.innerHTML = '<div class="error">Failed to load related packages.</div>';
        }
    }
}

// Function to set up booking form submission
function setupBookingForm(packageId) {
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login page with return URL
                window.location.href = `login.html?redirect=package-details&package=${packageId}`;
                return;
            }
            
            // Get form values
            const travelDate = document.getElementById('travel-date').value;
            const adults = document.getElementById('adults').value;
            const children = document.getElementById('children').value;
            const roomType = document.getElementById('room-type').value;
            const specialRequests = document.getElementById('special-requests').value;
            
            // Redirect to payment page with parameters
            window.location.href = `payment.html?package=${packageId}&date=${travelDate}&adults=${adults}&children=${children}&room=${roomType}&requests=${encodeURIComponent(specialRequests)}`;
        });
    }
}

// Function to check user login status and update UI
function checkUserLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    
    if (token && user) {
        // Update UI for logged-in user
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const profileBtn = document.getElementById('profileBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginBtn && signupBtn && profileBtn && logoutBtn) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            profileBtn.style.display = 'block';
            logoutBtn.style.display = 'block';
        }
    }
}
