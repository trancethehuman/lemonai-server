import express, { type Application } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import v1Router from './routes/v1';
import {
  isApiErrorResponse,
  isRichApiErrorResponse,
} from '../../services/identify-error-response';

interface AppConfig {
  port: number;
  mode: string;
}

export default class ExpressApp {
  #expressApp: Application;

  #config: AppConfig;

  constructor(config: AppConfig) {
    this.#expressApp = express();
    this.#config = config;
  }

  async start(runningLocal: boolean): Promise<Application> {
    try {
      this.configApp();

      if (runningLocal)
        this.#expressApp.listen(this.#config.port, () => {
          console.log(
            `App running under pid ${process.pid} and listening on port: ${
              this.#config.port
            } in ${this.#config.mode} mode`
          );
        });

      return this.#expressApp;
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        if (isRichApiErrorResponse(error))
          console.error(error.response.data.error.message);
        console.error(error.stack);
      } else if (error) console.trace(error);
      throw new Error('starting express app - unknown error');
    }
  }

  private configApp(): void {
    this.#expressApp.use(express.json());
    this.#expressApp.use(express.urlencoded({ extended: true }));
    this.#expressApp.use(cors());
    this.#expressApp.use(compression());
    this.#expressApp.use(morgan('combined'));
    this.#expressApp.use(helmet());
    this.#expressApp.use(v1Router);
  }
}
