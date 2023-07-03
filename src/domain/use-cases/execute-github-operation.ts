/*
Partly borrowed from https://github.com/n8n-io/n8n.
*/

import {
  isApiErrorResponse,
  isRichApiErrorResponse,
} from '../../services/identify-error-response';
import { type GithubAuthType, type ToolType } from '../value-types/tool';
import Result from '../value-types/transients/result';
import type IUseCase from './i-use-case';
import {
  type ApiResponse,
  type ApiResponseData,
  type IExternalApi,
} from '../../services/i-external-api';

interface GithubOperationParams {
  toolType: ToolType;
  owner: string;
  repository: string;
  fileListParamType?: {
    filePath?: string;
  };
  fileCreateParamType?: {
    fileContent: string;
    commitMessage: string;
    filePath: string;
    additionalParameters?: {
      author?: {
        name?: string;
        email?: string;
      };
      branch?: {
        branch?: string;
      };
      committer?: {
        name?: string;
        email?: string;
      };
    };
  };
  fileEditParamType?: {
    fileContent: string;
    commitMessage: string;
    filePath: string;
    additionalParameters?: {
      author?: {
        name?: string;
        email?: string;
      };
      branch?: {
        branch?: string;
      };
      committer?: {
        name?: string;
        email?: string;
      };
    };
  };
  fileDeleteParamType?: {
    commitMessage: string;
    filePath: string;
    additionalParameters?: {
      author?: {
        name?: string;
        email?: string;
      };
      branch?: {
        branch?: string;
      };
      committer?: {
        name?: string;
        email?: string;
      };
    };
  };
  fileGetParamType?: {
    filePath: string;
    additionalParameters?: {
      reference?: string;
    };
  };
  issueCreateParamType?: {
    title: string;
    body?: string;
    labels?: Array<{
      label?: string;
    }>;
    assignees?: Array<{
      assignee?: string;
    }>;
  };
  issueCreateCommentParamType?: {
    issueNumber: number;
    body?: string;
  };
  issueEditParamType?: {
    issueNumber: number;
    editFields?: {
      title?: string;
      body?: string;
      state?: 'closed' | 'open';
      labels?: {
        label?: string;
      };
      assignees?: {
        assignee?: string;
      };
    };
  };
  issueGetParamType?: {
    issueNumber: number;
  };
  issueLockParamType?: {
    issueNumber: number;
    lockReason?: 'off-topic' | 'too heated' | 'resolved' | 'spam';
  };
  releaseCreateParamType?: {
    releaseTag: string;
    additionalFields?: {
      name?: string;
      body?: string;
      draft?: boolean;
      prerelease?: boolean;
      target_commitish?: string;
    };
  };
  releaseGetParamType?: {
    releaseId: string;
  };
  releaseDeleteParamType?: {
    releaseId: string;
  };
  releaseUpdateParamType?: {
    releaseId: string;
    additionalFields?: {
      body?: string;
      draft?: boolean;
      name?: string;
      prerelease?: boolean;
      tag_name?: string;
      target_commitish?: string;
    };
  };
  releaseGetAllParamType?: {
    returnAll?: boolean;
    limit?: number;
  };
  repositoryGetIssuesParamType?: {
    returnAll?: boolean;
    limit?: number;
    getRepositoryIssuesFilters?: {
      assignee?: string;
      creator?: string;
      mentioned?: string;
      labels?: string;
      since?: string;
      state?: 'all' | 'closed' | 'open';
      sort?: 'created' | 'updated' | 'comments';
      direction?: 'asc' | 'desc';
    };
  };
  reviewGetParamType?: {
    pullRequestNumber: number;
    reviewId: string;
  };
  reviewUpdateParamType?: {
    pullRequestNumber: number;
    reviewId: string;
    body?: string;
  };
  reviewGetAllParamType?: {
    pullRequestNumber: number;
    returnAll?: boolean;
    limit?: number;
  };
  reviewCreateParamType?: {
    pullRequestNumber: number;
    event?: 'approve' | 'requestChanges' | 'comment' | 'pending';
    body?: string;
    additionalFields?: {
      commitId?: string;
    };
  };
  userGetRepositoriesParamType?: {
    returnAll?: boolean;
    limit?: number;
  };
  userInviteParamType?: {
    organization: string;
    email: string;
  };
  organizationGetRepositoriesParamType?: {
    returnAll?: boolean;
    limit?: number;
  };
}

