const express = require('express');
const router = express.Router();
const authController = require('./../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authMiddleware.protect, authController.logout);

router.get('/users', authMiddleware.protect, authController.getAllUsers);
router.put('/users/:id', authMiddleware.protect, authController.updateUser);
router.delete('/users/:id', authMiddleware.protect, authController.deleteUser);

module.exports = router;