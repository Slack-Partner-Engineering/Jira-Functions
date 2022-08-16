import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const UpdateStatus = DefineFunction({
  callback_id: "update_status",
  title: "Update the status of an issue",
  description: "Update the status of an issue in Jira right from Slack.",
  source_file: "functions/update_status/mod.ts",
  input_parameters: {
    properties: {
      issueKey: {
        type: Schema.types.string,
        description: "The key of the issue to update.",
      },
      status: {
        type: Schema.types.string,
        description:
          "Status: To Do, In Progress, In Review, Done",
        enum: ["11", "21", "31", "41"],
        choices: [{
          title: "To Do",
          value: "11",
        }, {
          title: "In Progress",
          value: "21",
        }, {
          title: "In Review",
          value: "31",
        },
        {
          title: "Done",
          value: "41",
        }],
      },
      currentUser: {
        type: Schema.slack.types.user_id,
        description: "User who updated the status.",
      },
    },
    required: ["issueKey", "status", "currentUser"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});