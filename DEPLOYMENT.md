# Deployment Guide for Explore Travel Website

This guide will help you deploy the Explore Travel Website to GitHub Pages (frontend) and a backend hosting service.

## Overview

The Explore Travel Website consists of two parts:
- **Frontend**: HTML, CSS, and JavaScript files (deployed to GitHub Pages)
- **Backend**: Node.js/Express API server (needs separate hosting)

## Frontend Deployment (GitHub Pages)

The frontend is automatically deployed to GitHub Pages when you push to the `main` branch.

### Steps:

1. **Enable GitHub Pages** (if not already enabled):
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Source", select "GitHub Actions"

2. **Push to main branch**:
   ```bash
   git push origin main
   ```

3. **Monitor deployment**:
   - Go to the "Actions" tab in your GitHub repository
   - Watch the "Deploy Frontend to GitHub Pages" workflow
   - Once complete, your site will be available at: `https://[username].github.io/[repository-name]/`

4. **Access your site**:
   - Your site will be available at: `https://saivardhan190.github.io/Explorefullstack/`

### Important Notes:
- The `.nojekyll` file prevents GitHub from processing the site with Jekyll
- Only the `ExploreFixed/frontend` directory is deployed to GitHub Pages
- The backend API is not included in the GitHub Pages deployment

## Backend Deployment

The backend needs to be hosted on a separate service. Here are recommended options:

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up** at [Railway](https://railway.app/)
2. **Create a new project** and select "Deploy from GitHub repo"
3. **Connect your repository** and select the backend directory
4. **Add environment variables**:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=your_stripe_secret_key (optional)
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret (optional)
   NODE_ENV=production
   ```
5. **Deploy** - Railway will automatically deploy your backend

### Option 2: Heroku

1. **Install Heroku CLI** and login
2. **Create a new Heroku app**:
   ```bash
   cd ExploreFixed/backend
   heroku create your-app-name
   ```
3. **Set environment variables**:
   ```bash
   heroku config:set MONGO_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set NODE_ENV="production"
   ```
4. **Deploy**:
   ```bash
   git subtree push --prefix ExploreFixed/backend heroku main
   ```

### Option 3: Render

1. **Sign up** at [Render](https://render.com/)
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Configure**:
   - Root Directory: `ExploreFixed/backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Add environment variables** in the Render dashboard
6. **Deploy**

### Option 4: Vercel (Serverless)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```
2. **Navigate to backend directory**:
   ```bash
   cd ExploreFixed/backend
   ```
3. **Deploy**:
   ```bash
   vercel
   ```
4. **Add environment variables** in the Vercel dashboard

## Database Setup

### MongoDB Atlas (Recommended - Free Tier Available)

1. **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create a free cluster**
3. **Create a database user**
4. **Whitelist IP addresses** (or allow access from anywhere for development)
5. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
6. **Update your backend's MONGO_URI** environment variable

## Connecting Frontend to Backend

After deploying your backend, you need to update the frontend configuration:

1. **Edit `ExploreFixed/frontend/js/config.js`**:
   ```javascript
   const CONFIG = {
       API_URL: 'https://your-backend-url.com/api/v1',  // Update this
       DEMO_MODE: false
   };
   ```

2. **Commit and push changes**:
   ```bash
   git add ExploreFixed/frontend/js/config.js
   git commit -m "Update API URL for production"
   git push origin main
   ```

3. **Wait for GitHub Actions** to redeploy your frontend

## Testing Your Deployment

1. **Visit your GitHub Pages URL**: `https://saivardhan190.github.io/Explorefullstack/`
2. **Test the features**:
   - Browse packages
   - Try to sign up/login (requires backend to be deployed)
   - Check that images and styles load correctly
3. **Check browser console** for any errors

## Troubleshooting

### Frontend not loading correctly
- Check that GitHub Pages is enabled in repository settings
- Verify the workflow completed successfully in the Actions tab
- Clear browser cache and try again

### API requests failing
- Verify your backend is deployed and running
- Check that the API_URL in `config.js` is correct
- Ensure CORS is enabled on your backend (it is by default)
- Check backend logs for errors

### Images not displaying
- Ensure all image paths are relative (not absolute)
- Check that images exist in the `frontend/images` directory
- Verify the images were included in the GitHub Pages deployment

### Backend not starting
- Check that all environment variables are set correctly
- Verify MongoDB connection string is correct
- Check backend logs for specific error messages
- If MongoDB connection fails, the backend will use in-memory database (limited functionality)

## Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Port for backend server | `5000` |
| `NODE_ENV` | No | Environment mode | `production` |
| `MONGO_URI` | No* | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRE` | No | JWT token expiration | `30d` |
| `STRIPE_SECRET_KEY` | No** | Stripe API secret key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | No** | Stripe webhook secret | `whsec_...` |

\* Not required if using in-memory database (limited functionality)
\** Only required if using payment features

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use strong secrets** for JWT_SECRET and other sensitive values
3. **Enable HTTPS** on your backend hosting service
4. **Whitelist specific IP addresses** in MongoDB Atlas for production
5. **Keep dependencies updated** to patch security vulnerabilities

## Support

For issues or questions:
- Check the main README.md for project documentation
- Review backend logs for error messages
- Verify all environment variables are set correctly
- Ensure database connection is working

## Quick Start for Local Development

1. **Backend**:
   ```bash
   cd ExploreFixed/backend
   npm install
   npm run dev
   ```

2. **Frontend**:
   - Open `ExploreFixed/frontend/index.html` in your browser
   - Or use a local server: `npx http-server ExploreFixed/frontend -p 8080`

3. **Database**:
   - Backend will use in-memory database if MongoDB is not configured
   - Set MONGO_URI in `.env` file to use MongoDB

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Railway Documentation](https://docs.railway.app/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
