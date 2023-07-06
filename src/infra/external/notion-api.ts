/*
Partly borrowed from https://github.com/n8n-io/n8n.
*/

import axios, { type AxiosRequestConfig } from 'axios';
import { type ApiResponse, BaseExternalApi } from './base-external-api';

export class NotionApi extends BaseExternalApi {
  apiRequest = async (
    method: string,
    endpoint: string,
    authToken: string,
    data?: Record<string, unknown> | Array<Record<string, unknown>>,
    query?: Record<string, string | string[]>
  ): Promise<ApiResponse> => {
    try {
      const headers: Record<string, string> = {
        'Notion-Version': apiVersion[2],
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      };

      const config: AxiosRequestConfig = {
        baseURL: 'https://api.notion.com/v1',
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

    const returnData: Array<Record<string, unknown>> = [];

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
      returnData.push(apiResponse.data as Record<string, unknown>);
    } while (!apiResponse || apiResponse.headers.link?.includes('next'));
    return returnData;
  };
}

const apiVersion: Record<number, string> = {
  1: '2021-05-13',
  2: '2021-08-16',
};
