const Joi = require("joi");

const orderValidationSchema = Joi.object({
  customerId: Joi.number()
    .integer()
    .required()
    .messages({
      "number.base": "Customer ID must be a number.",
      "number.integer": "Customer ID must be an integer.",
      "any.required": "Customer ID is required."
    }),

  totalAmount: Joi.number()
    .positive()
    .required()
    .messages({
      "number.base": "Total amount must be a number.",
      "number.positive": "Total amount must be a positive value.",
      "any.required": "Total amount is required."
    }),

  status: Joi.string()
    .valid("pending", "processing", "completed", "cancelled")
    .required()
    .messages({
      "string.base": "Status must be a string.",
      "any.only": "Status must be one of: pending, processing, completed, cancelled.",
      "any.required": "Status is required."
    }),

  orderDetails: Joi.array()
    .items(
      Joi.object({
        productId: Joi.number().integer().required().messages({
          "number.base": "Product ID must be a number.",
          "number.integer": "Product ID must be an integer.",
          "any.required": "Product ID is required."
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          "number.base": "Quantity must be a number.",
          "number.integer": "Quantity must be an integer.",
          "number.min": "Quantity must be at least 1.",
          "any.required": "Quantity is required."
        }),
        price: Joi.number().positive().required().messages({
          "number.base": "Price must be a number.",
          "number.positive": "Price must be a positive value.",
          "any.required": "Price is required."
        })
      })
    )
    .required()
    .messages({
      "array.base": "Order details must be an array.",
      "any.required": "Order details are required."
    }),

  paymentMethod: Joi.string()
    .valid("card", "cash")
    .required()
    .messages({
      "string.base": "Payment method must be a string.",
      "any.only": "Payment method must be either 'card' or 'cash'.",
      "any.required": "Payment method is required."
    }),

  notes: Joi.string()
    .allow("")
    .optional()
    .messages({
      "string.base": "Notes must be a string."
    })
});

module.exports = orderValidationSchema;
