const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/utils');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Token'dan gelen kullanıcı bilgilerini req.user'a ekliyoruz
    next();
  } catch (error) {
    return res.status(401).json(
      errorResponse(
        'Access token expired',
        'TOKEN_EXPIRED_or_INVALID_TOKEN',
        'The provided access token has expired or the token is invalid. Please use a valid refresh token to obtain a new access token.',
        req.originalUrl
      )
    );
  }
};

const accessTokenExpiresIn = 12 * 60 * 60; // 12 saat (saniye cinsinden)
const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7 gün

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenExpiresIn }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_SECRET,
    { expiresIn: refreshTokenExpiresIn }
  );
};


module.exports = { authMiddleware, generateAccessToken, generateRefreshToken };
