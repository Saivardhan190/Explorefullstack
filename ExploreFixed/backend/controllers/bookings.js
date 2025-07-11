const { getDB } = require("../config/db"); // Use getDB to get the correct model

// Get the appropriate Booking and Package models based on current database mode
const getBookingModel = () => getDB("Booking");
const getPackageModel = () => getDB("Package");

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @route   GET /api/v1/users/:userId/bookings
// @access  Private/Admin
exports.getBookings = async (req, res, next) => {
  try {
    let bookings;

    // If userId is provided, get bookings for that user
    if (req.params.userId) {
      // For regular users, only allow them to see their own bookings
      if (req.user.role !== "admin" && req.params.userId !== req.user.id) {
        return res.status(401).json({
          success: false,
          error: "Not authorized to access other users\" bookings"
        });
      }
      
      // Use findByUserId method from inMemoryDB or Mongoose
      bookings = await getBookingModel().findByUserId(req.params.userId);
    } else {
      // Only admins can see all bookings
      if (req.user.role !== "admin") {
        return res.status(401).json({
          success: false,
          error: "Not authorized to access all bookings"
        });
      }
      
      // Use find method
      bookings = await getBookingModel().find();
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    // Use findById method
    const booking = await getBookingModel().findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`
      });
    }

    // Make sure user is booking owner or admin
    // Ensure booking.user comparison works for both Mongoose ObjectId and string ID
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this booking"
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Create booking
// @route   POST /api/v1/packages/:packageId/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    // Add user and package to req.body
    req.body.user = req.user._id;
    req.body.package = req.params.packageId;

    // Check if package exists using getDB
    const pkg = await getPackageModel().findById(req.params.packageId);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: `Package not found with id of ${req.params.packageId}`
      });
    }

    // Calculate total price
    const adults = req.body.adults || 1;
    const children = req.body.children || 0;
    const basePrice = pkg.price;
    const discount = pkg.discount || 0;
    
    // Simple price calculation (can be made more complex as needed)
    const totalPrice = (basePrice * adults + basePrice * 0.5 * children) * (1 - discount / 100);
    
    // Add total price to req.body
    req.body.totalPrice = totalPrice;

    // Use create method
    const booking = await getBookingModel().create(req.body);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
  try {
    // Use findById method
    let booking = await getBookingModel().findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this booking"
      });
    }

    // Don't allow changing user or package
    delete req.body.user;
    delete req.body.package;

    // Don't allow users to change status or payment status (only admins)
    if (req.user.role !== "admin") {
      delete req.body.status;
      delete req.body.paymentStatus;
    }

    // Use findByIdAndUpdate method
    const updatedBooking = await getBookingModel().findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: updatedBooking // Return the updated booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
  try {
    // Use findById method
    const booking = await getBookingModel().findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`
      });
    }

    // Make sure user is booking owner or admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this booking"
      });
    }

    // Use findByIdAndDelete method
    await getBookingModel().findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/v1/bookings/:id/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: "Please provide a status"
      });
    }

    // Use findById method
    let booking = await getBookingModel().findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: `Booking not found with id of ${req.params.id}`
      });
    }

    // Only admins can update booking status
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update booking status"
      });
    }

    // Use findByIdAndUpdate method
    const updatedBooking = await getBookingModel().findByIdAndUpdate(
      req.params.id,
      { status }
    );

    res.status(200).json({
      success: true,
      data: updatedBooking // Return the updated booking
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

