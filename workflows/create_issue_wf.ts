import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateIssue } from "../functions/create_issue/definition.ts";


// At present, this implementation requires the "hermes_workflow_tokens" toggle.
export const CreateIssueWF = DefineWorkflow({
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