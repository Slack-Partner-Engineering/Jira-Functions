import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FindIssueByID } from "../functions/find_issue_by_id/definition.ts";

export const FindIssueByIDWF = DefineWorkflow({
  callback_id: "find_issue_by_id_wf",
  title: "Find an Issue",
  description: "Find an Issue by ID",
  input_parameters: {
    properties: {
      currentUser: {
        type: Schema.slack.types.user_id,
      },
      interactivity_context: {
        type: "slack#/types/interactivity",
        description: "Interactivity context",
      }
    },
    required: ["currentUser"],
  },
});


const FindIssueByIDStep1 = FindIssueByIDWF
  .addStep(
    Schema.slack.functions.OpenForm,
    {
      title: "Find a Jira Issue by ID",
      submit_label: "Find",
      interactivity: FindIssueByIDWF.inputs.interactivity_context,
      fields: {
        elements: [
          {
            name: "issueKey",
            title: "issueKey",
            type: Schema.types.string,
            description: "Key of the issue to search for, ex: TEST-129",
          },
        ],
        required: ["issueKey"],
      },
    },
  );

FindIssueByIDWF
  .addStep(FindIssueByID, {
    issueKey: FindIssueByIDStep1.outputs.fields.issueKey,
    currentUser: FindIssueByIDWF.inputs.currentUser
  });

