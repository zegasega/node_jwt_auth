const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': `"name" should be a type of 'text'`,
      'string.empty': `"name" cannot be an empty field`,
      'any.required': `"name" is a required field`,
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': `"price" should be a valid number`,
      'any.required': `"price" is required`,
    }),

  description: Joi.string()
    .allow('', null) // Opsiyonel
    .max(1000),

  stock: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.base': `"stock" must be an integer`,
      'number.min': `"stock" must be 0 or more`,
    }),
});

module.exports = {
  productSchema
};
