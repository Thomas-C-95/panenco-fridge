import express, { Application, NextFunction, Request, Response } from 'express';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/users/user.controller.js';
import { errorMiddleware } from '@panenco/papi';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import ormconfig from './orm.config.js';
import { FridgeController } from './controllers/fridges/fridge.controller.js';
export class App {

  public orm: MikroORM<PostgreSqlDriver>;
  host: Application;

  constructor () {
    
    // init server
    this.host = express();

    // init json middleware
    this.host.use(express.json());

    // init logger middleware
    this.host.use((req, res, next) => {
      console.log(req.method, req.url);
      next();
    })

    // Init Entity Manager
    this.host.use((req, __, next: NextFunction) => {
      RequestContext.create(this.orm.em, next);
    });

    // init controllers
    this.initializeControllers([UserController, FridgeController])

    // Test base url
    this.host.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.send('Hello World from Assignment');
    });

    this.host.use(errorMiddleware);
  }

  private initializeControllers(controllers: Function[]){
    useExpressServer(this.host, {
      cors: {
        origin: '*',
        exposedHeaders: ['x-auth'],
      },
      controllers,
      defaultErrorHandler: false,
      routePrefix: '/api',
    })
  }

  public async createConnection() {
    try{
      this.orm = await MikroORM.init(ormconfig);
    }
    catch(error){
      console.log("Error while connecting to the database", error)
    }
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(' http://localhost:3000');
      console.info('=======================');
    })
  }
}
