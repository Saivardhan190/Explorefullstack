// Frontend JavaScript for handling login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                
                // Show loading state
                document.getElementById('login-btn').textContent = 'Logging in...';
                document.getElementById('login-btn').disabled = true;
                
                // Call the login API
                const response = await window.exploreAPI.login(email, password);
                
                if (response.success) {
                    // Save token to localStorage
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    throw new Error(response.error || 'Login failed');
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = error.message || 'Invalid email or password';
                errorMessage.style.display = 'block';
                
                // Reset button state
                document.getElementById('login-btn').textContent = 'Login';
                document.getElementById('login-btn').disabled = false;
            }
        });
    }
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Update UI for logged-in user
        updateUserMenuForLoggedInUser();
    }
});

// Function to update user menu for logged-in users
function updateUserMenuForLoggedInUser() {
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
