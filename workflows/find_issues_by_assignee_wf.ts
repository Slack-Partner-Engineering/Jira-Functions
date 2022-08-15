import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { FindIssueByAssignee } from "../functions/find_issue_by_assignee/definition.ts";

export const FindIssueByAssigneeWF = DefineWorkflow({
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
      atlassianAccessToken: {
        type: Schema.slack.types.oauth2,
        oauth2_provider_key: "atlassian",
      },
    },
    required: ["searcher", "atlassianAccessToken"],
  },
});

const FindByAssigneeStep1 = FindIssueByAssigneeWF
  .addStep(
    "slack#/functions/open_form",
    {
      title: "Get all Jira Issues assigned to a particular user",
      submit_label: "Transition",
      interactivity: FindIssueByAssigneeWF.inputs.interactivity_context,
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

const FindByAssigneeStep2 = FindIssueByAssigneeWF
  .addStep(FindIssueByAssignee, {
    searcher: FindIssueByAssigneeWF.inputs.searcher,
    atlassianAccessToken: FindIssueByAssigneeWF.inputs.atlassianAccessToken,
    assignee: FindByAssigneeStep1.outputs.fields.assignee,
  });