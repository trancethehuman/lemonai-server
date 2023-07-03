import { Router } from 'express';
import app from '../../../ioc-container';
import GetToolsController from '../controllers/get-tools-controller';

const toolsRoutes = Router();

const getToolsController = new GetToolsController(app.resolve('getTools'));

toolsRoutes.get('/', (req, res) => {
  getToolsController.execute(req, res).catch(() => {
    throw new Error(`Error getting tool`);
  });
});

export default toolsRoutes;
