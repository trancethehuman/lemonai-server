import axios, { type AxiosRequestConfig } from 'axios';
import type { IDataObject } from '../../services/workflow-interfaces';
import { type ApiResponse, BaseExternalApi } from './base-external-api';

export class GithubApi extends BaseExternalApi {
  apiRequest = async (
    method: string,
    endpoint: string,
    authToken: string,
    data?: Record<string, unknown> | Array<Record<string, unknown>>,
    query?: Record<string, string | string[]>
  ): Promise<ApiResponse> => {
    try {
      const headers: Record<string, string> = {
        'User-Agent': 'lemonai',
        Authorization: `Bearer ${authToken}`,
      };

      const config: AxiosRequestConfig = {
        baseURL: 'https://api.github.com',
        method,
        url: endpoint,
        data,
        headers,
        params: query ? new URLSearchParams(query) : undefined,
      };

      const result = await axios<any, ApiResponse>(config);
      return result;
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  apiRequestAllItems = async (props: {
    method: string;
    endpoint: string;
    authToken: string;
    data?: Record<string, unknown>;
    query?: Record<string, string | string[]>;
  }): Promise<any> => {
    const { method, endpoint, authToken } = props;
    const query = props.query ?? {};
    const data = props.data ?? {};

    const returnData: IDataObject[] = [];

    query.per_page = '100';
    let page = 1;

    let apiResponse: ApiResponse;
    do {
      query.page = page.toString();
      apiResponse = await this.apiRequest(
        method,
        endpoint,
        authToken,
        data,
        query
      );
      page++;
      returnData.push(apiResponse.data as IDataObject);
    } while (!apiResponse || apiResponse.headers.link?.includes('next'));
    return returnData;
  };
}
