// Enhanced in-memory database implementation for Explore Travel Website
// This module provides a simple in-memory database solution when MongoDB is unavailable

// In-memory storage
const db = {
  users: [],
  packages: [
    {
      _id: 'pkg1',
      name: 'Bali Paradise Package',
      description: 'Experience the magic of Bali with our exclusive Paradise Package. This 7-day adventure takes you through the island\'s most breathtaking landscapes, from pristine beaches to lush rice terraces and ancient temples. Immerse yourself in the rich Balinese culture, indulge in delicious local cuisine, and unwind in luxurious accommodations.',
      location: 'Bali, Indonesia',
      duration: '7 Days / 6 Nights',
      price: 1299,
      discount: 10,
      image: 'bali.jpg',
      featured: true,
      rating: 4.8,
      reviews: [
        {
          user: 'user1',
          name: 'Sarah Johnson',
          rating: 5,
          text: 'This was the trip of a lifetime! Our guide was incredibly knowledgeable and the itinerary was perfectly balanced between activities and relaxation.',
          createdAt: '2025-04-15'
        },
        {
          user: 'user2',
          name: 'Michael Chen',
          rating: 5,
          text: 'Excellent service from start to finish. The cooking class in Ubud was a highlight for me - I learned so much about Balinese cuisine.',
          createdAt: '2025-03-22'
        }
      ],
      inclusions: [
        '6 nights accommodation in 4-5 star hotels',
        'Daily breakfast, 4 lunches, 3 dinners',
        'Airport transfers and tour transportation',
        'English-speaking local guide',
        'Entrance fees to all attractions in itinerary'
      ],
      exclusions: [
        'International airfare',
        'Travel insurance',
        'Visa fees (if applicable)',
        'Meals not mentioned in the itinerary',
        'Personal expenses'
      ]
    },
    {
      _id: 'pkg2',
      name: 'Santorini Luxury Escape',
      description: 'Indulge in the ultimate Greek island experience with our Santorini Luxury Escape. Stay in exclusive cliff-top accommodations with breathtaking views of the Aegean Sea. Explore charming white-washed villages, visit ancient ruins, enjoy wine tasting at local vineyards, and witness the world-famous sunset from Oia. This package offers the perfect blend of relaxation, culture, and luxury.',
      location: 'Santorini, Greece',
      duration: '5 Days / 4 Nights',
      price: 2099,
      discount: 0,
      image: 'santorini.jpg',
      featured: true,
      rating: 4.9,
      reviews: [
        {
          user: 'user3',
          name: 'Emma Wilson',
          rating: 5,
          text: 'Absolutely magical! The views from our hotel were incredible, and the private sunset cruise was unforgettable. Worth every penny!',
          createdAt: '2025-05-02'
        }
      ],
      inclusions: [
        '4 nights in luxury cliff-top hotel with caldera view',
        'Daily breakfast and welcome dinner',
        'Private airport transfers',
        'Guided tour of Akrotiri archaeological site',
        'Wine tasting experience at 3 traditional wineries',
        'Sunset sailing cruise with dinner'
      ],
      exclusions: [
        'International and domestic flights',
        'Travel insurance',
        'Additional meals and beverages',
        'Optional activities not in the itinerary',
        'Gratuities'
      ]
    },
    {
      _id: 'pkg3',
      name: 'Paris Romantic Getaway',
      description: 'Fall in love with the City of Light on our Paris Romantic Getaway. This carefully crafted experience includes accommodations in a boutique hotel in the heart of Paris, skip-the-line access to iconic landmarks like the Eiffel Tower and Louvre Museum, a romantic Seine River dinner cruise, and a day trip to the Palace of Versailles. Perfect for couples celebrating anniversaries, honeymoons, or simply wanting to experience the romance of Paris.',
      location: 'Paris, France',
      duration: '4 Days / 3 Nights',
      price: 1899,
      discount: 5,
      image: 'paris.jpg',
      featured: false,
      rating: 4.7,
      reviews: [
        {
          user: 'user4',
          name: 'James and Lisa Brown',
          rating: 5,
          text: 'We celebrated our 10th anniversary in Paris with this package and it exceeded all expectations. The private tour of Montmartre was particularly special.',
          createdAt: '2025-02-14'
        },
        {
          user: 'user5',
          name: 'Alexandra Martinez',
          rating: 4,
          text: 'Beautiful experience overall. The hotel was charming and centrally located. Only wish we had more free time to explore on our own.',
          createdAt: '2025-03-30'
        }
      ],
      inclusions: [
        '3 nights in a 4-star boutique hotel',
        'Daily breakfast and one dinner at a Michelin-starred restaurant',
        'Skip-the-line tickets to Eiffel Tower and Louvre Museum',
        'Seine River dinner cruise',
        'Guided day trip to Palace of Versailles',
        'Paris Museum Pass'
      ],
      exclusions: [
        'Flights to/from Paris',
        'Airport transfers',
        'Travel insurance',
        'Meals not specified in the itinerary',
        'Personal expenses and souvenirs'
      ]
    },
    {
      _id: 'pkg4',
      name: 'Tokyo Explorer Package',
      description: 'Discover the fascinating blend of ancient traditions and futuristic innovations in Japan\'s capital with our Tokyo Explorer Package. Experience the city\'s iconic landmarks, from historic temples to modern skyscrapers, sample authentic Japanese cuisine, and immerse yourself in the unique culture. This comprehensive package includes guided tours, cultural experiences, and free time to explore this dynamic metropolis at your own pace.',
      location: 'Tokyo, Japan',
      duration: '6 Days / 5 Nights',
      price: 2299,
      discount: 0,
      image: 'tokyo.jpg',
      featured: false,
      rating: 4.6,
      reviews: [
        {
          user: 'user6',
          name: 'David Thompson',
          rating: 5,
          text: 'An incredible introduction to Tokyo! The guide was knowledgeable and helped us navigate the city with ease. The robot restaurant show was mind-blowing!',
          createdAt: '2025-04-18'
        }
      ],
      inclusions: [
        '5 nights accommodation in central Tokyo hotel',
        'Daily breakfast and 2 authentic Japanese dinners',
        'PASMO card with initial balance for public transportation',
        'Guided tour of Meiji Shrine, Harajuku, and Shibuya',
        'Day trip to Mt. Fuji and Hakone (seasonal)',
        'Traditional tea ceremony experience',
        'Robot Restaurant show tickets'
      ],
      exclusions: [
        'International flights',
        'Airport transfers',
        'Travel insurance',
        'Additional meals and activities',
        'PASMO card refill if initial balance is used'
      ]
    },
    {
      _id: 'pkg5',
      name: 'Swiss Alps Adventure',
      description: 'Experience the majestic beauty of the Swiss Alps with our comprehensive adventure package. Stay in charming mountain villages, ride scenic trains through breathtaking landscapes, hike along picturesque trails, and enjoy authentic Swiss cuisine. This package combines outdoor activities, cultural experiences, and relaxation in one of the world\'s most stunning mountain regions.',
      location: 'Swiss Alps, Switzerland',
      duration: '8 Days / 7 Nights',
      price: 2799,
      discount: 8,
      image: 'swiss_alps.jpg',
      featured: true,
      rating: 4.8,
      reviews: [
        {
          user: 'user7',
          name: 'Robert Anderson',
          rating: 5,
          text: 'The Swiss Alps are even more beautiful than in pictures, and this tour showed us the best of everything. The Glacier Express was a highlight!',
          createdAt: '2025-01-20'
        },
        {
          user: 'user8',
          name: 'Jennifer Lee',
          rating: 4,
          text: 'Great mix of activities and free time. The accommodations were charming and the guides were excellent. Highly recommend for nature lovers.',
          createdAt: '2025-02-05'
        }
      ],
      inclusions: [
        '7 nights in traditional Swiss hotels',
        'Daily breakfast and 4 dinners',
        'Swiss Travel Pass for unlimited train, bus, and boat travel',
        'Glacier Express panoramic train journey',
        'Guided hiking excursion (moderate difficulty)',
        'Cable car ride to Schilthorn or Mt. Titlis',
        'Chocolate and cheese tasting experience'
      ],
      exclusions: [
        'International flights to/from Switzerland',
        'Travel insurance',
        'Meals not mentioned in the itinerary',
        'Optional activities and excursions',
        'Personal expenses'
      ]
    },
    {
      _id: 'pkg6',
      name: 'Dubai Luxury & Desert Experience',
      description: 'Immerse yourself in the opulence of Dubai and the magic of the Arabian desert. This package combines the ultra-modern city experience with traditional desert adventures. Stay in a luxury hotel, visit iconic landmarks like Burj Khalifa and Palm Jumeirah, enjoy a desert safari with traditional entertainment, and experience the vibrant souks and cultural attractions. Perfect for travelers seeking a blend of luxury, culture, and adventure.',
      location: 'Dubai, UAE',
      duration: '5 Days / 4 Nights',
      price: 1999,
      discount: 0,
      image: 'dubai.jpg',
      featured: false,
      rating: 4.7,
      reviews: [
        {
          user: 'user9',
          name: 'Thomas Wright',
          rating: 5,
          text: 'Dubai exceeded all expectations! The contrast between the ultra-modern city and traditional desert experience was fascinating. The hotel was absolutely luxurious.',
          createdAt: '2025-03-15'
        }
      ],
      inclusions: [
        '4 nights in 5-star luxury hotel',
        'Daily breakfast and 2 dinners',
        'Private airport transfers',
        'City tour including Burj Khalifa "At the Top" experience',
        'Desert safari with BBQ dinner and entertainment',
        'Dhow cruise dinner in Dubai Marina',
        'Half-day shopping tour with guide'
      ],
      exclusions: [
        'International flights',
        'UAE tourist visa fees',
        'Travel insurance',
        'Meals not specified in the itinerary',
        'Optional activities and personal expenses',
        'Tourism fee (paid directly to hotel)'
      ]
    }
  ],
  bookings: [],
  payments: []
};

