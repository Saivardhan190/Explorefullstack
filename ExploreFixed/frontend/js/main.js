// Frontend JavaScript for handling main page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the hero slider
    initHeroSlider();
    
    // Load featured packages
    loadFeaturedPackages();
    
    // Set up search form
    setupSearchForm();
    
    // Check if user is logged in and update UI
    checkUserLoginStatus();
    
    // Set up testimonial slider
    initTestimonialSlider();
    
    // Set up destination gallery
    initDestinationGallery();
    
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Function to initialize hero slider
function initHeroSlider() {
    const heroSlider = document.querySelector('.hero-slider');
    if (!heroSlider) return;
    
    let currentSlide = 0;
    const slides = heroSlider.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    // Show first slide
    slides[0].classList.add('active');
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    heroSlider.appendChild(dotsContainer);
    
    // Auto slide change
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);
    
    // Function to go to specific slide
    function goToSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Show selected slide
        slides[index].classList.add('active');
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update current slide index
        currentSlide = index;
    }
}

// Function to load featured packages
async function loadFeaturedPackages() {
    try {
        const featuredContainer = document.getElementById('featured-packages');
        if (!featuredContainer) return;
        
        // Show loading state
        featuredContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading featured packages...</div>';
        
        // Get packages from API
        const response = await window.exploreAPI.getPackages();
        
        if (response.success && response.data.length > 0) {
            // Filter featured packages
            const featuredPackages = response.data.filter(pkg => pkg.featured).slice(0, 3);
            
            if (featuredPackages.length > 0) {
                // Clear loading state
                featuredContainer.innerHTML = '';
                
                // Render featured packages
                featuredPackages.forEach(pkg => {
                    const packageCard = createPackageCard(pkg);
                    featuredContainer.appendChild(packageCard);
                });
            } else {
                featuredContainer.innerHTML = '<div class="no-packages">No featured packages found.</div>';
            }
        } else {
            featuredContainer.innerHTML = '<div class="no-packages">No featured packages found.</div>';
        }
    } catch (error) {
        console.error('Error loading featured packages:', error);
        const featuredContainer = document.getElementById('featured-packages');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<div class="error">Failed to load featured packages. Please try again later.</div>';
        }
    }
}

// Function to create a package card element
function createPackageCard(pkg) {
    const card = document.createElement('div');
    card.className = 'package-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', '100');
    
    const discountTag = pkg.discount > 0 ? `<div class="discount-tag">${pkg.discount}% OFF</div>` : '';
    const originalPrice = pkg.discount > 0 ? `<span class="original-price">$${(pkg.price + (pkg.price * pkg.discount / 100)).toLocaleString()}</span>` : '';
    
    card.innerHTML = `
        <div class="package-image">
            <img src="images/destinations/${pkg.image}" alt="${pkg.name}">
            <div class="package-price">
                ${originalPrice}
                <span>$${pkg.price.toLocaleString()}</span>
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
            <a href="pages/package-details.html?id=${pkg._id}" class="btn">View Details</a>
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

// Function to set up search form
function setupSearchForm() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get search parameters
        const destination = document.getElementById('destination').value;
        const travelDate = document.getElementById('travel-date').value;
        const travelers = document.getElementById('travelers').value;
        
        // Redirect to packages page with search parameters
        window.location.href = `pages/packages.html?destination=${encodeURIComponent(destination)}&date=${travelDate}&travelers=${travelers}`;
    });
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
            
            // Update profile button text
            profileBtn.textContent = `Hi, ${user.name.split(' ')[0]}`;
        }
    }
}

// Function to initialize testimonial slider
function initTestimonialSlider() {
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (!testimonialSlider) return;
    
    let currentSlide = 0;
    const slides = testimonialSlider.querySelectorAll('.testimonial');
    const totalSlides = slides.length;
    
    // Show first slide
    slides[0].classList.add('active');
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'slider-dots';
    
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    testimonialSlider.appendChild(dotsContainer);
    
    // Auto slide change
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 4000);
    
    // Function to go to specific slide
    function goToSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        
        // Show selected slide
        slides[index].classList.add('active');
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        // Update current slide index
        currentSlide = index;
    }
}

// Function to initialize destination gallery
function initDestinationGallery() {
    const galleryItems = document.querySelectorAll('.destination-item');
    if (galleryItems.length === 0) return;
    
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('active');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('active');
        });
    });
}
