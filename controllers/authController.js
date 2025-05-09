const jwt = require('jsonwebtoken');
const { User } = require('../config/config');
const { comparePassword, successResponse, errorResponse } = require('../utils/utils');
const {generateAccessToken, generateRefreshToken} = require("../middleware/auth")
const cookie = require('cookie');
const { Op ,where } = require('sequelize');


const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(errorResponse(
        'Refresh token is required', 
        'MISSING_REFRESH_TOKEN', 
        'The refresh token is missing in the request body.', 
        req.originalUrl
      ));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findByPk(decoded.id); 

    if (!user) {
      return res.status(400).json(errorResponse(
        'User not found', 
        'USER_NOT_FOUND', 
        'No user found with the given refresh token.', 
        req.originalUrl
      ));
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json(successResponse(
      'New access token generated successfully', 
      { accessToken: newAccessToken }, 
      req.originalUrl
    ));

  } catch (error) {
    res.status(400).json(errorResponse(
      'Invalid refresh token', 
      'INVALID_REFRESH_TOKEN', 
      error.message, 
      req.originalUrl
    ));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } }); // User modelinde email'e göre arama yapıyoruz
    if (!user) {
      return res.status(400).json(errorResponse(
        'Invalid email or password', 
        'INVALID_CREDENTIALS', 
        'No user found with the provided email.', 
        req.originalUrl
      ));
    }

    const isPasswordValid = await comparePassword(password, user.password); // Şifre doğrulama
    if (!isPasswordValid) {
      return res.status(400).json(errorResponse(
        'Invalid email or password', 
        'INVALID_CREDENTIALS', 
        'The password provided does not match our records.', 
        req.originalUrl
      ));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
      sameSite: 'Strict',
    });

    res.status(200).json(successResponse(
      'Login successful', 
      {
        user: {
          id: user.id,
          firstName: user.firstName,  // Kullanıcı bilgileri
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken,
      }, 
      req.originalUrl
    ));

  } catch (err) {
    res.status(500).json(errorResponse(
      'Login failed', 
      'LOGIN_FAILED', 
      err.message, 
      req.originalUrl
    ));
  }
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return res.status(400).json(errorResponse(
        'User with this email already exists', 
        'EMAIL_ALREADY_EXISTS', 
        'An account with this email address already exists. Please use a different email.', 
        req.originalUrl
      ));
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password, 
      role,
    });

    res.status(201).json(successResponse(
      'User registered successfully', 
      { 
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }
      }, 
      req.originalUrl
    ));

  } catch (error) {
    res.status(500).json(errorResponse(
      'Error registering user', 
      'REGISTER_FAILED', 
      error.message, 
      req.originalUrl
    ));
  }
};


module.exports = { refreshAccessToken, loginUser, registerUser };
