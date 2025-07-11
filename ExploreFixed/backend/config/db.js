const mongoose = require("mongoose");
const inMemoryDB = require("../utils/inMemoryDB");

// Initialize database mode
let dbMode = "offline";

const connectDB = async () => {
  try {
    // First try to connect to MongoDB Atlas
    const mongoURI = process.env.MONGO_URI || "mongodb+srv://exploreuser:explorepassword@explorecluster.mongodb.net/exploreDB?retryWrites=true&w=majority";
    
    // Set connection timeout (e.g., 5 seconds)
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s default
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    dbMode = "online";
    return true;
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    console.log("Falling back to in-memory database");
    dbMode = "offline";
    // No need to initialize anything here, getDB will handle it
    return false;
  }
};

// Get the appropriate database model based on current mode
const getDB = (modelName) => {
  if (dbMode === "online") {
    // Return mongoose model
    // Ensure models are registered with Mongoose if not already
    // This assumes models like User, Package, Booking are defined elsewhere using mongoose.Schema and registered
    try {
      return mongoose.model(modelName);
    } catch (e) {
      // Dynamically require and register if not found (adjust path as needed)
      console.warn(`Model ${modelName} not registered, attempting dynamic registration.`);
      require(`../models/${modelName}`); // Assumes model files are in ../models/
      return mongoose.model(modelName);
    }
  } else {
    // Return in-memory database model object from the imported module
    switch (modelName) {
      case "User":
        return inMemoryDB.Users;
      case "Package":
        return inMemoryDB.Packages;
      case "Booking":
        return inMemoryDB.Bookings;
      default:
        throw new Error(`Unknown model: ${modelName}`);
    }
  }
};

module.exports = {
  connectDB,
  getDB,
  getMode: () => dbMode
};

