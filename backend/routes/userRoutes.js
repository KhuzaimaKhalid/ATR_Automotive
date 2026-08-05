const express = require('express');
const router = express.Router();
const { 
  login, 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  updateUserStatus, 
  getProfile, 
  updateProfile, 
  changePassword, 
  logout, 
  forgotPassword, 
  resetPassword, 
  getChangeHistory 
} = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// 1. PUBLIC ROUTES
router.post('/login', login);

// POST route handles form submission
router.post('/forgot-password', forgotPassword);
// Catch GET requests so they don't fall through to /:id
router.get('/forgot-password', (req, res) => {
  res.status(405).json({ status: "failed", message: "Method Not Allowed. Use POST." });
});

router.put('/reset-password/:id/:token', resetPassword);

// 2. AUTHENTICATED USER ROUTES
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/change-history', authMiddleware, getChangeHistory);
router.put('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);

// 3. ADMIN ROUTES
router.post('/', authMiddleware, adminMiddleware, createUser);
router.get('/', authMiddleware, adminMiddleware, getUsers);

// 4. DYNAMIC ID ROUTES (MUST BE AT THE BOTTOM)
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateUserStatus);

module.exports = router;