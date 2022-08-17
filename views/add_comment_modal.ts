// deno-lint-ignore-file no-explicit-any
export const addCommentModal = (
  issueKey: any,
) => {
  const view = {
    "type": "modal",
    "callback_id": "add_comment_modal",
    "private_metadata": issueKey,
    "title": {
      "type": "plain_text",
      "text": "Jira Functions",
      "emoji": true,
    },
    "submit": {
      "type": "plain_text",
      "text": "Submit",
      "emoji": true,
    },
    "close": {
      "type": "plain_text",
      "text": "Cancel",
      "emoji": true,
    },
    "blocks": [
      {
        "type": "input",
        "block_id": "add_comment_block",
        "element": {
          "type": "plain_text_input",
          "action_id": "add_comment_action",
          "multiline": true,
        },
        "label": {
          "type": "plain_text",
          "text": "Add a Comment",
          "emoji": true
        }
      }
    ]
  };

  return view;
};
