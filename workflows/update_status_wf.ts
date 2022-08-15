import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { UpdateStatus } from "../functions/update_status/definition.ts";

// At present, this implementation requires the "hermes_workflow_tokens" toggle.
export const UpdateStatusWF = DefineWorkflow({
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
