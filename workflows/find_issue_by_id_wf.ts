import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FindIssueByID } from "../functions/find_issue_by_id/definition.ts";

export const FindIssueByIDWF = DefineWorkflow({
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
      atlassianAccessToken: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "atlassian",
      },
    },
    required: ["searcher"],
  },
});


const FindIssueByIDStep1 = FindIssueByIDWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Find a Jira Issue by ID",
      submit_label: "Find",
      interactivity: FindIssueByIDWF.inputs.interactivity_context,
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
    issueKey: FindIssueByIDStep1.outputs.fields.issueKey,
    searcher: FindIssueByIDWF.inputs.searcher,
    atlassianAccessToken: FindIssueByIDWF.inputs.atlassianAccessToken,
  });

