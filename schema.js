const Joi = require('joi');

// Wallet schema for validation
const walletSchema = Joi.object({
  name: Joi.string().required(),
  balance: Joi.number().integer().positive().strict().required(),
});

// Transaction schema for validation
const transactionSchema = Joi.object({
  amount: Joi.number().integer().strict().required(),
  description: Joi.string().default(''),
});

module.exports = { walletSchema, transactionSchema };
