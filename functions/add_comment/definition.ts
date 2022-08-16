import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const AddComment = DefineFunction({
  callback_id: "add_comment",
  title: "Add a Comment",
  description: "Add a comment to an issue in Jira right from Slack.",
  source_file: "functions/add_comment/mod.ts",
  input_parameters: {
    properties: {
      issueKey: {
        type: Schema.types.string,
        description: "The key of the issue to add a comment to.",
      },
      comment: {
        type: Schema.types.string,
        description: "Comment to add.",
      },
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who added the comment.",
      },
    },
    required: ["issueKey", "comment", "currentUser"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});