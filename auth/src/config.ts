type AppConfigurationType = {
  PORT: number;
  DATABASE:{
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
};

const AppConfiguration: AppConfigurationType = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE: {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    database: process.env.DATABASE_NAME || 'auth',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'test',
    synchronize: process.env.DATABASE_SYNC === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
  JWT_SECRET: 'sAmPlEsEcReT',
  JWT_EXPIRATION: 3600,
};

export default AppConfiguration;