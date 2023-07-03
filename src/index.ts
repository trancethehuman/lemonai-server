import ExpressApp from './infra/api/express-app';
import { appConfig } from './config';

process.once('SIGUSR2', function () {
  console.log('Gracefully shutting down from SIGUSR2 (nodemon)');
  process.kill(process.pid, 'SIGUSR2');
  process.exit(0);
});

process.on('SIGINT', function () {
  console.log('Gracefully shutting down from SIGINT (Ctrl-C)');
  process.kill(process.pid, 'SIGINT');
  process.exit(0);
});

const expressApp = new ExpressApp({
  port: appConfig.express.port,
  mode: appConfig.express.mode,
});

expressApp.start(true).catch(() => {
  throw new Error(
    `Error starting Express app on port ${appConfig.express.port}`
  );
});
