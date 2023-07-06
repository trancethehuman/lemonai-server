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

import type { OptionsWithUri } from 'request';

import type {
  IBinaryKeyData,
  IDataObject,
  IDisplayOptions,
  IExecuteFunctions,
  IExecuteSingleFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodeProperties,
  IPollFunctions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

import { camelCase, capitalCase, snakeCase } from 'change-case';

import { filters } from './Filters';

import moment from 'moment-timezone';

import { validate as uuidValidate } from 'uuid';

function uuidValidateWithoutDashes(this: IExecuteFunctions, value: string) {
  if (uuidValidate(value)) return true;
  if (value.length == 32) {
    //prettier-ignore
    const strWithDashes = `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`;
    if (uuidValidate(strWithDashes)) return true;
  }
  throw new NodeOperationError(
    this.getNode(),
    `The relation id "${value}" is not a valid uuid with optional dashes.`
  );
}

export type SortData = {
  key: string;
  type: string;
  direction: string;
  timestamp: boolean;
};

const apiVersion: { [key: number]: string } = {
  1: '2021-05-13',
  2: '2021-08-16',
};

export async function notionApiRequestAllItems(
  this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
  propertyName: string,
  method: string,
  endpoint: string,

  body: any = {},
  query: IDataObject = {}
): Promise<any> {
  const resource = this.getNodeParameter('resource', 0);

  const returnData: IDataObject[] = [];

  let responseData;

  do {
    responseData = await notionApiRequest.call(
      this,
      method,
      endpoint,
      body,
      query
    );
    const { next_cursor } = responseData;
    if (resource === 'block' || resource === 'user') {
      query.start_cursor = next_cursor;
    } else {
      body.start_cursor = next_cursor;
    }
    returnData.push.apply(
      returnData,
      responseData[propertyName] as IDataObject[]
    );
    const limit = query.limit as number | undefined;
    if (limit && limit <= returnData.length) {
      return returnData;
    }
  } while (responseData.has_more !== false);

  return returnData;
}
