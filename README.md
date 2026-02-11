# Explore Travel Website

A full-stack travel booking platform built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

## 🌐 Live Demo

Visit the live site: [https://saivardhan190.github.io/Explorefullstack/](https://saivardhan190.github.io/Explorefullstack/)

## 📋 Project Status

✅ **All systems operational!**

- ✅ Backend server runs without errors
- ✅ All JavaScript files validated
- ✅ Frontend assets verified (CSS, JS, images, HTML)
- ✅ GitHub Pages deployment configured
- ✅ MongoDB connection with fallback to in-memory database
- ✅ API configuration setup for easy deployment

## 🚀 Quick Start

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Saivardhan190/Explorefullstack.git
   cd Explorefullstack/ExploreFixed
   ```

2. **Start the Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will run on `http://localhost:5000` and automatically fall back to in-memory database if MongoDB is not configured.

3. **Open the Frontend**:
   ```bash
   cd ../frontend
   # Open index.html in your browser, or use a local server:
   npx http-server -p 8080
   ```
   Access the site at `http://localhost:8080`

## 📦 What's Inside

### Frontend (`/ExploreFixed/frontend`)
- **HTML/CSS/JavaScript** - Responsive travel website
- **Pages**: Home, About, Packages, Gallery, Contact, Login/Signup, Admin Panel, User Profile
- **Features**: Package browsing, booking system, user authentication, payment integration

### Backend (`/ExploreFixed/backend`)
- **Node.js/Express** - RESTful API server
- **MongoDB** - Database with in-memory fallback
- **Features**: User authentication (JWT), package management, booking system, payment processing (Stripe)

## 🌍 Deployment

### Quick Deploy

The frontend is automatically deployed to GitHub Pages when you push to the `main` branch.

For detailed deployment instructions including backend deployment options (Railway, Heroku, Render), see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

### Deployment Checklist

- [x] Frontend configured for GitHub Pages
- [x] GitHub Actions workflow created
- [x] API configuration setup (`js/config.js`)
- [ ] Backend deployed (see DEPLOYMENT.md for options)
- [ ] MongoDB Atlas setup (optional - uses in-memory DB otherwise)
- [ ] API URL updated in config.js

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[ExploreFixed/README.md](ExploreFixed/README.md)** - Detailed project documentation

## 🔧 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Font Awesome
- **Backend**: Node.js, Express.js v5, Mongoose
- **Database**: MongoDB (with in-memory fallback)
- **Authentication**: JWT
- **Payments**: Stripe API
- **Deployment**: GitHub Pages (frontend), Railway/Heroku/Render (backend)

## ✨ Features

- 🔐 Secure user authentication
- 📦 Browse and filter travel packages
- 📅 Book trips with date selection
- 💳 Secure payment processing
- 👤 User profile and booking history
- 👨‍💼 Admin panel for managing packages and bookings
- 📱 Fully responsive design

## 🛠️ Project Structure

```
Explorefullstack/
├── .github/
│   └── workflows/
│       └── deploy-frontend.yml    # GitHub Pages deployment
├── ExploreFixed/
│   ├── frontend/                  # Static website files
│   │   ├── css/                   # Stylesheets
│   │   ├── js/                    # JavaScript files
│   │   │   ├── config.js          # API configuration
│   │   │   └── api.js             # API utilities
│   │   ├── images/                # Assets
│   │   ├── pages/                 # HTML pages
│   │   ├── index.html             # Main entry point
│   │   └── .nojekyll              # Disable Jekyll processing
│   └── backend/                   # Node.js backend
│       ├── config/                # Database configuration
│       ├── controllers/           # Route controllers
│       ├── middleware/            # Custom middleware
│       ├── models/                # MongoDB models
│       ├── routes/                # API routes
│       ├── utils/                 # Utility functions
│       └── server.js              # Server entry point
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                      # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts (Poppins) for typography
- MongoDB Atlas for database hosting
- GitHub Pages for frontend hosting

---

Made with ❤️ by Saivardhan190