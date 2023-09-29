import express, { Application, NextFunction, Request, Response } from 'express';
import { getMetadataArgsStorage, useExpressServer, RoutingControllersOptions } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { UserController } from './controllers/users/user.controller.js';
import { errorMiddleware, getAuthenticator } from '@panenco/papi';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import 'express-async-errors';
import ormconfig from './orm.config.js';
import { FridgeController } from './controllers/fridges/fridge.controller.js';
import { getMetadataStorage } from 'class-validator';
import swaggerUi from 'swagger-ui-express';
import { AuthController } from './controllers/auth/auth.controller.js';
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
    this.initializeControllers([UserController, FridgeController, AuthController])
    this.initializeSwagger();

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
      authorizationChecker: getAuthenticator('validationstring')
    })
  }

  private initializeSwagger() {
		const schemas = validationMetadatasToSchemas({
			classValidatorMetadataStorage: getMetadataStorage(),
			refPointerPrefix: "#/components/schemas/",
		});

		const routingControllersOptions: RoutingControllersOptions = {
			routePrefix: "/api",
		};

		const storage = getMetadataArgsStorage();
		const spec = routingControllersToSpec(storage, routingControllersOptions, {
			components: {
				schemas,
				securitySchemes: {
					JWT: {
						in: "header",
						name: "x-auth",
						type: "apiKey",
						bearerFormat: "JWT",
						description: "JWT Authorization header using the JWT scheme. Example: \"x-auth: {token}\"",
					},
				},
			},
			security: [{JWT: []}],
		});

		this.host.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
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
