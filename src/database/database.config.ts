import { DataSourceOptions } from 'typeorm';

const baseOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'chatapp.db',
  entities: ['dist/**/**.entity.js'],
  synchronize: true,
  //ssl: { rejectUnauthorized: false },
  migrations: ['dist/database/migration/*.js'],
};

const getDatabaseConfiguration = (): DataSourceOptions => {
  return baseOptions;
};

export default getDatabaseConfiguration;
