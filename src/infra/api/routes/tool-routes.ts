import { Router } from 'express';
import resolveToolController from '../controllers/resolve-controller-of-tool';

const toolRoutes = Router();

toolRoutes.post('/:id/execute', (req, res) => {
  resolveToolController(req.params.id)
    .execute(req, res)
    .catch(() => {
      throw new Error(`Error executing tool ${req.params.id}`);
    });
});

export default toolRoutes;
