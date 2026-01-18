exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validation des champs obligatoires restants
    if (!username) return res.status(400).json({ message: "Username requis" });
    if (!email) return res.status(400).json({ message: "Email requis" });
    if (!password) return res.status(400).json({ message: "Mot de passe requis" });

    // Sécurité : On force le rôle 'user' si aucun rôle n'est fourni
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