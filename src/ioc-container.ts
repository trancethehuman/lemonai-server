import { InjectionMode, asClass, createContainer } from 'awilix';
import { GetUserHackerNews } from './domain/use-cases/hacker-news/get-user';
import { GetArticleHackerNews } from './domain/use-cases/hacker-news/get-article';
import { GetTools } from './domain/use-cases/get-tools';
import { ExecuteAirtableOperation } from './domain/use-cases/execute-airtable-operation';
import { ExecuteSlackOperation } from './domain/use-cases/execute-slack-operation';
import { ExecuteHubSpotOperation } from './domain/use-cases/execute-hubspot-operation';
import { SlackApi } from './infra/external/slack-api';
import { AirtableApi } from './infra/external/airtable-api';
import { HubSpotApi } from './infra/external/hubspot-api';
import { HackernewsApi } from './infra/external/hacker-news-api';
import { GithubApi } from './infra/external/github-api';
import { ExecuteGithubOperation } from './domain/use-cases/execute-github-operation';

const iocContainer = createContainer({ injectionMode: InjectionMode.CLASSIC });

iocContainer.register({
  getTools: asClass(GetTools),

  getUserHackerNews: asClass(GetUserHackerNews),
  getArticleHackerNews: asClass(GetArticleHackerNews),
  executeAirtableOperation: asClass(ExecuteAirtableOperation),
  executeSlackOperation: asClass(ExecuteSlackOperation),
  executeGithubOperation: asClass(ExecuteGithubOperation),
  executeHubSpotOperation: asClass(ExecuteHubSpotOperation),

  slackApi: asClass(SlackApi),
  airtableApi: asClass(AirtableApi),
  hubSpotApi: asClass(HubSpotApi),
  hackernewsApi: asClass(HackernewsApi),
  githubApi: asClass(GithubApi),
});

export default iocContainer;
