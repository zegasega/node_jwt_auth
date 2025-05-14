const jwt = require('jsonwebtoken');
const { User } = require('../config/config');
const { comparePassword, successResponse, errorResponse } = require('../utils/utils');
const {generateAccessToken, generateRefreshToken} = require("../middleware/auth")
const cookie = require('cookie');
const { Op ,where } = require('sequelize');
const sendVerificationEmail = require("../services/emailService/sendTestMail");

const resetPassword = async (req, res) => {
  try {
    const { userID } = req.body;

    if (!userID) {
      return res.status(400).json(errorResponse(
        'Missing user ID',
        'MISSING_USER_ID',
        'The user ID is required in the request body.',
        req.originalUrl
      ));
    }

    const user = await User.findByPk(userID);

    if (!user) {
      return res.status(404).json(errorResponse(
        'User not found',
        'USER_NOT_FOUND',
        'No user exists with the given ID.',
        req.originalUrl
      ));
    }

    const verificationCode = await sendVerificationEmail(user.email, user.firstName);

    return res.status(200).json(successResponse(
      'Verification code sent to user email',
      { email: user.email, code: verificationCode },
      req.originalUrl
    ));

  } catch (error) {
    return res.status(500).json(errorResponse(
      'Server error while resetting password',
      'RESET_PASSWORD_ERROR',
      error.message,
      req.originalUrl
    ));
  }
};



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

    const user = await User.findOne({ where: { email } });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json(errorResponse(
        'Invalid email or password',
        'INVALID_CREDENTIALS',
        'Authentication failed with provided credentials.',
        req.originalUrl
      ));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json(successResponse(
      'Login successful',
      {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken
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


module.exports = { refreshAccessToken, loginUser, registerUser, resetPassword };
