import { createConnection, Connection } from 'typeorm';
import bodyParser from 'body-parser';
import Cors from 'cors';
import Express from 'express';
import Helmet from 'helmet';
import Swagger from 'swagger-ui-express';
import SwaggerDefinition from './swagger';
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

  app.use(Cors());
  app.use(Helmet());
  app.use(bodyParser.json());  
  app.use('/', Routes);
  app.use('/api', Swagger.serve, Swagger.setup(SwaggerDefinition));

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
  });
};

bootstrap()
  .catch(error => console.log(error));