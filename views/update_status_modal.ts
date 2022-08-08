export const updateStatusModal = (
  issueKey: any,
) => {
  const view = {
    "type": "modal",
    "callback_id": "update_status_modal",
    "private_metadata": issueKey,
    "title": {
      "type": "plain_text",
      "text": "Jira Functions",
      "emoji": true,
    },
    "submit": {
      "type": "plain_text",
      "text": "Update",
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
        "block_id": "update_status_block",
        "element": {
          "type": "static_select",
          "action_id": "update_status_action",
          "placeholder": {
            "type": "plain_text",
            "emoji": true,
            "text": "Update the status"
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "To Do"
              },
              "value": "11"
            },
            {
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "In Progress"
              },
              "value": "21"
            },
            {
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "In Review"
              },
              "value": "31"
            },
            {
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Done"
              },
              "value": "41"
            }
          ]
        },
        "label": {
          "type": "plain_text",
          "text": "Status",
          "emoji": true,
        },
      },
    ],
  };

  return view;
};