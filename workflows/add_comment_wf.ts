import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { AddComment } from "../functions/add_comment/definition.ts";

export const AddCommentWF = DefineWorkflow({
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

