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

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:id/:token', resetPassword);

// Authenticated user routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.get('/change-history', authMiddleware, getChangeHistory);
router.put('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);

// Admin collection routes
router.post('/', authMiddleware, adminMiddleware, createUser);
router.get('/', authMiddleware, adminMiddleware, getUsers);

// Dynamic ID routes (keep at the bottom)
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateUserStatus);

module.exports = router;