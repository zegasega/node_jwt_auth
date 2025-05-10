const Joi = require("joi");

const customerValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.base": "Name must be a string.",
      "any.required": "Name is required."
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.base": "Email must be a string.",
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required."
    }),

  phone: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .required()
    .messages({
      "string.base": "Phone must be a string.",
      "string.pattern.base": "Phone must be a valid phone number.",
      "any.required": "Phone is required."
    }),

  createdBy: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "createdBy must be a number.",
      "number.integer": "createdBy must be an integer.",
      "any.required": "createdBy is required."
    })
});

module.exports = customerValidationSchema;
