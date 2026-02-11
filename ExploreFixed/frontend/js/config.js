// Configuration for the Explore Travel Website
// Update this file with your backend API URL for deployment

// For local development, use: http://localhost:5000/api/v1
// For production, update this to your deployed backend URL
// Example: https://your-backend.herokuapp.com/api/v1
const CONFIG = {
    // You can deploy the backend to services like:
    // - Heroku: https://www.heroku.com/
    // - Railway: https://railway.app/
    // - Render: https://render.com/
    // - AWS, Google Cloud, Azure, etc.
    API_URL: 'http://localhost:5000/api/v1',
    
    // If backend is not available, the app will use demo mode with mock data
    DEMO_MODE: false
};

// Export configuration
window.CONFIG = CONFIG;