// Initialize with default admin user
db.users.push({
  _id: 'admin123',
  name: 'Admin User',
  email: 'admin@explore.com',
  password: '$2a$10$eCJgOIV/3EA2Yd3uNxdCz.YJsru/QkCtXlGqxHaOQnAfQFvZ3GeJG', // hashed 'password123'
  role: 'admin',
  createdAt: new Date().toISOString()
});

// Get database reference
const getDB = () => db;

// --- Mongoose-like methods for in-memory DB --- 

// Generic find method
const find = (collection) => {
  return db[collection];
};

// Generic findById method
const findById = (collection, id) => {
  return db[collection].find(item => item._id === id);
};

// Generic create method
const create = (collection, data) => {
  const newItem = {
    _id: `${collection.slice(0, -1)}${db[collection].length + 1}`,
    ...data,
    createdAt: new Date().toISOString()
  };
  db[collection].push(newItem);
  return newItem;
};

// Generic findByIdAndUpdate method
const findByIdAndUpdate = (collection, id, data) => {
  const index = db[collection].findIndex(item => item._id === id);
  if (index === -1) return null;
  
  // Simulate Mongoose update behavior (merge and return updated)
  db[collection][index] = { ...db[collection][index], ...data };
  return db[collection][index];
};

// Generic findByIdAndDelete method
const findByIdAndDelete = (collection, id) => {
  const index = db[collection].findIndex(item => item._id === id);
  if (index === -1) return null;
  
  const deletedItem = db[collection].splice(index, 1)[0];
  return deletedItem;
};

