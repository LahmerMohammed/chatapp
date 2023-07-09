import * as Joi from 'joi';

export const configModuleValidationSchema = Joi.object({
  DATABASE_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string(),
});
