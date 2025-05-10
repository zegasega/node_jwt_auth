const Joi = require('joi');

const userValidationSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    'string.base': 'First name should be a type of text',
    'string.min': 'First name should have a minimum length of 3 characters',
    'string.max': 'First name should have a maximum length of 30 characters',
    'any.required': 'First name is required',
  }),
  
  lastName: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Last name should be a type of text',
    'string.min': 'Last name should have a minimum length of 3 characters',
    'string.max': 'Last name should have a maximum length of 30 characters',
    'any.required': 'Last name is required',
  }),

  email: Joi.string().email().required().messages({
    'string.base': 'Email should be a type of text',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(6).required().messages({
    'string.base': 'Password should be a type of text',
    'string.min': 'Password should have a minimum length of 6 characters',
    'any.required': 'Password is required',
  }),

  role: Joi.string().valid('user', 'admin', 'manager').default('standard').messages({
    'string.base': 'Role should be a type of text',
    'any.only': 'Role should be one of "standard", "admin", or "manager"',
  }),
});

module.exports = userValidationSchema;
