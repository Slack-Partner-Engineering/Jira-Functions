import { DefineFunction, Manifest, Schema } from "deno-slack-sdk/mod.ts";

export const FindIssueByID = DefineFunction({
  callback_id: "find_issue_by_id",
  title: "Find an Issue",
  description: "Find an issue in Jira right from Slack.",
  source_file: "functions/find_issue_by_id.ts",
  input_parameters: {
    properties: {
      issueKey: {
        type: Schema.types.string,
        description: "Key of the issue to look for",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post the issue information in.",
      },
    },
    required: ["channel"],
  },
  output_parameters: {
    properties: {
      JiraResponse: {
        type: Schema.types.string,
        description: "The API response from Jira",
      },
    },
    required: ["JiraResponse"],
  },
});

export const CreateIssue = DefineFunction({
  callback_id: "create_issue",
  title: "Create an Issue",
  description: "Create an issue in Jira right from Slack.",
  source_file: "functions/create_issue.ts",
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
        }, {
          title: "Epic",
          value: "Epic",
        }],
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post the issue information in.",
      },
    },
    required: ["description", "issueType", "channel"],
  },
  output_parameters: {
    properties: {
      JiraResponse: {
        type: Schema.types.string,
        description: "The API response from Jira",
      },
    },
    required: ["JiraResponse"],
  },
});

export default Manifest({
  name: "Jira on Platform 2.0",
  description: "Create, Update, Find, and Close Jira Tickets all from Slack.",
  icon: "assets/icon.png",
  functions: [FindIssueByID, CreateIssue],
  outgoingDomains: ["horeaporutiu.atlassian.net"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read"],
});

