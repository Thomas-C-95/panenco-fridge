import express, { Application, NextFunction, Request, Response } from 'express';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controllers/users/user.controller.js';
import { errorMiddleware } from '@panenco/papi';

export class App {
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

    // init controllers
    this.initializeControllers([UserController])

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

  listen() {
    this.host.listen(3000, () => {
      console.info(' http://localhost:3000');
      console.info('=======================');
    })
  }
}
