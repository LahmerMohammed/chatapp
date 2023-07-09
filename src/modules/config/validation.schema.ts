import { DEFAULT_PORT, JWT_EXPIRES_IN_DEFAULT } from '@constants/constants';
import * as Joi from 'joi';

const configModuleValidationSchema = Joi.object({
  DATABASE_URI: Joi.string().required(),
  PORT: Joi.number().default(DEFAULT_PORT),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().default(JWT_EXPIRES_IN_DEFAULT),
});

export default configModuleValidationSchema;
