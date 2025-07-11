const express = require('express');
const router = express.Router();
const { 
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:userId/bookings', require('./bookings'));

router
  .route('/')
  .get(protect, authorize('admin'), getUsers);

router
  .route('/:id')
  .get(protect, authorize('admin'), getUser)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
