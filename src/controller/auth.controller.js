const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

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
    if (!username || !email || !password) return res.status(400).json({ message: "Champs requis" });
    const userData = { username, email, password, role: req.body.role || 'user' };
    const user = await User.create(userData);
    const { accessToken, refreshToken } = user.generateAuthTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    sendAuthResponse(res, 201, accessToken, refreshToken, user);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email/password requis" });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }
    const { accessToken, refreshToken } = user.generateAuthTokens();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    sendAuthResponse(res, 200, accessToken, refreshToken, user);
  } catch (err) { next(err); }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password -refreshToken -passwordResetToken -passwordResetExpires');
    res.status(200).json(users);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json({ message: "Supprimé avec succès" });
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res) => res.status(200).json({ status: 'success' });
exports.logout = async (req, res) => res.status(200).json({ status: 'success' });