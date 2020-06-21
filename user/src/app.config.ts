type AppConfigurationType = {
  NODE_ENV: string;
  PORT: number;
  database: {
    type: 'mysql' | 'mariadb';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
  };
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  REDIS_MASTER_HOST: string;
  REDIS_MASTER_PORT: number;
  REDIS_SLAVE_HOST: string;
  REDIS_SLAVE_PORT: number;
};

const AppConfiguration: AppConfigurationType = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    database: process.env.DATABASE_NAME || 'user',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'test',
    synchronize: process.env.DATABASE_SYNC === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
  JWT_SECRET: 'sAmPlEsEcReT',
  JWT_EXPIRATION: 3600,
  REDIS_MASTER_HOST: process.env.REDIS_MASTER_HOST || 'localhost',
  REDIS_MASTER_PORT: Number(process.env.REDIS_MASTER_PORT) || 6379,
  REDIS_SLAVE_HOST: process.env.REDIS_SLAVE_HOST || 'localhost',
  REDIS_SLAVE_PORT: Number(process.env.REDIS_SLAVE_PORT) || 6379,
};

export default AppConfiguration;
