// Frontend JavaScript for handling packages page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load packages from API
    loadPackages();

    // Set up filter functionality
    setupFilters();

    // Check if user is logged in and update UI
    checkUserLoginStatus();
});

// Function to load packages from API
async function loadPackages() {
    try {
        const packagesContainer = document.getElementById('packages-container');
        if (!packagesContainer) return;

        // Show loading state
        packagesContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading packages...</div>';

        // Get packages from API
        const response = await window.exploreAPI.getPackages();

        if (response.success && response.data.length > 0) {
            // Clear loading state
            packagesContainer.innerHTML = '';

            // Render packages
            response.data.forEach(pkg => {
                const packageCard = createPackageCard(pkg);
                packagesContainer.appendChild(packageCard);
            });
        } else {
            packagesContainer.innerHTML = '<div class="no-packages">No packages found. Please try again later.</div>';
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        const packagesContainer = document.getElementById('packages-container');
        if (packagesContainer) {
            packagesContainer.innerHTML = '<div class="error">Failed to load packages. Please try again later.</div>';
        }
    }
}

// Function to create a package card element
function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';

    const discountTag = pkg.discount > 0 ? `<div class="discount-tag">${pkg.discount}% OFF</div>` : '';
    const originalPrice = pkg.discount > 0 ? `<span class="original-price">$${pkg.price + (pkg.price * pkg.discount / 100)}</span>` : '';

    card.innerHTML = `
        <div class="package-image">
            <img src="../images/destinations/${pkg.image}" alt="${pkg.name}">
            <div class="package-price">
                ${originalPrice}
                <span>$${pkg.price}</span>
            </div>
            ${discountTag}
        </div>
        <div class="package-details">
            <h3>${pkg.name}</h3>
            <div class="package-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${pkg.location}</span>
                <span><i class="fas fa-calendar-alt"></i> ${pkg.duration}</span>
            </div>
            <p>${pkg.description.substring(0, 100)}...</p>
            <div class="package-rating">
                <div class="stars">
                    ${getStarRating(pkg.rating)}
                </div>
                <span>${pkg.rating}</span>
            </div>
            <a href="package-details.html?id=${pkg._id}" class="btn">View Details</a>
        </div>
    `;

    return card;
}

// Function to generate star rating HTML
function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';

    for (let i = 0; i < fullStars; i++) starsHTML += '<i class="fas fa-star"></i>';
    if (halfStar) starsHTML += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < emptyStars; i++) starsHTML += '<i class="far fa-star"></i>';

    return starsHTML;
}

// Function to set up filter functionality
function setupFilters() {
    const filterForm = document.getElementById('filter-form');
    if (!filterForm) return;

    filterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const destination = document.getElementById('destination').value.toLowerCase();
        const duration = document.getElementById('duration').value;
        const budget = document.getElementById('budget').value;

        filterPackages(destination, duration, budget);
    });

    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            filterForm.reset();
            loadPackages();
        });
    }
}

// Function to filter packages
function filterPackages(destination, duration, budget) {
    const packageCards = document.querySelectorAll('.package-card');

    packageCards.forEach(card => {
        const cardLocation = card.querySelector('.package-meta span:first-child').textContent.toLowerCase();
        const cardDuration = card.querySelector('.package-meta span:last-child').textContent;
        const cardPrice = card.querySelector('.package-price span:last-child').textContent;
        const price = parseInt(cardPrice.replace('$', ''));

        let showCard = true;

        if (destination && !cardLocation.includes(destination)) showCard = false;

        if (duration) {
            const days = parseInt(cardDuration);
            if (duration === 'short' && days > 5) showCard = false;
            if (duration === 'medium' && (days < 6 || days > 10)) showCard = false;
            if (duration === 'long' && days < 11) showCard = false;
        }

        if (budget) {
            if (budget === 'budget' && price > 1500) showCard = false;
            if (budget === 'standard' && (price < 1500 || price > 2500)) showCard = false;
            if (budget === 'luxury' && price < 2500) showCard = false;
        }

        card.style.display = showCard ? 'flex' : 'none';
    });

    const visibleCards = document.querySelectorAll('.package-card[style="display: flex"]');
    const noResultsMsg = document.querySelector('.no-results');

    if (visibleCards.length === 0) {
        if (!noResultsMsg) {
            const packagesContainer = document.getElementById('packages-container');
            const message = document.createElement('div');
            message.className = 'no-results';
            message.innerHTML = 'No packages match your filters. Please try different criteria.';
            packagesContainer.appendChild(message);
        } else {
            noResultsMsg.style.display = 'block';
        }
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

// Function to check user login status and update UI
function checkUserLoginStatus() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const navList = document.querySelector('.nav-links');
    if (!navList) return;

    if (token && user) {
        const loginLink = navList.querySelector('a[href$="login.html"]')?.parentElement;
        const signupLink = navList.querySelector('a[href$="signup.html"]')?.parentElement;

        if (loginLink) loginLink.remove();
        if (signupLink) signupLink.remove();

        const welcomeItem = document.createElement('li');
        welcomeItem.innerHTML = `<span style="color: #fff;">Welcome, ${user.name?.split(' ')[0] || 'User'}</span>`;

        const profileItem = document.createElement('li');
        profileItem.innerHTML = '<a href="profile.html" class="btn btn-outline">Profile</a>';

        navList.appendChild(welcomeItem);
        navList.appendChild(profileItem);
    }
}
