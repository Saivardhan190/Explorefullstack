// Frontend JavaScript for handling signup functionality
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const errorMessage = document.getElementById('error-message');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            try {
                errorMessage.textContent = '';
                errorMessage.style.display = 'none';
                
                // Validate passwords match
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                
                // Show loading state
                document.getElementById('signup-btn').textContent = 'Signing up...';
                document.getElementById('signup-btn').disabled = true;
                
                // Call the register API
                const response = await window.exploreAPI.register(name, email, password);
                
                if (response.success) {
                    // Save token to localStorage
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.data));
                    
                    // Redirect to home page or dashboard
                    window.location.href = '../index.html';
                } else {
                    throw new Error(response.error || 'Registration failed');
                }
            } catch (error) {
                console.error('Signup error:', error);
                errorMessage.textContent = error.message || 'Registration failed. Please try again.';
                errorMessage.style.display = 'block';
                
                // Reset button state
                document.getElementById('signup-btn').textContent = 'Sign Up';
                document.getElementById('signup-btn').disabled = false;
            }
        });
    }
});
