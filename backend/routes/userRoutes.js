const express = require('express');
const router = express.Router();
const { login, createUser, getUsers, getUserById, updateUser, deleteUser, updateUserStatus, getProfile, updateProfile, changePassword, logout, forgotPassword, resetPassword} = require('../controllers/userController');
const authMiddleware =  require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:id/:token', resetPassword);

router.post('/', authMiddleware, adminMiddleware, createUser);
router.get('/', authMiddleware, adminMiddleware, getUsers);

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, changePassword);
router.post('/logout', authMiddleware, logout);

router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/:id', authMiddleware, adminMiddleware, updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.patch('/:id/status', authMiddleware, adminMiddleware, updateUserStatus);

module.exports = router;