export interface ExecuteGithubOperationAuth {
  token: string;
  type: GithubAuthType;
}

export interface ExecuteGithubOperationReq {
  params: GithubOperationParams;
}

export type ExecuteGithubOperationRes = Result<
  Record<string, 'any'> | undefined
>;

export class ExecuteGithubOperation
  implements
    IUseCase<
      ExecuteGithubOperationReq,
      ExecuteGithubOperationRes,
      ExecuteGithubOperationAuth,
      IExternalApi
    >
{
  #params?: GithubOperationParams;
  #auth?: ExecuteGithubOperationAuth;
  #api?: IExternalApi;

  async execute(props: {
    req: ExecuteGithubOperationReq;
    auth: ExecuteGithubOperationAuth;
    api: IExternalApi;
  }): Promise<ExecuteGithubOperationRes> {
    this.#params = props.req.params;
    this.#auth = props.auth;
    this.#api = props.api;

    let returnData: ApiResponseData | undefined;
    try {
      switch (this.#params.toolType) {
        case 'github-file-create':
          returnData = await this.#execFileCreate();
          break;
        case 'github-file-delete':
          returnData = await this.#execFileDelete();
          break;
        case 'github-file-edit':
          returnData = await this.#execFileEdit();
          break;
        case 'github-file-get':
          returnData = await this.#execFileGet();
          break;
        case 'github-issue-create':
          returnData = await this.#execIssueCreate();
          break;
        case 'github-issue-comment':
          returnData = await this.#execIssueCommentCreate();
          break;
        case 'github-issue-edit':
          returnData = await this.#execIssueEdit();
          break;
        case 'github-issue-get':
          returnData = await this.#execIssueGet();
          break;
        case 'github-issue-lock':
          returnData = await this.#execIssueLock();
          break;
        case 'github-repo-get':
          returnData = await this.#execRepoGet();
          break;
        case 'github-repo-license':
          returnData = await this.#execRepoLicense();
          break;
        case 'github-repo-issues':
          returnData = await this.#execRepoIssues();
          break;
        case 'github-repo-top-paths':
          returnData = await this.#execRepoTopPaths();
          break;
        case 'github-repo-top-domains':
          returnData = await this.#execRepoTopDomains();
          break;
        case 'github-release-create':
          returnData = await this.#execReleaseCreate();
          break;
        case 'github-release-get':
          returnData = await this.#execReleaseGet();
          break;
        case 'github-release-get-all':
          returnData = await this.#execReleaseGetAll();
          break;
        case 'github-release-delete':
          returnData = await this.#execReleaseDelete();
          break;
        case 'github-release-update':
          returnData = await this.#execReleaseUpdate();
          break;
        case 'github-review-create':
          returnData = await this.#execReviewCreate();
          break;
        case 'github-review-get':
          returnData = await this.#execReviewGet();
          break;
        case 'github-review-get-all':
          returnData = await this.#execReviewGetAll();
          break;
        case 'github-review-update':
          returnData = await this.#execReviewUpdate();
          break;
        case 'github-user-repos':
          returnData = await this.#execUserRepos();
          break;
        case 'github-user-org-invite':
          returnData = await this.#execUserOrgInvite();
          break;
        case 'github-org-repos-get':
          returnData = await this.#execUserOrgInvite();
          break;
        default:
          throw new Error(
            `The operation "${props.req.params.toolType}" is not known!`
          );
      }
    } catch (error) {
      if (isApiErrorResponse(error)) {
        if (isRichApiErrorResponse(error))
          console.error(error.response.data.error.message);
        console.error(error.stack);
      } else if (error) console.trace(error);
      throw new Error(`Unknown error at ${this.constructor.name}`);
    }

    return Result.ok(returnData);
  }

  #execFileCreate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.fileCreateParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { additionalParameters, commitMessage, fileContent, filePath } =
      this.#params.fileCreateParamType;

    const requestMethod = 'PUT';

    const body: Record<string, unknown> = {};
    if (additionalParameters?.author) {
      body.author = additionalParameters.author;
    }
    if (additionalParameters?.committer) {
      body.committer = additionalParameters.committer;
    }
    if (
      additionalParameters?.branch &&
      (additionalParameters.branch as Record<string, unknown>).branch
    ) {
      body.branch = (
        additionalParameters.branch as Record<string, unknown>
      ).branch;
    }

    body.message = commitMessage;

    body.content = Buffer.from(fileContent).toString('base64');

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/contents/${encodeURI(filePath)}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execFileDelete = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.fileDeleteParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { additionalParameters, filePath, commitMessage } =
      this.#params.fileDeleteParamType;

    const requestMethod = 'DELETE';

    const body: Record<string, unknown> = {};
    if (additionalParameters?.author) {
      body.author = additionalParameters.author;
    }
    if (additionalParameters?.committer) {
      body.committer = additionalParameters.committer;
    }
    if (
      additionalParameters?.branch &&
      (additionalParameters.branch as Record<string, unknown>).branch
    ) {
      body.branch = (
        additionalParameters.branch as Record<string, unknown>
      ).branch;
    }

    body.message = commitMessage;

    body.sha = await this.#getFileSha(
      filePath,
      body.branch as string | undefined
    );

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/contents/${encodeURI(filePath)}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execFileEdit = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.fileEditParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { additionalParameters, commitMessage, fileContent, filePath } =
      this.#params.fileEditParamType;

    const requestMethod = 'PUT';

    const body: Record<string, unknown> = {};
    if (additionalParameters?.author) {
      body.author = additionalParameters.author;
    }
    if (additionalParameters?.committer) {
      body.committer = additionalParameters.committer;
    }
    if (
      additionalParameters?.branch &&
      (additionalParameters.branch as Record<string, unknown>).branch
    ) {
      body.branch = (
        additionalParameters.branch as Record<string, unknown>
      ).branch;
    }

    body.sha = await this.#getFileSha(
      filePath,
      body.branch as string | undefined
    );

    body.message = commitMessage;

    body.content = Buffer.from(fileContent).toString('base64');

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/contents/${encodeURI(filePath)}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execFileGet = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.fileGetParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { filePath, additionalParameters } = this.#params.fileGetParamType;

    const requestMethod = 'GET';

    const qs: Record<string, string | string[]> = {};
    if (additionalParameters?.reference) {
      qs.ref = additionalParameters.reference;
    }

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/contents/${encodeURI(filePath)}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      undefined,
      qs
    );

    return apiResponse.data;
  };

  #execIssueCreate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.issueCreateParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { title, body, labels, assignees } =
      this.#params.issueCreateParamType;

    const requestMethod = 'POST';
    const data: Record<string, unknown> = {};
    data.title = title;
    data.body = body;

    if (labels) data.labels = labels.map((data) => data.label);

    if (assignees) data.assignees = assignees.map((data) => data.assignee);

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/issues`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      data
    );

    return apiResponse.data;
  };

  #execIssueCommentCreate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.issueCreateCommentParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { issueNumber, body } = this.#params.issueCreateCommentParamType;

    const requestMethod = 'POST';

    const data: Record<string, unknown> = { body };

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/issues/${issueNumber}/comments`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      data
    );

    return apiResponse.data;
  };

  #execIssueEdit = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.issueEditParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { issueNumber } = this.#params.issueEditParamType;

    const requestMethod = 'PATCH';

    const body: Record<string, unknown> = {};
    if (body.labels !== undefined) {
      body.labels = (body.labels as Array<Record<string, unknown>>).map(
        (data) => data.label
      );
    }
    if (body.assignees !== undefined) {
      body.assignees = (body.assignees as Array<Record<string, unknown>>).map(
        (data) => data.assignee
      );
    }

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/issues/${issueNumber}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execIssueGet = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.issueGetParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { issueNumber } = this.#params.issueGetParamType;

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/issues/${issueNumber}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execIssueLock = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.issueLockParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { issueNumber, lockReason } = this.#params.issueLockParamType;

    const requestMethod = 'PUT';

    const qs: Record<string, string | string[]> = {};
    if (lockReason) qs.lock_reason = lockReason;

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/issues/${issueNumber}/lock`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      undefined,
      qs
    );

    return apiResponse.data;
  };

  #execRepoGet = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params) throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${this.#params.repository}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execRepoLicense = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params) throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/license`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execRepoIssues = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.repositoryGetIssuesParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { getRepositoryIssuesFilters, returnAll, limit } =
      this.#params.repositoryGetIssuesParamType;

    const requestMethod = 'GET';

    const qs: Record<string, string | string[]> =
      getRepositoryIssuesFilters || {};

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/issues`;

    if (!returnAll && limit) {
      qs.per_page = limit.toString();
    }

    let apiResponse: ApiResponse;
    if (returnAll) {
      apiResponse = await this.#api.apiRequestAllItems({
        method: requestMethod,
        endpoint,
        authToken: this.#auth.token,
        query: qs,
      });
    } else {
      apiResponse = await this.#api.apiRequest(
        requestMethod,
        endpoint,
        this.#auth.token,
        undefined,
        qs
      );
    }

    return apiResponse.data;
  };

  #execRepoTopPaths = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.repositoryGetIssuesParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/traffic/popular/paths`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execRepoTopDomains = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.repositoryGetIssuesParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/traffic/popular/referrers`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execReleaseCreate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.releaseCreateParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { additionalFields, releaseTag } =
      this.#params.releaseCreateParamType;

    const requestMethod = 'POST';

    const body: Record<string, unknown> = { ...additionalFields } || {};

    body.tag_name = releaseTag;

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/releases`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execReleaseGet = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.releaseGetParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { releaseId } = this.#params.releaseGetParamType;

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/releases/${releaseId}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execReleaseGetAll = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.releaseGetAllParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { returnAll, limit } = this.#params.releaseGetAllParamType;

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/releases`;

    const qs: Record<string, string | string[]> = {};
    if (!returnAll && limit) {
      qs.per_page = limit.toString();
    }

    let apiResponse: ApiResponse;
    if (returnAll) {
      apiResponse = await this.#api.apiRequestAllItems({
        method: requestMethod,
        endpoint,
        authToken: this.#auth.token,
        query: qs,
      });
    } else {
      apiResponse = await this.#api.apiRequest(
        requestMethod,
        endpoint,
        this.#auth.token,
        undefined,
        qs
      );
    }

    return apiResponse.data;
  };

  #execReleaseDelete = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.releaseDeleteParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { releaseId } = this.#params.releaseDeleteParamType;

    const requestMethod = 'DELETE';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/releases/${releaseId}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execReleaseUpdate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.releaseUpdateParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { releaseId, additionalFields } = this.#params.releaseUpdateParamType;

    const requestMethod = 'PATCH';

    const body = additionalFields;

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/releases/${releaseId}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execReviewCreate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.reviewCreateParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { pullRequestNumber, additionalFields, event, body } =
      this.#params.reviewCreateParamType;

    const requestMethod = 'POST';

    const data: Record<string, unknown> | undefined = additionalFields;

    if (data) {
      data.event = event;
      if (event === 'requestChanges' || event === 'comment') data.body = body;
    }

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/pulls/${pullRequestNumber}/reviews`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      data
    );

    return apiResponse.data;
  };

  #execReviewGet = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.reviewGetParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { reviewId, pullRequestNumber } = this.#params.reviewGetParamType;

    const requestMethod = 'GET';

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/pulls/${pullRequestNumber}/reviews/${reviewId}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token
    );

    return apiResponse.data;
  };

  #execReviewGetAll = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.reviewGetAllParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { returnAll, pullRequestNumber, limit } =
      this.#params.reviewGetAllParamType;

    const requestMethod = 'GET';

    const qs: Record<string, string | string[]> | undefined =
      !returnAll && limit ? { per_page: limit.toString() } : undefined;

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/pulls/${pullRequestNumber}/reviews`;

    let apiResponse: ApiResponse;
    if (returnAll) {
      apiResponse = await this.#api.apiRequestAllItems({
        method: requestMethod,
        endpoint,
        authToken: this.#auth.token,
        query: qs,
      });
    } else {
      apiResponse = await this.#api.apiRequest(
        requestMethod,
        endpoint,
        this.#auth.token,
        undefined,
        qs
      );
    }

    return apiResponse.data;
  };

  #execReviewUpdate = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.reviewUpdateParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { pullRequestNumber, reviewId, body } =
      this.#params.reviewUpdateParamType;

    const requestMethod = 'PUT';

    const data = { body };

    const endpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/pulls/${pullRequestNumber}/reviews/${reviewId}`;

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      data
    );

    return apiResponse.data;
  };

  #execUserRepos = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.userGetRepositoriesParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { returnAll, limit } = this.#params.userGetRepositoriesParamType;

    const requestMethod = 'GET';

    const endpoint = `/users/${this.#params.owner}/repos`;

    const qs: Record<string, string | string[]> | undefined =
      !returnAll && limit ? { per_page: limit.toString() } : undefined;

    let apiResponse: ApiResponse;
    if (returnAll) {
      apiResponse = await this.#api.apiRequestAllItems({
        method: requestMethod,
        endpoint,
        authToken: this.#auth.token,
        query: qs,
      });
    } else {
      apiResponse = await this.#api.apiRequest(
        requestMethod,
        endpoint,
        this.#auth.token,
        undefined,
        qs
      );
    }

    return apiResponse.data;
  };

  #execUserOrgInvite = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.userInviteParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { organization, email } = this.#params.userInviteParamType;

    const requestMethod = 'POST';
    const endpoint = `/orgs/${organization}/invitations`;

    const body = { email };

    const apiResponse = await this.#api.apiRequest(
      requestMethod,
      endpoint,
      this.#auth.token,
      body
    );

    return apiResponse.data;
  };

  #execOrgReposGet = async (): Promise<ApiResponseData | undefined> => {
    if (!this.#params?.organizationGetRepositoriesParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const { returnAll, limit } =
      this.#params.organizationGetRepositoriesParamType;

    const requestMethod = 'GET';

    const endpoint = `/orgs/${this.#params.owner}/repos`;

    const qs: Record<string, string | string[]> | undefined =
      !returnAll && limit ? { per_page: limit.toString() } : undefined;

    let apiResponse: ApiResponse;
    if (returnAll) {
      apiResponse = await this.#api.apiRequestAllItems({
        method: requestMethod,
        endpoint,
        authToken: this.#auth.token,
        query: qs,
      });
    } else {
      apiResponse = await this.#api.apiRequest(
        requestMethod,
        endpoint,
        this.#auth.token,
        undefined,
        qs
      );
    }

    return apiResponse.data;
  };

  #getFileSha = async (filePath: string, branch?: string): Promise<any> => {
    if (!this.#params?.organizationGetRepositoriesParamType)
      throw new Error('Operation specific params missing');
    if (!this.#auth) throw new Error('Auth missing');
    if (!this.#api) throw new Error('Api missing');

    const getBody: Record<string, unknown> = {};
    if (branch !== undefined) {
      getBody.branch = branch;
    }
    const getEndpoint = `/repos/${this.#params.owner}/${
      this.#params.repository
    }/contents/${encodeURI(filePath)}`;
    const apiResponse = await this.#api.apiRequest(
      'GET',
      getEndpoint,
      this.#auth.token,
      getBody
    );

    if (!apiResponse.data || apiResponse.data.sha) {
      throw new Error('Could not get the SHA of the file.');
    }

    return apiResponse.data.sha;
  };
}
