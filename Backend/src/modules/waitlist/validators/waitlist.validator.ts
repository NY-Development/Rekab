import Joi from 'joi';

export const waitlistSchema = Joi.object({
  email: Joi.string().email().required()
});