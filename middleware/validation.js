const { celebrate, Joi } = require("celebrate");

module.exports.validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Invalid Email format",
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": 'The "password" field must be filled in' }),
    username: Joi.string().required().min(2).max(30).messages({
      "string.empty": 'The "Username" field must be filled in',
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
    }),
  }),
});

module.exports.validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Invalid Email format",
      "string.empty": 'The "email" field must be filled in',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required().messages({
      "string.length": "ID must be 24 characters long",
      "string.hex": "ID must be a valid hexadecimal",
      "string.empty": 'The "id" field must be filled in',
    }),
  }),
});
