const jwt = require('jsonwebtoken');
const { Kullanici } = require('../config/config');
const { comparePassword, successResponse, errorResponse } = require('../utils/utils');
const {generateAccessToken, generateRefreshToken} = require("../middleware/auth")



const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json(
          errorResponse(
            'Refresh token is required',
            'MISSING_REFRESH_TOKEN',
            'The refresh token is missing in the request body.',
            req.originalUrl
          )
        );
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    const user = await Kullanici.findByPk(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json(
          errorResponse(
            'User not found',
            'USER_NOT_FOUND',
            'No user found with the given refresh token.',
            req.originalUrl
          )
        );
    }

    const newAccessToken = generateAccessToken(user);
    res
      .status(200)
      .json(
        successResponse(
          'New access token generated successfully',
          { accessToken: newAccessToken },
          req.originalUrl
        )
      );
  } catch (error) {
    res
      .status(400)
      .json(
        errorResponse(
          'Invalid refresh token',
          'INVALID_REFRESH_TOKEN',
          error.message,
          req.originalUrl
        )
      );
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, sifre } = req.body; 

    const user = await Kullanici.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json(
          errorResponse(
            'Invalid email or password',
            'INVALID_CREDENTIALS',
            'No user found with the provided email.',
            req.originalUrl
          )
        );
    }

    const isPasswordValid = await comparePassword(sifre, user.sifreHash); 
    if (!isPasswordValid) {
      return res
        .status(400)
        .json(
          errorResponse(
            'Invalid email or password',
            'INVALID_CREDENTIALS',
            'The password provided does not match our records.',
            req.originalUrl
          )
        );
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'Strict',
    });

    res.status(200).json(
      successResponse(
        'Login successful',
        {
          user: {
            id: user.id,
            ad: user.ad,
            soyad: user.soyad,
            email: user.email,
            rol: user.rol,
          },
          accessToken,
        },
        req.originalUrl
      )
    );
  } catch (err) {
    res
      .status(500)
      .json(errorResponse('Login failed', 'LOGIN_FAILED', err.message, req.originalUrl));
  }
};

const registerUser = async (req, res) => {
  try {
    const { ad, soyad, email, sifre, rol } = req.body; // 'password' yerine 'sifre'
    // const { username, email, age, country, role, password } = req.body;

    const existUser = await Kullanici.findOne({ where: { email } });
    if (existUser) {
      return res
        .status(400)
        .json(
          errorResponse(
            'User with this email already exists',
            'EMAIL_ALREADY_EXISTS',
            'An account with this email address already exists. Please use a different email.',
            req.originalUrl
          )
        );
    }

    const newUser = await Kullanici.create({
      ad,
      soyad,
      email,
      sifre, // Şifre direkt olarak modele gönderiliyor, modelde hashlenecek
      rol,
    });

    res
      .status(201)
      .json(successResponse('User registered successfully', newUser, req.originalUrl));
  } catch (error) {
    res
      .status(500)
      .json(
        errorResponse(
          'Error registering user',
          'REGISTER_FAILED',
          error.message,
          req.originalUrl
        )
      );
  }
};

module.exports = {
  refreshAccessToken,
  loginUser,
  registerUser,
};