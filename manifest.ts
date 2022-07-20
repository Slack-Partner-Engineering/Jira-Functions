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
      searcher: {
        type: Schema.slack.types.user_id,
        description: "User who is searching for the issue.",
      }
    },
    required: ["issueKey", "searcher"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export const FindIssueByAssignee = DefineFunction({
  callback_id: "find_issue_by_assignee",
  title: "Find an Issue by Assignee",
  description: "Find issues which are assigned to a certain person right from Slack.",
  source_file: "functions/find_issue_by_assignee.ts",
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
      }
    },
    required: ["assignee", "searcher"],
  },
  output_parameters: {
    properties: {},
    required: [],
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


export const UpdateIssue = DefineFunction({
  callback_id: "update_issue",
  title: "Update an existing issue",
  description: "Update an issue in Jira right from Slack.",
  source_file: "functions/update_issue.ts",
  input_parameters: {
    properties: {
      issueKey: {
        type: Schema.types.string,
        description: "The key of the issue to update.",
      },
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
      assignee: {
        type: Schema.types.string,
        description:
          "Who to assign the issue to.",
        enum: ["557058:f9bcdb25-24a5-4501-927c-588b632c764e", "62c4acef9763a5e6026facf0", "62c4ac6db6357aecd7c6caff"],
        choices: [{
          title: "Horea Porutiu",
          value: "557058:f9bcdb25-24a5-4501-927c-588b632c764e",
        }, {
          title: "Lauren Hooper",
          value: "62c4acef9763a5e6026facf0",
        }, {
          title: "Test User",
          value: "62c4ac6db6357aecd7c6caff",
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
      updator: {
        type: Schema.slack.types.user_id,
        description: "User who is updating the issue.",
      },
    },
    required: ["issueKey", "updator"],
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

export const UpdateStatus = DefineFunction({
  callback_id: "update_status",
  title: "Update the status of an issue",
  description: "Update the status of an issue in Jira right from Slack.",
  source_file: "functions/update_status.ts",
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
      updator: {
        type: Schema.slack.types.user_id,
        description: "User who updated the status.",
      },
    },
    required: ["issueKey", "status", "updator"],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default Manifest({
  name: "Jira Functions Deployed",
  description: "Create, Update, Find, and Close Jira Tickets all from Slack.",
  icon: "assets/icon.png",
  functions: [FindIssueByID, FindIssueByAssignee, CreateIssue, AddComment, UpdateIssue, UpdateStatus],
  outgoingDomains: ["horeaporutiu.atlassian.net"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read", "im:write"],
});

