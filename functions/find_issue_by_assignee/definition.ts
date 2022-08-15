import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const FindIssueByAssignee = DefineFunction({
  callback_id: "find_issue_by_assignee",
  title: "Find an Issue by Assignee",
  description: "Find issues which are assigned to a certain person right from Slack.",
  source_file: "functions/find_issue_by_assignee/mod.ts",
  input_parameters: {
    properties: {
      assignee: {
        type: Schema.types.string,
        description:
          "Get issues assigned to which user?",
        enum: ["Horea Porutiu", "Lauren Hooper", "Test"],
        choices: [{
          title: "Horea Porutiu",
          value: "Horea Porutiu",
        }, {
          title: "Lauren Hooper",
          value: "Lauren Hooper",
        }, {
          title: "Test User",
          value: "Test",
        }],
      },
      searcher: {
        type: Schema.slack.types.user_id,
        description: "User who is searching for these issues.",
      },
      atlassianAccessToken: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "atlassian",
        description: "Credential to use",
      },
    },
    required: ["assignee", "searcher"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});