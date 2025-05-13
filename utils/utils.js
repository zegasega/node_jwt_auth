const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const hashPassword = async (password) => {
  const saltRounds = 10;  
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

const errorResponse = (message, errorCode, details = null, path = null) => {
  return {
    status: 'error',
    message,
    errorCode,
    details,
    timestamp: new Date().toISOString(),
    path
  };
};

const successResponse = (message, data = null, path = null) => {
  return {
    status: 'success',
    message,
    data,
    timestamp: new Date().toISOString(),
    path
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  successResponse,
  errorResponse,
};