import { DefineOAuth2Provider, Schema} from "deno-slack-sdk/mod.ts";

export const AtlassianProvider = DefineOAuth2Provider({
  provider_key: "atlassian",
  provider_type: Schema.providers.oauth2.CUSTOM,
  options: {
    "provider_name": "Atlassian",
    "authorization_url": "https://auth.atlassian.com/authorize",
    "token_url": "https://auth.atlassian.com/oauth/token",
    "client_id":
      "TcRihRBvODs8ZaHqoPasOGjRUCNi0pyR",
    "client_secret_env_key": "jira_client_secret",
    "scope": [
      "read:jira-work",
      "manage:jira-project",
      "manage:jira-configuration",
      "read:jira-user",
      "write:jira-work",
      "manage:jira-webhook",
      "manage:jira-data-provider",
      "read:me",
      "read:account",
      "offline_access",
      "read:servicedesk-request",
      "manage:servicedesk-customer",
      "write:servicedesk-request",
      "read:servicemanagement-insight-objects",
    ],
    "authorization_url_extras": {
      "prompt": "consent",
      "audience": "api.atlassian.com",
    },
    "identity_config": {
      "url": "https://api.atlassian.com/me",
      "account_identifier": "$.email",
    },
  },
});