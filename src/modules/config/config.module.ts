import { configModuleValidationSchema } from '@config/config-module.validation';
import { ConfigModule } from '@nestjs/config';

export default ConfigModule.forRoot({
  isGlobal: true,
  validationSchema: configModuleValidationSchema,
});
