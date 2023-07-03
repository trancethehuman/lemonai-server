import {
  type IExternalApi,
  type ApiResponse,
} from '../../../services/i-external-api';
import {
  isApiErrorResponse,
  isRichApiErrorResponse,
} from '../../../services/identify-error-response';
import {} from '../../../services/workflow-interfaces';
import Result from '../../value-types/transients/result';
import type IUseCase from '../IUseCase';

export interface GetArticleHackerNewsReq {
  params: {
    articleId: string;
    additionalFields: { includeComments: boolean };
  };
}

export type GetArticleHackerNewsRes = Result<Record<string, any> | undefined>;

export class GetArticleHackerNews
  implements
    IUseCase<
      GetArticleHackerNewsReq,
      GetArticleHackerNewsRes,
      undefined,
      IExternalApi
    >
{
  #api?: IExternalApi;

  async execute(props: {
    req: GetArticleHackerNewsReq;
    api: IExternalApi;
  }): Promise<GetArticleHackerNewsRes> {
    this.#api = props.api;

    const { req } = props;

    const endpoint = `items/${req.params.articleId}`;

    let apiResponse: ApiResponse;
    try {
      apiResponse = await this.#api.apiRequest('GET', endpoint);
    } catch (error: unknown) {
      if (isApiErrorResponse(error)) {
        if (isRichApiErrorResponse(error))
          console.error(error.response.data.error.message);
        console.error(error.stack);
      } else if (error) console.trace(error);
      throw new Error('Unknown error at GetArticleHackerNews');
    }

    if (apiResponse.status !== 200) {
      return Result.fail(
        `request failed with status code ${apiResponse.status} and message ${apiResponse.statusText} `
      );
    }

    const article = apiResponse.data;

    if (!article) return Result.ok(undefined);

    if (!req.params.additionalFields.includeComments) {
      delete article.children;
    }

    return Result.ok(article);
  }
}
