import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const FindIssueByID = DefineFunction({
  callback_id: "find_issue_by_id",
  title: "Find an Issue",
  description: "Find an issue in Jira right from Slack.",
  source_file: "functions/find_issue_by_id/mod.ts",
  input_parameters: {
    properties: {
      issueKey: {
        type: Schema.types.string,
        description: "Key of the issue to look for",
      },
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who is searching for the issue.",
      },
    },
    required: ["issueKey"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});