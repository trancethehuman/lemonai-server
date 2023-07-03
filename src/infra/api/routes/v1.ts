import { Router } from 'express';
import { appConfig } from '../../../config';
import toolRoutes from './tool-routes';
import toolsRoutes from './tools-routes';

const version = 'v0';

const v1Router = Router();

v1Router.get('/', (req, res) =>
  res.json({
    message: "Hi, we're up! Please provide the path to your desired endpoint",
  })
);

v1Router.use(`/${appConfig.express.apiRoot}/${version}/tool`, toolRoutes);
v1Router.use(`/${appConfig.express.apiRoot}/${version}/tools`, toolsRoutes);

export default v1Router;