// Generic countDocuments method
const countDocuments = (collection) => {
  return db[collection].length;
};

// --- Specific Model Methods --- 

// User Model
const Users = {
  find: () => find('users'),
  findById: (id) => findById('users', id),
  findOne: (query) => {
    // Simple findOne implementation for in-memory DB
    if (query.email) {
      return db.users.find(user => user.email === query.email);
    }
    if (query._id) {
      return db.users.find(user => user._id === query._id);
    }
    if (query.resetPasswordToken) {
      return db.users.find(user => user.resetPasswordToken === query.resetPasswordToken);
    }
    return db.users[0]; // Return first user as fallback
  },
  create: async (data) => {
    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(data.email)) {
      throw { name: 'ValidationError', errors: { email: { message: 'Please add a valid email' } } };
    }
    
    // Check for duplicate email
    const existingUser = db.users.find(user => user.email === data.email);
    if (existingUser) {
      throw { code: 11000 }; // Mongoose duplicate key error code
    }
    
    // Hash password before creating user
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const newItem = {
      _id: `user${db.users.length + 1}`,
      ...data,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    db.users.push(newItem);
    
    // Return user without password (simulate select: false)
    const { password, ...userWithoutPassword } = newItem;
    return {
      ...userWithoutPassword,
      _doc: userWithoutPassword
    };
  },
  findByIdAndUpdate: (id, data) => findByIdAndUpdate('users', id, data),
  findByIdAndDelete: (id) => findByIdAndDelete('users', id),
  countDocuments: () => countDocuments('users'),
  findByEmail: (email) => db.users.find(user => user.email === email) // Specific method
};

// Package Model
const Packages = {
  find: () => find('packages'),
  findById: (id) => findById('packages', id),
  create: (data) => create('packages', data),
  findByIdAndUpdate: (id, data) => findByIdAndUpdate('packages', id, data),
  findByIdAndDelete: (id) => findByIdAndDelete('packages', id),
  countDocuments: () => countDocuments('packages'),
  insertMany: (packagesData) => { // Specific method for sample data
    packagesData.forEach(pkg => {
      if (!findById('packages', pkg._id)) { // Avoid duplicates if run multiple times
        db.packages.push({ ...pkg, createdAt: new Date().toISOString() });
      }
    });
    return packagesData;
  }
};

// Booking Model
const Bookings = {
  find: () => find('bookings'),
  findById: (id) => findById('bookings', id),
  create: (data) => create('bookings', data),
  findByIdAndUpdate: (id, data) => findByIdAndUpdate('bookings', id, data),
  findByIdAndDelete: (id) => findByIdAndDelete('bookings', id),
  countDocuments: () => countDocuments('bookings'),
  findByUserId: (userId) => db.bookings.filter(booking => booking.user === userId) // Specific method
};

module.exports = {
  getDB, // Export the raw DB object if needed
  Users, // Export the Mongoose-like model object
  Packages,
  Bookings
};

