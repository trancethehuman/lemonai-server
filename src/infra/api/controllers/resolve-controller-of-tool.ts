import { type Request } from 'express';
import { parseToolType } from '../../../domain/value-types/tool';
import app from '../../../ioc-container';
import RunToolController from './run-tool-controller';
import {
  type GetArticleHackerNews,
  type GetArticleHackerNewsReq,
  type GetArticleHackerNewsRes,
} from '../../../domain/use-cases/hacker-news/get-article';
import {
  type GetUserHackerNews,
  type GetUserHackerNewsReq,
  type GetUserHackerNewsRes,
} from '../../../domain/use-cases/hacker-news/get-user';
import {
  type ExecuteAirtableOperationAuth,
  type ExecuteAirtableOperationReq,
  type ExecuteAirtableOperationRes,
} from '../../../domain/use-cases/execute-airtable-operation';
import {
  type ExecuteSlackOperationAuth,
  type ExecuteSlackOperationReq,
  type ExecuteSlackOperationRes,
} from '../../../domain/use-cases/execute-slack-operation';
import {
  type ExecuteHubSpotOperationAuth,
  type ExecuteHubSpotOperationReq,
  type ExecuteHubSpotOperationRes,
} from '../../../domain/use-cases/execute-hubspot-operation';
import { type SlackApi } from '../../external/slack-api';
import { type HubSpotApi } from '../../external/hubspot-api';
import { type AirtableApi } from '../../external/airtable-api';
import {
  type ExecuteGithubOperationRes,
  type ExecuteGithubOperationReq,
  type ExecuteGithubOperationAuth,
} from '../../../domain/use-cases/execute-github-operation';
import { type GithubApi } from '../../external/github-api';
import { type ExecuteNotionOperationAuth, type ExecuteNotionOperationReq, type ExecuteNotionOperationRes } from '../../../domain/use-cases/execute-notion-operation';
import { type NotionApi } from '../../external/notion-api';

type Controller =
  | RunToolController<GetArticleHackerNewsReq, GetArticleHackerNewsRes>
  | RunToolController<GetUserHackerNewsReq, GetUserHackerNewsRes>
  | RunToolController<
      ExecuteAirtableOperationReq,
      ExecuteAirtableOperationRes,
      ExecuteAirtableOperationAuth,
      AirtableApi
    >
  | RunToolController<
      ExecuteSlackOperationReq,
      ExecuteSlackOperationRes,
      ExecuteSlackOperationAuth,
      SlackApi
    >
  | RunToolController<
      ExecuteGithubOperationReq,
      ExecuteGithubOperationRes,
      ExecuteGithubOperationAuth,
      GithubApi
    >
  | RunToolController<
      ExecuteHubSpotOperationReq,
      ExecuteHubSpotOperationRes,
      ExecuteHubSpotOperationAuth,
      HubSpotApi
    >
  | RunToolController<
      ExecuteNotionOperationReq,
      ExecuteNotionOperationRes,
      ExecuteNotionOperationAuth,
      NotionApi>;

const buildAirtableAuth = (
  httpRequest: Request
): ExecuteAirtableOperationAuth => ({
  token: httpRequest.body.authToken,
});
const buildHackernewsAuth = (httpRequest: Request): undefined => undefined;

const buildSlackAuth = (httpRequest: Request): ExecuteSlackOperationAuth => ({
  token: httpRequest.body.authToken,
  type: httpRequest.body.authType,
});

const buildHubSpotAuth = (
  httpRequest: Request
): ExecuteHubSpotOperationAuth => ({
  token: httpRequest.body.authToken,
  type: httpRequest.body.authType,
});

const buildGithubAuth = (
  httpRequest: Request
): ExecuteHubSpotOperationAuth => ({
  token: httpRequest.body.authToken,
  type: httpRequest.body.authType,
});

const buildNotionAuth = (
  httpRequest: Request
): ExecuteNotionOperationAuth => ({
  token: httpRequest.body.authToken,
  type: httpRequest.body.authType,
})

