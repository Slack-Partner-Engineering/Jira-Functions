import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";

export const CreateIssue = DefineFunction({
  callback_id: "create_issue",
  title: "Create an Issue",
  description: "Create an issue in Jira right from Slack.",
  source_file: "functions/create_issue/mod.ts",
  input_parameters: {
    properties: {
      summary: {
        type: Schema.types.string,
        description: "Summary of the bug or issue to create.",
      },
      description: {
        type: Schema.types.string,
        description: "Description of the bug or issue to create.",
      },
      issueType: {
        type: Schema.types.string,
        description:
          "Type of issue to create: Bug, Improvement, New Feature, or Epic.",
        default: "Bug",
        enum: ["Bug", "Improvement", "New Feature", "Epic"],
        choices: [{
          title: "Bug",
          value: "Bug",
        }, {
          title: "Improvement",
          value: "Improvement",
        }, {
          title: "New Feature",
          value: "New Feature",
        }],
      },
      status: {
        type: Schema.types.string,
        description:
          "Status: To Do, In Progress, In Review, Done",
        default: "To Do",
        enum: ["To Do", "In Progress", "In Review", "Done"],
        choices: [{
          title: "To Do",
          value: "To Do",
        }, {
          title: "In Progress",
          value: "In Progress",
        }, {
          title: "In Review",
          value: "In Review",
        },
        {
          title: "Done",
          value: "Done",
        }],
      },
      creator: {
        type: Schema.slack.types.user_id,
        description: "User who created the ticket",
      },
      assigned_to: {
        type: Schema.slack.types.user_id,
        description: "User who should work on this.",
      }
    },
    required: ["description", "issueType"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});
