const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a package name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  duration: {
    type: String,
    required: [true, 'Please add duration']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  discount: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'bali.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 4.5
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  inclusions: [String],
  exclusions: [String],
  itinerary: [
    {
      day: {
        type: Number,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      activities: [String]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create Package slug from the name
PackageSchema.pre('save', function(next) {
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-');
  next();
});

module.exports = mongoose.model('Package', PackageSchema);
