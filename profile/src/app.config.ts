type AppConfigurationType = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_TYPE: 'mysql' | 'mariadb';
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_NAME: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_SYNC: string;
  DATABASE_LOGGING: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  REDIS_MASTER_HOST: string;
  REDIS_MASTER_PORT: number;
  REDIS_SLAVE_HOST: string;
  REDIS_SLAVE_PORT: number;
  RABBITMQ_URL: string;
  RABBITMQ_USERNAME: string;
  RABBITMQ_PASSWORD: string
};

const AppConfiguration: AppConfigurationType = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_TYPE: 'mysql',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_PORT: Number(process.env.DATABASE_PORT) || 3306,
  DATABASE_NAME: process.env.DATABASE_NAME || 'profile',
  DATABASE_USER: process.env.DATABASE_USER || 'root',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'test',
  DATABASE_SYNC: process.env.DATABASE_SYNC || 'false',
  DATABASE_LOGGING: process.env.DATABASE_LOGGING || 'true',
  JWT_SECRET: 'sAmPlEsEcReT',
  JWT_EXPIRATION: 3600,
  REDIS_MASTER_HOST: process.env.REDIS_MASTER_HOST || 'localhost',
  REDIS_MASTER_PORT: Number(process.env.REDIS_MASTER_PORT) || 6379,
  REDIS_SLAVE_HOST: process.env.REDIS_SLAVE_HOST || 'localhost',
  REDIS_SLAVE_PORT: Number(process.env.REDIS_SLAVE_PORT) || 6379,
  RABBITMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
  RABBITMQ_USERNAME: process.env.RABBITMQ_USER_NAME || 'root',
  RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD || 'test',
};

export default AppConfiguration;
