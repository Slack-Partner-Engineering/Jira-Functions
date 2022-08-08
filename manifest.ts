import { DefineFunction, Manifest, Schema, DefineWorkflow } from "deno-slack-sdk/mod.ts";

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

// At present, this implementation requires the "hermes_workflow_tokens" toggle.
const UpdateStatusWF = DefineWorkflow({
  callback_id: "transition_issue_wf",
  title: "Transition an Issue",
  description: "Transition",
  input_parameters: {
    properties: {
      updator: {
        type: Schema.slack.types.user_id,
      },
      interactivity_context: {
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      },
    },
    required: ["updator"],
  },
});

// At present, this implementation requires the "hermes_workflow_tokens" toggle.
const CreateIssueWF = DefineWorkflow({
  callback_id: "create_issue_wf",
  title: "Create an Issue",
  description: "Create an issue",
  input_parameters: {
    properties: {
      creator: {
        type: Schema.slack.types.user_id,
      },
      interactivity_context: {
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      },
    },
    required: ["creator"],
  },
});

const FindIssueByIDWF = DefineWorkflow({
  callback_id: "find_issue_by_id_wf",
  title: "Find an Issue",
  description: "Find an Issue by ID",
  input_parameters: {
    properties: {
      searcher: {
        type: Schema.slack.types.user_id,
      },
      interactivity_context: {
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      },
    },
    required: ["searcher"],
  },
});

const AddCommentWF = DefineWorkflow({
  callback_id: "add_comment_wf",
  title: "Add a Comment",
  description: "Add a comment to an isuse",
  input_parameters: {
    properties: {
      creator: {
        type: Schema.slack.types.user_id,
      },
      interactivity_context: {
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      },
    },
    required: ["creator"],
  },
});

const AddCommentStep1 = AddCommentWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Add a Comment to a Jira issue",
      submit_label: "Submit",
      interactivity: AddCommentWF.inputs.interactivity_context,
      description: "Add a comment",
      fields: {
        elements: [
          {
            name: "issueKey",
            title: "issueKey",
            type: Schema.types.string,
            description: "Key of the issue to add a comment to for",
          },
          {
            name: "comment",
            title: "comment",
            type: Schema.types.string,
            description: "The comment to add",
          },
        ],
        required: ["issueKey", "comment"],
      },
    },
  );

  const AddCommentStep2 = AddCommentWF
  .addStep(AddComment, {
    creator: AddCommentWF.inputs.creator,
    issueKey: AddCommentStep1.outputs.fields.issueKey,
    comment: AddCommentStep1.outputs.fields.comment,
  });

const FindIssueByIDStep1 = FindIssueByIDWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Find a Jira Issue by ID",
      submit_label: "Find",
      interactivity: UpdateStatusWF.inputs.interactivity_context,
      description: "Get issue by ID",
      fields: {
        elements: [
          {
            name: "issueKey",
            title: "issueKey",
            type: Schema.types.string,
            description: "Key of the issue to search for",
          },
        ],
        required: ["issueKey"],
      },
    },
  );

  const FindIssueByIDStep2 = FindIssueByIDWF
  .addStep(FindIssueByID, {
    searcher: FindIssueByIDWF.inputs.searcher,
    issueKey: FindIssueByIDStep1.outputs.fields.issueKey,
  });


const CreateIssueStep1 = CreateIssueWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Create a new Jira Issue",
      submit_label: "Create",
      interactivity: CreateIssueWF.inputs.interactivity_context,
      description: "Create a Jira issue",
      fields: {
        elements: [
          {
            name: "summary",
            title: "Summary",
            type: Schema.types.string,
          },
          {
            name: "description",
            title: "Description",
            type: Schema.types.string,
          },
          {
            name: "issueType",
            title: "Type of issue",
            type: Schema.types.string,
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
          {
            name: "status",
            title: "Status",
            type: Schema.types.string,
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
          {
            name: "assigned_to",
            title: "Assigned to",
            type: Schema.slack.types.user_id,
          },
        ],
        required: ["summary", "issueType"],
      },
    },
  );

  const CreateIssueStep2 = CreateIssueWF
  .addStep(CreateIssue, {
    summary: CreateIssueStep1.outputs.fields.summary,
    description: CreateIssueStep1.outputs.fields.description,
    issueType: CreateIssueStep1.outputs.fields.issueType,
    status: CreateIssueStep1.outputs.fields.status,
    creator: CreateIssueWF.inputs.creator,
    assigned_to: CreateIssueStep1.outputs.fields.assigned_to,
  });

const FindByAssigneeWF = DefineWorkflow({
  callback_id: "find_issues_by_assignee_wf",
  title: "Get issues by assignee",
  description: "Get all issues assigned to a particular user",
  input_parameters: {
    properties: {
      searcher: {
        type: Schema.slack.types.user_id,
        description: "User who is searching for the issue.",
      },
      interactivity_context: {
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      },
    },
    required: ["searcher"],
  },
});

const FindByAssigneeStep1 = FindByAssigneeWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Get all Jira Issues assigned to a particular user",
      submit_label: "Transition",
      interactivity: UpdateStatusWF.inputs.interactivity_context,
      description: "Get all issues assigned to a particular user",
      fields: {
        elements: [
          {
            name: "assignee",
            title: "assignee",
            type: Schema.types.string,
            description: "User to get issues for",
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
        ],
        required: ["assignee"],
      },
    },
  );

const FindByAssigneeStep2 = FindByAssigneeWF
  .addStep(FindIssueByAssignee, {
    searcher: FindByAssigneeWF.inputs.searcher,
    assignee: FindByAssigneeStep1.outputs.fields.assignee,
  });

const UpdateStatusStep1 = UpdateStatusWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Update the status of an Jira issue",
      submit_label: "Transition",
      interactivity: UpdateStatusWF.inputs.interactivity_context,
      description: "Transition the status of an issue",
      fields: {
        elements: [
          {
            name: "issueKey",
            title: "issueKey",
            type: Schema.types.string,
            description: "The key of the issue to update",
          },
          {
            name: "status",
            title: "Status",
            type: Schema.types.string,
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
            description: "The new status of the issue",
          },
        ],
        required: ["status", "issueKey"],
      },
    },
  );

const UpdateStatusStep2 = UpdateStatusWF
  .addStep(UpdateStatus, {
    updator: UpdateStatusWF.inputs.updator,
    status: UpdateStatusStep1.outputs.fields.status,
    issueKey:
      UpdateStatusStep1.outputs.fields.issueKey,
  });

export default Manifest({
  name: "Jira Functions Deployed",
  description: "Create, Update, Find, and Close Jira Tickets all from Slack.",
  icon: "assets/icon.png",
  functions: [FindIssueByID, FindIssueByAssignee, CreateIssue, AddComment, UpdateStatus],
  outgoingDomains: ["horeaporutiu.atlassian.net"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read", "im:write", "triggers:write"],
  workflows: [FindIssueByIDWF, FindByAssigneeWF, CreateIssueWF, AddCommentWF, UpdateStatusWF],
});

