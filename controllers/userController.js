const jwt = require('jsonwebtoken');
const { User } = require('../config/config');
const { comparePassword, successResponse, errorResponse } = require('../utils/utils');
const {generateAccessToken, generateRefreshToken} = require("../middleware/auth")
const cookie = require('cookie');
const { Op ,where } = require('sequelize');


const getByCountryAndAge = async (req, res) => {
  try {
    const { age, country } = req.body;

    if (!age || !country) {
      return res.status(400).json(errorResponse(
        'Age and country parameters are required',
        'MISSING_PARAMS',
        'Both age and country are required in the request body.',
        req.originalUrl
      ));
    }

    const users = await User.findAll({
      where: {
        country,
        age: {
          [Op.gt]: age  
        }
      }
    });

    if (users.length === 0) {
      return res.status(404).json(errorResponse(
        'No users found',
        'NO_USERS_FOUND',
        `No users found from ${country} with age greater than ${age}`,
        req.originalUrl
      ));
    }

    return res.status(200).json(successResponse(
      'Users fetched successfully',
      { users },
      req.originalUrl
    ));

  } catch (error) {
    return res.status(500).json(errorResponse(
      'Failed to fetch users by country and age',
      'FETCH_ERROR',
      error.message,
      req.originalUrl
    ));
  }
};

const getByAge = async (req, res) => {
  try {
    const { age } = req.body;  
    if (!age) {
      return res.status(400).json(errorResponse('Age parameter is required', 'MISSING_AGE', 'The Age parameter is required in the request body.', req.originalUrl));
    }

    const users = await User.findAll({ where: { age } });

    if (users.length === 0) {
      return res.status(404).json(errorResponse('No users found for that age', 'NO_AGE_FOUND', `No users found for age: ${age}`, req.originalUrl));
    }

    return res.status(200).json(successResponse('Users found successfully', { users }, req.originalUrl));

  } catch (error) {
    return res.status(500).json(errorResponse('Error fetching users by age', 'FETCH_ERROR', error.message, req.originalUrl));
  }
};

const getByCountry = async (req, res) => {  
  try {
    const { country } = req.body;
    if (!country) {
      return res.status(400).json(errorResponse('Country parameter is required', 'MISSING_COUNTRY', 'The country parameter is required in the request body.', req.originalUrl));
    }

    const users = await User.findAll({ where: { country } });

    if (users.length === 0) {
      return res.status(404).json(errorResponse('No users found from country', 'NO_USERS_FOUND', `No users found from country: ${country}`, req.originalUrl));
    }

    return res.status(200).json(successResponse('Users found successfully', { users }, req.originalUrl));

  } catch (error) {
    return res.status(500).json(errorResponse('Error fetching users by country', 'FETCH_ERROR', error.message, req.originalUrl));
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json(errorResponse('Refresh token is required', 'MISSING_REFRESH_TOKEN', 'The refresh token is missing in the request body.', req.originalUrl));
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json(errorResponse('User not found', 'USER_NOT_FOUND', 'No user found with the given refresh token.', req.originalUrl));
    }

    const newAccessToken = generateAccessToken(user);
    res.status(200).json(successResponse('New access token generated successfully', { accessToken: newAccessToken }, req.originalUrl));

  } catch (error) {
    res.status(400).json(errorResponse('Invalid refresh token', 'INVALID_REFRESH_TOKEN', error.message, req.originalUrl));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json(errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 'No user found with the provided email.', req.originalUrl));
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json(errorResponse('Invalid email or password', 'INVALID_CREDENTIALS', 'The password provided does not match our records.', req.originalUrl));
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
      sameSite: 'Strict'
    });

    res.status(200).json(successResponse('Login successful', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken
    }, req.originalUrl));

  } catch (err) {
    res.status(500).json(errorResponse('Login failed', 'LOGIN_FAILED', err.message, req.originalUrl));
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, age, country, role, password } = req.body;
    
    const existUser = await User.findOne({ where: { email } });
    if (existUser) {
      return res.status(400).json(errorResponse('User with this email already exists', 'EMAIL_ALREADY_EXISTS', 'An account with this email address already exists. Please use a different email.', req.originalUrl));
    }

    const newUser = await User.create({
      username,
      email,
      age,
      country,
      role,
      password
    });

    res.status(201).json(successResponse('User registered successfully', newUser, req.originalUrl));

  } catch (error) {
    res.status(500).json(errorResponse('Error registering user', 'REGISTER_FAILED', error.message, req.originalUrl));
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(successResponse('Fetched all users', users, req.originalUrl));
  } catch (err) {
    res.status(500).json(errorResponse('Error fetching users', 'FETCH_USERS_FAILED', err.message, req.originalUrl));
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'USER_NOT_FOUND', 'No user found with the given ID.', req.originalUrl));
    }
    res.status(200).json(successResponse('User fetched successfully', user, req.originalUrl));
  } catch (err) {
    res.status(500).json(errorResponse('Error fetching user', 'FETCH_USER_FAILED', err.message, req.originalUrl));
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'USER_NOT_FOUND', 'No user found with the given ID to update.', req.originalUrl));
    }

    const { username, email, role, password } = req.body;
    await user.update({ username, email, role, password });

    res.status(200).json(successResponse('User updated successfully', user, req.originalUrl));

  } catch (err) {
    res.status(400).json(errorResponse('Error updating user', 'UPDATE_FAILED', err.message, req.originalUrl));
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json(errorResponse('User not found', 'USER_NOT_FOUND', 'No user found with the given ID to delete.', req.originalUrl));
    }

    await user.destroy();
    res.status(204).send();

  } catch (err) {
    res.status(500).json(errorResponse('Error deleting user', 'DELETE_FAILED', err.message, req.originalUrl));
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  getByCountry,
  getByAge
};