const getExecuteSlackOperationController = (
  buildReq: (httpRequest: Request) => ExecuteSlackOperationReq
): Controller =>
  new RunToolController<
    ExecuteSlackOperationReq,
    ExecuteSlackOperationRes,
    ExecuteSlackOperationAuth,
    SlackApi
  >(
    buildReq,
    app.resolve('executeSlackOperation'),
    buildSlackAuth,
    app.resolve('slackApi')
  );

const getExecuteHubSpotOperationController = (
  buildReq: (httpRequest: Request) => ExecuteHubSpotOperationReq
): Controller =>
  new RunToolController<
    ExecuteHubSpotOperationReq,
    ExecuteHubSpotOperationRes,
    ExecuteHubSpotOperationAuth,
    HubSpotApi
  >(
    buildReq,
    app.resolve('executeHubSpotOperation'),
    buildHubSpotAuth,
    app.resolve('hubSpotApi')
  );

const getExecuteGithubOperationController = (
  buildReq: (httpRequest: Request) => ExecuteGithubOperationReq
): Controller =>
  new RunToolController<
    ExecuteGithubOperationReq,
    ExecuteGithubOperationRes,
    ExecuteGithubOperationAuth,
    GithubApi
  >(
    buildReq,
    app.resolve('executeGithubOperation'),
    buildGithubAuth,
    app.resolve('githubApi')
  );

  const getExecuteNotionOperationController = (
    buildReq: (httpRequest: Request) => ExecuteNotionOperationReq
  ): Controller =>
    new RunToolController<
      ExecuteNotionOperationReq,
      ExecuteNotionOperationRes,
      ExecuteNotionOperationAuth,
      NotionApi
    >(
      buildReq,
      app.resolve('executeNotionOperation'),
      buildNotionAuth,
      app.resolve('notionApi')
    );

const getExecuteAirtableOperationController = (
  buildReq: (httpRequest: Request) => ExecuteAirtableOperationReq
): Controller =>
  new RunToolController<
    ExecuteAirtableOperationReq,
    ExecuteAirtableOperationRes,
    ExecuteAirtableOperationAuth,
    AirtableApi
  >(
    buildReq,
    app.resolve('executeAirtableOperation'),
    buildAirtableAuth,
    app.resolve('airtableApi')
  );

