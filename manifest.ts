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


export const AddComment = DefineFunction({
  callback_id: "add_comment",
  title: "Add a Comment",
  description: "Add a comment to an issue in Jira right from Slack.",
  source_file: "functions/add_comment.ts",
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
      creator: {
        type: Schema.slack.types.user_id,
        description: "User who added the comment.",
      },
    },
    required: ["issueKey", "comment", "creator"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default Manifest({
  name: "Jira on Platform 2.0",
  description: "Create, Update, Find, and Close Jira Tickets all from Slack.",
  icon: "assets/icon.png",
  functions: [FindIssueByID, CreateIssue, AddComment],
  outgoingDomains: ["horeaporutiu.atlassian.net"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read", "im:write"],
});

