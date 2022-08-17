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
        description: "Key of the issue to look for",
      },
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who is searching for these issues.",
      }
    },
    required: ["assignee"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});