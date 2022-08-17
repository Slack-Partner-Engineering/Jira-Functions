// deno-lint-ignore-file no-explicit-any
export class Blocks {

  async getIssueBlocks(ticketKey: any, summary: any, status: any, comments: any,
    creatorUsername: any, assignee: any, incidentLink: any, blocks: any, issueType: any, priority: any) {

    if (comments.length > 0) {
      comments = comments[0].body
    } else if (comments == undefined) {
      comments = "N/A"
    }

    let icon;
    switch (issueType) {
      case 'Bug':
        icon = "🐛";
        break;
      case 'Task':
        icon = "☑️";
        break;
      case 'Improvement':
        icon = "📈";
        break;
      case 'New Feature':
        icon = "➕";
        break;
      default:
        icon = "🐛"
    }

    await blocks.push(
      {
        "type": "section",
        "text":
        {
          "type": "mrkdwn",
          "text": `@${creatorUsername}` + " " + "*created a*" + " " + `*${issueType}*` + " using Jira Functions ✨ " + "<" + `${incidentLink}` + "|" + `${ticketKey}` + " " + `${summary}` + ">"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "text": "Status: " + `*${status}* `,
            "type": "mrkdwn"
          },
          {
            "text": `${icon}` + " Type: " + `*${issueType}*`,
            "type": "mrkdwn"
          },
          {
            "text": " 🙋🏽‍♀️ Assignee: " + `*${assignee}*`,
            "type": "mrkdwn"
          },
          {
            "text": " ⬆️ Priority: " + `*${priority}*`,
            "type": "mrkdwn"
          }
        ]
      },
      {
        "type": "actions",
        "block_id": "jira_issue_block",
        "elements": [
          {
            "type": "button",
            "action_id": "transition_issue",
            "text": {
              "type": "plain_text",
              "text": "Transition",
              "emoji": true
            },
            "value": ticketKey
          },
          {
            "type": "button",
            "action_id": "add_comment",
            "text": {
              "type": "plain_text",
              "text": "Add Comment",
              "emoji": true
            },
            "value": ticketKey
          },
          {
            "type": "static_select",
            "action_id": "jira_more_actions",
            "placeholder": {
              "type": "plain_text",
              "text": "More actions...",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Assign",
                  "emoji": true
                },
                "value": "assign"
              }
            ]
          }
        ]
      },
    )
    return blocks;
  }

  async viewIssueBlocks(ticketKey: any, summary: any, status: any, comments: any,
    searcher: any, assignee: any, incidentLink: any, blocks: any, issueType: any, priority: any) {

    if (comments.length > 0) {
      comments = comments[0].body
    } else if (comments == undefined) {
      comments = "N/A"
    }

    let icon;
    switch (issueType) {
      case 'Bug':
        icon = "🐛";
        break;
      case 'Task':
        icon = "☑️";
        break;
      case 'Improvement':
        icon = "📈";
        break;
      case 'New Feature':
        icon = "➕";
        break;
      default:
        icon = "🐛"
    }

    await blocks.push(
      {
        "type": "section",
        "text":
        {
          "type": "mrkdwn",
          "text": `@${searcher}` + " " + "*requested to find a*" + " " + `*${issueType}*` + " using Jira Functions ✨ " + "<" + `${incidentLink}` + "|" + `${ticketKey}` + " " + `${summary}` + ">"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "text": "Status: " + `*${status}* `,
            "type": "mrkdwn"
          },
          {
            "text": `${icon}` + " Type: " + `*${issueType}*`,
            "type": "mrkdwn"
          },
          {
            "text": " 🙋🏽‍♀️ Assignee: " + `*${assignee}*`,
            "type": "mrkdwn"
          },
          {
            "text": " ⬆️ Priority: " + `*${priority}*`,
            "type": "mrkdwn"
          }
        ]
      },
      {
        "type": "actions",
        "block_id": "jira_issue_block_from_find",
        "elements": [
          {
            "type": "button",
            "action_id": "transition_issue_from_find",
            "text": {
              "type": "plain_text",
              "text": "Transition",
              "emoji": true
            },
            "value": ticketKey
          },
          {
            "type": "button",
            "action_id": "add_comment_from_find",
            "text": {
              "type": "plain_text",
              "text": "Add Comment",
              "emoji": true
            },
            "value": ticketKey
          },
          {
            "type": "static_select",
            "action_id": "jira_more_actions",
            "placeholder": {
              "type": "plain_text",
              "text": "More actions...",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "Assign",
                  "emoji": true
                },
                "value": "assign"
              }
            ]
          }
        ]
      },
    )
    return blocks;
  }

  getCommentBlocks(blocks: any, link: any, issueKey: any, curUser: any, comment: any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `@${curUser}` + " commented on " + "<" + `${link}` + "|" + issueKey + "> \n" + ">" + comment,
      }
    });

    return blocks;
  }

  getStatusBlocks(blocks: any, issueType: any, link: any, issueKey: any, curUser: any, prevStatus: any, curStatus: any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `@${curUser}` + " updated " + "<" + `${link}` + "|" + "the " + issueType + ": " + issueKey + ">"
          + " from " + "`" + prevStatus + "`" + " " + "→ " + "`" + curStatus + "`"
      }
    });

    return blocks;
  }

  getFilterByAssigneeBlocks(blocks: any, numberOfIssues: any, assignee: any, issues: any, instance: any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "🔎 There are " + numberOfIssues + " issues  assigned to " + "* 🙋🏽‍♀️ " + assignee + " 🙋🏻‍♂️*"
      }
    });

    for (let i = 0; i < numberOfIssues; i++) {

      const curIssue = issues[i]
      const description = curIssue.fields.description;
      const status = curIssue.fields.status.name;
      const link = "https://" + instance + "/browse/" + curIssue.key

      blocks.push(
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "<" + `${link}` + "|" + curIssue.key + "> \n" + ">" + "Summary: " + "*" + description + "*"
              + "\n" + ">" + "Status: " + "*" + status + "*",
          }
        },
        {
          "type": "actions",
          "block_id": "jira_issue_block_from_assignee" + i,
          "elements": [
            {
              "type": "button",
              "action_id": "transition_issue",
              "text": {
                "type": "plain_text",
                "text": "Transition",
                "emoji": true
              },
              "value": curIssue.key
            },
            {
              "type": "button",
              "action_id": "add_comment",
              "text": {
                "type": "plain_text",
                "text": "Add Comment",
                "emoji": true
              },
              "value": curIssue.key
            },
            {
              "type": "static_select",
              "action_id": "jira_more_actions",
              "placeholder": {
                "type": "plain_text",
                "text": "More actions...",
                "emoji": true
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Assign",
                    "emoji": true
                  },
                  "value": "assign"
                }
              ]
            }
          ]
        },
      );

    }
    return blocks;
  }
}
