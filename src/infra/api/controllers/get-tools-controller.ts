// TODO: Violation of control flow. DI for express instead
import { type Request, type Response } from 'express';
import { BaseController, CodeHttp } from './base-controller';
import {
  isApiErrorResponse,
  isRichApiErrorResponse,
} from '../../../services/identify-error-response';
import { type GetTools } from '../../../domain/use-cases/get-tools';

export default class GetToolsController extends BaseController {
  readonly #getTools: GetTools;

  constructor(getTools: GetTools) {
    super();
    this.#getTools = getTools;
  }

  protected async executeImpl(req: Request, res: Response): Promise<Response> {
    try {
      const useCaseResult = await this.#getTools.execute({
        req: undefined,
      });

      if (!useCaseResult.success) {
        return GetToolsController.badRequest(res);
      }

      const result = useCaseResult.value;
      if (!result)
        return GetToolsController.fail(res, 'Get tools. Internal error.');

      return GetToolsController.ok(res, result, CodeHttp.OK);
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        if (isRichApiErrorResponse(error))
          console.error(error.response.data.error.message);
        console.error(error.stack);
      } else if (error) console.trace(error);
      return GetToolsController.fail(res, 'run tool - Internal error occurred');
    }
  }
}
