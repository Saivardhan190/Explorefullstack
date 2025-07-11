# Explore Travel Website

A full-stack travel website built with HTML, CSS, JavaScript, Node.js, Express.js, and MongoDB.

## Overview

Explore is a comprehensive travel booking platform that allows users to browse travel packages, create accounts, book trips, and make secure payments. The application includes a user-friendly frontend and a robust backend with admin capabilities for managing packages, users, and bookings.

## Features

- **User Authentication**: Secure login and signup with JWT authentication
- **Package Browsing**: View and filter travel packages by destination, price, and category
- **Booking System**: Select travel dates, number of travelers, and book packages
- **Payment Processing**: Secure payment integration with Stripe
- **User Profiles**: View booking history and manage personal information
- **Admin Panel**: Manage packages, users, and bookings
- **Responsive Design**: Optimized for all device sizes

## Project Structure

```
Explore/
├── frontend/               # Frontend files
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   ├── images/             # Images and assets
│   ├── pages/              # HTML pages
│   └── index.html          # Main entry point
│
├── backend/                # Backend files
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   ├── package.json        # Dependencies
│   └── server.js           # Server entry point
│
└── README.md               # Project documentation
```

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Responsive Design

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Stripe Payment API

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Stripe account for payment processing

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/exploreDB
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend Setup
1. The frontend is built with vanilla HTML, CSS, and JavaScript, so no installation is required.
2. Open `frontend/index.html` in your browser to view the application.
3. For production, you can serve the frontend files using a static file server.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password

### Packages
- `GET /api/v1/packages` - Get all packages
- `GET /api/v1/packages/:id` - Get single package
- `POST /api/v1/packages` - Create new package (admin)
- `PUT /api/v1/packages/:id` - Update package (admin)
- `DELETE /api/v1/packages/:id` - Delete package (admin)
- `POST /api/v1/packages/:id/reviews` - Add review to package

### Bookings
- `GET /api/v1/bookings` - Get all bookings (admin)
- `GET /api/v1/users/:userId/bookings` - Get user bookings
- `GET /api/v1/bookings/:id` - Get single booking
- `POST /api/v1/packages/:packageId/bookings` - Create booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Delete booking
- `PUT /api/v1/bookings/:id/status` - Update booking status (admin)

### Payments
- `POST /api/v1/payments/process` - Process payment
- `GET /api/v1/payments/:paymentId` - Get payment status
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/webhook` - Handle Stripe webhook

## User Roles and Permissions

### Regular User
- Browse packages
- Create and manage account
- Book packages
- Make payments
- View booking history
- Write reviews

### Admin
- All regular user permissions
- Manage packages (create, update, delete)
- Manage users
- Manage bookings
- View dashboard statistics

## Deployment

### Backend
1. Set up a MongoDB database (local or cloud service like MongoDB Atlas)
2. Deploy the Node.js application to a hosting service (Heroku, AWS, etc.)
3. Set the required environment variables on your hosting platform

### Frontend
1. Deploy the static files to a web hosting service (Netlify, Vercel, etc.)
2. Update API endpoints in the frontend to point to your deployed backend

## Future Enhancements
- Email notifications for booking confirmations
- Social media authentication
- Advanced search and filtering options
- Multi-language support
- Wishlist functionality
- Loyalty program

## License
This project is licensed under the MIT License.
