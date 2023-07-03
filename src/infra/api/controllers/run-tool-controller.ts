// TODO: Violation of control flow. DI for express instead
import { type Request, type Response } from 'express';

import { BaseController, CodeHttp } from './base-controller';
import {
  isApiErrorResponse,
  isRichApiErrorResponse,
} from '../../../services/identify-error-response';
import type Result from '../../../domain/value-types/transients/result';
import type IUseCase from '../../../domain/use-cases/i-use-case';
import { type IExternalApi } from '../../../services/i-external-api';

export default class RunToolController<
  UseCaseReq,
  UseCaseRes extends Result<unknown>,
  UseCaseAuth = undefined,
  ToolProps = undefined
> extends BaseController {
  readonly #buildReq: (httpRequest: Request) => UseCaseReq;
  readonly #buildAuth: (httpRequest: Request) => UseCaseAuth;

  readonly #useCase: IUseCase<
    UseCaseReq,
    UseCaseRes,
    UseCaseAuth,
    IExternalApi<ToolProps>
  >;

  readonly #api: IExternalApi<ToolProps>;

  constructor(
    buildReq: (httpRequest: Request) => UseCaseReq,
    useCase: IUseCase<
      UseCaseReq,
      UseCaseRes,
      UseCaseAuth,
      IExternalApi<ToolProps>
    >,
    buildAuth: (httpRequest: Request) => UseCaseAuth,
    api: IExternalApi<ToolProps>
  ) {
    super();
    this.#buildReq = buildReq;
    this.#useCase = useCase;
    this.#buildAuth = buildAuth;
    this.#api = api;
  }

  protected async executeImpl(req: Request, res: Response): Promise<Response> {
    try {
      const requestDto = this.#buildReq(req);

      const useCaseResult = await this.#useCase.execute({
        req: requestDto,
        auth: this.#buildAuth(req),
        api: this.#api,
      });

      if (!useCaseResult.success) {
        return RunToolController.badRequest(res);
      }

      const result = useCaseResult.value;
      if (!result)
        return RunToolController.fail(
          res,
          `An error occured while executing ${
            this.#useCase.constructor.name
          }. Internal error.`
        );

      return RunToolController.ok(res, result, CodeHttp.CREATED);
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        if (isRichApiErrorResponse(error))
          console.error(error.response.data.error.message);
        console.error(error.stack);
      } else if (error) console.trace(error);
      return RunToolController.fail(res, 'run tool - Internal error occurred');
    }
  }
}
