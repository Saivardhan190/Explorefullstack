const { getDB } = require("../config/db"); // Use getDB to get the correct model

// Get the appropriate Package model based on current database mode
const getPackageModel = () => getDB("Package");

// @desc    Get all packages
// @route   GET /api/v1/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    // Add sample packages if none exist (only for in-memory)
    if (require("../config/db").getMode() === "offline") {
      const count = await getPackageModel().countDocuments();
      if (count === 0) {
        await createSamplePackages(); // Use helper function below
      }
    }
    
    // Use find method
    const packages = await getPackageModel().find();

    res.status(200).json({
      success: true,
      count: packages.length,
      data: packages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Get single package
// @route   GET /api/v1/packages/:id
// @access  Public
exports.getPackage = async (req, res, next) => {
  try {
    // Use findById method
    const pkg = await getPackageModel().findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: `Package not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: pkg
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Create new package
// @route   POST /api/v1/packages
// @access  Private/Admin
exports.createPackage = async (req, res, next) => {
  try {
    // Use create method
    const pkg = await getPackageModel().create(req.body);

    res.status(201).json({
      success: true,
      data: pkg
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Update package
// @route   PUT /api/v1/packages/:id
// @access  Private/Admin
exports.updatePackage = async (req, res, next) => {
  try {
    // Use findByIdAndUpdate method
    const pkg = await getPackageModel().findByIdAndUpdate(req.params.id, req.body);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: `Package not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: pkg // Return the updated package
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// @desc    Delete package
// @route   DELETE /api/v1/packages/:id
// @access  Private/Admin
exports.deletePackage = async (req, res, next) => {
  try {
    // Use findByIdAndDelete method
    const pkg = await getPackageModel().findByIdAndDelete(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: `Package not found with id of ${req.params.id}`
      });
    }

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

// @desc    Add review to package
// @route   POST /api/v1/packages/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    // Use findById method
    const pkg = await getPackageModel().findById(req.params.id);

    if (!pkg) {
      return res.status(404).json({
        success: false,
        error: `Package not found with id of ${req.params.id}`
      });
    }

    // Add user info to req.body
    req.body.user = req.user.id;
    req.body.name = req.user.name;

    // Check if user already reviewed this package
    // Ensure pkg.reviews exists before checking
    if (pkg.reviews && pkg.reviews.some(review => review.user.toString() === req.user.id)) {
      return res.status(400).json({
        success: false,
        error: "You have already reviewed this package"
      });
    }

    // Prepare review data
    const newReview = {
      ...req.body,
      createdAt: new Date().toISOString()
    };

    // Add review
    const updatedReviews = pkg.reviews ? [...pkg.reviews, newReview] : [newReview];

    // Calculate average rating
    const totalRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    // Update package with new review and rating using findByIdAndUpdate
    const updatedPkg = await getPackageModel().findByIdAndUpdate(req.params.id, {
      reviews: updatedReviews,
      rating: averageRating
    });

    res.status(201).json({
      success: true,
      data: updatedPkg // Return the updated package
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};

// Helper function to create sample packages if none exist (for in-memory DB)
async function createSamplePackages() {
  const samplePackages = [
    {
      _id: "pkg1",
      name: "Bali Paradise Package",
      description: "Experience the magic of Bali...",
      location: "Bali, Indonesia",
      duration: "7 Days / 6 Nights",
      price: 1299,
      discount: 10,
      image: "bali.jpg",
      featured: true,
      rating: 4.8,
      reviews: [],
      inclusions: ["6 nights accommodation..."],
      exclusions: ["International airfare..."]
    },
     {
      _id: "pkg2",
      name: "Santorini Luxury Escape",
      description: "Indulge in the ultimate Greek island experience...",
      location: "Santorini, Greece",
      duration: "5 Days / 4 Nights",
      price: 2099,
      discount: 0,
      image: "santorini.jpg",
      featured: true,
      rating: 4.9,
      reviews: [],
      inclusions: ["4 nights in luxury cliff-top hotel..."],
      exclusions: ["International and domestic flights..."]
    },
    // Add other sample packages here if needed...
  ];

  // Use the insertMany method provided by the in-memory model
  await getPackageModel().insertMany(samplePackages);
  console.log("Sample packages created for in-memory DB");
}

