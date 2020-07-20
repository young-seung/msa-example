import { createConnection, Connection } from 'typeorm';
import Express from 'express';
import Helmet from 'helmet';
import Cors from 'cors';
import bodyParser from 'body-parser';
import Swagger from 'swagger-ui-express';
import SwaggerJSDoc from 'swagger-jsdoc';
import SwaggerDefinition  from './swagger'
import Routes from './routes';
import AppConfiguration from './config';
import AuthEntity from './entity/user.entity';

async function bootstrap(): Promise<void> {
  const connection: Connection = await createConnection({
    type: 'mysql',
    host: AppConfiguration.DATABASE.host,
    port: AppConfiguration.DATABASE.port,
    username: AppConfiguration.DATABASE.username,
    password: AppConfiguration.DATABASE.password,
    database: AppConfiguration.DATABASE.database,
    synchronize: true,
    logging: true,
    entities: [AuthEntity]
  });

  const app = Express();

  const port: number = AppConfiguration.PORT;

  const options = {
    swaggerDefinition: SwaggerDefinition,
    apis: ['./routes/*.ts']
  };

  const specs = SwaggerJSDoc(options);

  app.use('/api', Swagger.serve, Swagger.setup(specs));
  app.use(Cors());
  app.use(Helmet());
  app.use(bodyParser.json());

  app.use('/', Routes);

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
};

bootstrap()
  .catch(error => console.log(error));