export default (toolId: string): Controller => {
  const toolType = parseToolType(toolId);

  const hackernewsApi = app.resolve('hackernewsApi');

  switch (toolType) {
    case 'airtable-append-data': {
      const buildReq = (httpRequest: Request): ExecuteAirtableOperationReq => {
        const { baseId, tableId, fieldNamesToLoad, data, typecast, bulkSize } =
          httpRequest.body;

        const options =
          typecast !== undefined || bulkSize !== undefined
            ? { typecast, bulkSize }
            : undefined;

        return {
          params: {
            toolType,
            baseId,
            tableId,

            appendParams: {
              fieldNamesToLoad,
              data: Array.isArray(data) ? data : [data],
              options,
            },
          },
        };
      };

      return getExecuteAirtableOperationController(buildReq);
    }
    case 'airtable-delete-data': {
      const buildReq = (httpRequest: Request): ExecuteAirtableOperationReq => {
        const { baseId, tableId, id, bulkSize } = httpRequest.body;

        const options = bulkSize !== undefined ? { bulkSize } : undefined;

        return {
          params: {
            toolType,
            baseId,
            tableId,
            deleteParams: { id, options },
          },
        };
      };

      return getExecuteAirtableOperationController(buildReq);
    }
    case 'airtable-read-data': {
      const buildReq = (httpRequest: Request): ExecuteAirtableOperationReq => {
        const { baseId, tableId, id } = httpRequest.body;

        return {
          params: {
            toolType,
            baseId,
            tableId,
            readParams: { id },
          },
        };
      };

      return getExecuteAirtableOperationController(buildReq);
    }
    case 'airtable-list-data': {
      const buildReq = (httpRequest: Request): ExecuteAirtableOperationReq => {
        const { baseId, tableId, limit } = httpRequest.body;

        return {
          params: {
            toolType,
            baseId,
            tableId,
            listParams: { limit },
          },
        };
      };

      return getExecuteAirtableOperationController(buildReq);
    }
    case 'airtable-update-data': {
      const buildReq = (httpRequest: Request): ExecuteAirtableOperationReq => {
        const {
          baseId,
          tableId,
          fieldNamesToUpdate,
          id,
          data,
          typecast,
          bulkSize,
          ignoreFields,
        } = httpRequest.body;

        const options =
          typecast !== undefined ||
          bulkSize !== undefined ||
          ignoreFields !== undefined
            ? { typecast, bulkSize }
            : undefined;

        return {
          params: {
            toolType,
            baseId,
            tableId,
            updateParams: { fieldNamesToUpdate, data, id, options },
          },
        };
      };

      return getExecuteAirtableOperationController(buildReq);
    }
    case 'hackernews-get-article': {
      const buildReq = (httpRequest: Request): GetArticleHackerNewsReq => {
        const { articleId, includeComments } = httpRequest.body;
        return {
          params: { articleId, additionalFields: { includeComments } },
        };
      };

      const useCase: GetArticleHackerNews = app.resolve('getArticleHackerNews');

      return new RunToolController<
        GetArticleHackerNewsReq,
        GetArticleHackerNewsRes
      >(buildReq, useCase, () => undefined, hackernewsApi);
    }
    case 'hackernews-get-user': {
      const buildReq = (httpRequest: Request): GetUserHackerNewsReq => {
        const { username } = httpRequest.body;
        return {
          params: { username },
        };
      };

      const useCase: GetUserHackerNews = app.resolve('getUserHackerNews');

      return new RunToolController<GetUserHackerNewsReq, GetUserHackerNewsRes>(
        buildReq,
        useCase,
        buildHackernewsAuth,
        hackernewsApi
      );
    }

    case 'slack-channel-archive': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelArchiveParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-close': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelCloseParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-create': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelCreateParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-kick': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelKickParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-join': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelJoinParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-get': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelGetParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-get-many': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelGetAllParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-history': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelHistoryParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-invite': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelInviteParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-leave': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelLeaveParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-member': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelMemberParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-open': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelOpenParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-rename': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelRenameParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-reply': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelRepliesParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-set-purpose': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelSetPurposeParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-set-topic': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, channelSetTopicParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-channel-unarchive': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            channelUnarchiveParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-message-send': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            messagePostParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-message-update': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, messageUpdateParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-message-delete': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, messageDeleteParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-message-get-permalink': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            messageGetPermalinkParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-message-search': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, messageSearchParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-reaction-add': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, reactionAddParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-reaction-remove': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, reactionRemoveParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-reaction-get': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, reactionGetParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-star-add': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, starAddParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-star-delete': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, starDeleteParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-star-get-many': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, starGetAllParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-file-get-many': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, fileGetAllParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-file-get': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, fileGetParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-get': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userInfoParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-get-many': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userGetAllParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-update-profile': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            userUpdateProfileParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-get-status': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userGetPresenceParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-group-create': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userGroupCreateParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-group-enable': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userGroupEnableParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-group-disable': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: {
            toolType,
            userGroupDisableParams: httpRequest.body,
          },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-group-get-many': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userGroupGetAllParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'slack-user-group-update': {
      const buildReq = (httpRequest: Request): ExecuteSlackOperationReq => {
        return {
          params: { toolType, userGroupUpdateParams: httpRequest.body },
        };
      };

      return getExecuteSlackOperationController(buildReq);
    }
    case 'hubspot-create-update-contact': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactUpsertParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-delete-contact': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactDeleteParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-contact': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactGetParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-all-contacts': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactGetAllParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-recently-created-updated-contacts': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: {
            toolType,
            contactGetRecentlyCreatedUpdatedParams: httpReq.body,
          },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-search-contacts': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactSearchParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-add-contact-to-list': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactListAddParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-remove-contact-from-list': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, contactListRemoveParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-create-company': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, companyCreateParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-delete-company': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, companyDeleteParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-company': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, companyGetParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-all-companies': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, companyGetAllParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-recently-created-updated-companies': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: {
            toolType,
            companyGetRecentlyCreatedUpdatedParams: httpReq.body,
          },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-search-companies-by-domain': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, companySearchByDomainParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-update-company': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, companyUpdateParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-create-deal': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, dealCreateParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-delete-deal': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, dealDeleteParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-deal': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, dealGetParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-all-deals': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, dealGetAllParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-recently-created-updated-deals': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: {
            toolType,
            dealGetRecentlyCreatedUpdatedParams: httpReq.body,
          },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-search-deals': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, dealSearchParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-update-deal': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, dealUpdateParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-create-an-engagement': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, engagementCreateParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-delete-an-engagement': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, engagementDeleteParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-an-engagement': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, engagementGetParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-all-engagements': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, engagementGetAllParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-fields-form': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, formGetFieldsParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-create-ticket': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, ticketCreateParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-delete-ticket': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, ticketDeleteParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-ticket': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, ticketGetParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'hubspot-get-all-tickets': {
      const buildReq = (httpReq: Request): ExecuteHubSpotOperationReq => {
        return {
          params: { toolType, ticketGetAllParams: httpReq.body },
        };
      };

      return getExecuteHubSpotOperationController(buildReq);
    }
    case 'github-file-create': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            fileCreateParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-file-delete': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            fileDeleteParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-file-edit': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            fileEditParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-file-get': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            fileGetParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-issue-create': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            issueCreateParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-issue-comment': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            issueCreateCommentParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-issue-edit': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            issueEditParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-issue-get': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            issueGetParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-issue-lock': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            issueLockParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-repo-get': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            repositoryGetIssuesParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-repo-license': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-repo-issues': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            repositoryGetIssuesParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-repo-top-paths': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-repo-top-domains': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-release-create': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            releaseCreateParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-release-get': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            releaseGetAllParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-release-get-all': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            releaseGetAllParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-release-delete': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            releaseDeleteParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-release-update': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            releaseUpdateParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-review-create': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            reviewCreateParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-review-get': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            reviewGetParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-review-get-all': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            reviewGetAllParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-review-update': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            reviewUpdateParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-user-repos': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            userGetRepositoriesParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-user-org-invite': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            userInviteParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }
    case 'github-org-repos-get': {
      const buildReq = (httpReq: Request): ExecuteGithubOperationReq => {
        const { owner, repository, ...remainingBody } = httpReq.body;

        return {
          params: {
            toolType,
            owner,
            repository,
            organizationGetRepositoriesParamType: remainingBody,
          },
        };
      };

      return getExecuteGithubOperationController(buildReq);
    }

    case 'notion-append-after-block': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            blockAppendParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }

    case 'notion-get-child-blocks': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            blockGetAllParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }

    case 'notion-get-database': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databaseGetParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }

    case 'notion-get-many-database': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databaseGetAllParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }

    case 'notion-search-database': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databaseSearchParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-create-database-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databasePageCreateParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-get-database-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databasePageGetParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-get-many-database-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databasePageGetAllParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-update-database-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            databasePageUpdateParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-archive-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            pageArchiveParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-create-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            pageCreateParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-search-page': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            pageSearchParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }
    case 'notion-get-user': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            userGetParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }

    case 'notion-get-many-user': {
      const buildReq = (httpReq: Request): ExecuteNotionOperationReq => {

        return {
          params: {
            toolType,
            userGetAllParamTypes: httpReq.body,
          },
        };
      };

      return getExecuteNotionOperationController(buildReq);
    }

    default:
      throw new Error(`Tool ${toolId} not found`);
  }
};
