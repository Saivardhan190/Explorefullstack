const express = require("express");
const router = express.Router();
const { 
  getPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  addReview
} = require("../controllers/packages");

// Import booking controller for nested route
const { createBooking } = require("../controllers/bookings");

const { protect, authorize } = require("../middleware/auth");

// Route for creating a booking for a specific package
router.route("/:packageId/bookings").post(protect, createBooking);

router
  .route("/")
  .get(getPackages)
  .post(protect, authorize("admin"), createPackage);

router
  .route("/:id")
  .get(getPackage)
  .put(protect, authorize("admin"), updatePackage)
  .delete(protect, authorize("admin"), deletePackage);

router
  .route("/:id/reviews")
  .post(protect, addReview);

module.exports = router;

