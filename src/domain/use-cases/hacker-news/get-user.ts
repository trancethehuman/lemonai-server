import {
  type IExternalApi,
  type ApiResponse,
} from '../../../services/i-external-api';
import {
  isApiErrorResponse,
  isRichApiErrorResponse,
} from '../../../services/identify-error-response';
import Result from '../../value-types/transients/result';
import type IUseCase from '../IUseCase';

export interface GetUserHackerNewsReq {
  params: {
    username: string;
  };
}

export type GetUserHackerNewsRes = Result<Record<string, unknown>>;

export class GetUserHackerNews
  implements
    IUseCase<
      GetUserHackerNewsReq,
      GetUserHackerNewsRes,
      undefined,
      IExternalApi
    >
{
  #api?: IExternalApi;

  async execute(props: {
    req: GetUserHackerNewsReq;
    api: IExternalApi;
  }): Promise<GetUserHackerNewsRes> {
    this.#api = props.api;

    const { req } = props;

    const endpoint = `users/${req.params.username}`;

    let responseData: ApiResponse;
    try {
      responseData = await this.#api.apiRequest('GET', endpoint);
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        if (isRichApiErrorResponse(error))
          console.error(error.response.data.error.message);
        console.error(error.stack);
      } else if (error) console.trace(error);
      throw new Error('Unknown error at GetUserHackerNews');
    }

    if (responseData.status !== 200) {
      return Result.fail(
        `request failed with status code ${responseData.status} and message ${responseData.statusText} `
      );
    }

    const data = responseData.data;

    return Result.ok(data);
  }
}
