const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('./../utils/appError');

const sendAuthResponse = (res, statusCode, accessToken, refreshToken, user) => {
  res.status(statusCode).json({
    status: 'success',
    tokens: { accessToken, refreshToken },
    data: { user }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const userData = {
      username,
      email,
      password,
      role: req.body.role || 'user' 
    };

    const user = await User.create(userData);
    const { accessToken, refreshToken } = user.generateAuthTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendAuthResponse(res, 201, accessToken, refreshToken, user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email et mot de passe requis" });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const { accessToken, refreshToken } = user.generateAuthTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendAuthResponse(res, 200, accessToken, refreshToken, user);
  } catch (err) {
    next(err);
  }
};

// Ajoute ces exports vides pour éviter que les routes ne plantent sur les autres fonctions
exports.refreshToken = async (req, res) => res.status(200).json({});
exports.logout = async (req, res) => res.status(200).json({});
exports.getAllUsers = async (req, res) => res.status(200).json([]);