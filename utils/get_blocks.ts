export class Blocks {

  async getIssueBlocks(header: any, ticketKey: any, summary: any, status: any, comments: any,
    creatorUsername: any, assignee: any, incidentLink: any, blocks: any, issueType: any, priority: any) {
    console.log('getNewIssueBlocks called in utils')

    if (comments.length > 0) {
      comments = comments[0].body
    } else if (comments == undefined) {
      console.log('comments are undefined')
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

  async viewIssueBlocks(header: any, ticketKey: any, summary: any, status: any, comments: any,
    searcher: any, assignee: any, incidentLink: any, blocks: any, issueType: any, priority: any) {
    console.log('viewIssueBlocks called in utils')

    if (comments.length > 0) {
      comments = comments[0].body
    } else if (comments == undefined) {
      console.log('comments are undefined')
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
            "value": "Transition"
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
                  "text": "Comment",
                  "emoji": true
                },
                "value": "comment"
              },
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

  getCommentBlocks(blocks: any, commentText: any, link: any, issueKey: any, curUser: any, comment: any) {

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
        // `@${curUser}` + " updated the " + icon + " " + issueType +  " " + "<" + `${link}` + "|" + issueKey + "> \n" + ">" + comment,
      }
    });

    for (let i = 0; i < numberOfIssues; i++) {

      let curIssue = issues[i]
      //set variables to surface to UI
      const issueType = curIssue.fields.issuetype.name;
      const ticketID = curIssue.id;
      const description = curIssue.fields.description;
      const assignee = curIssue.fields.assignee.displayName;
      const reporter = curIssue.fields.reporter.displayName;
      const status = curIssue.fields.status.name;
      const comments = '';
      const link = "https://" + instance + "/browse/" + curIssue.key

      console.log('assignee: ')
      console.log(assignee)

      console.log('reporter: ')
      console.log(reporter)

      blocks.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "<" + `${link}` + "|" + curIssue.key + "> \n" + ">" + "Summary: " + "*" + description + "*"
            + "\n" + ">" + "Status: " + "*" + status + "*",
        }
      });
    }
    return blocks;
  }
}