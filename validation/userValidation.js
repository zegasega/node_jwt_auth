// utils/validate.js
const Joi = require('joi');

// Joi validation şeması (userValidationSchema)
const userValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'Username should be a type of string',
      'string.empty': 'Username cannot be an empty field',
      'string.min': 'Username should have a minimum length of {#limit}',
      'string.max': 'Username should have a maximum length of {#limit}',
      'any.required': 'Username is a required field'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email should be a type of string',
      'string.empty': 'Email cannot be an empty field',
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is a required field'
    }),

  password: Joi.string()
    .min(8)  // Password için minimum uzunluk
    .required()
    .messages({
      'string.base': 'Password should be a type of string',
      'string.empty': 'Password cannot be an empty field',
      'string.min': 'Password should have a minimum length of {#limit}',
      'any.required': 'Password is a required field'
    }),

  role: Joi.string()
    .valid('admin', 'user')  // Burada role belirli değerlerle kısıtlanıyor (admin veya user)
    .optional()
    .messages({
      'string.base': 'Role should be a type of string',
      'any.only': 'Role must be one of the following values: admin, user'
    }),

  // Yeni 'age' parametresini ekliyoruz
  age: Joi.number()
    .min(18)  // Yaşın minimum 18 olması gerekir
    .max(100)  // Yaşın maksimum 100 olması gerekir
    .required()
    .messages({
      'number.base': 'Age should be a type of number',
      'number.min': 'Age must be at least {#limit}',
      'number.max': 'Age must be at most {#limit}',
      'any.required': 'Age is a required field'
    }),

  country: Joi.string()
    .required()
    .messages({
      'string.base': 'Country should be a type of string',
      'string.empty': 'Country cannot be an empty field',
      'any.required': 'Country is a required field'
    })
});

// Validation middleware fonksiyonu
const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();  // Eğer validation geçerse, bir sonraki middleware'e geçer.
};

module.exports = { validateUser };
