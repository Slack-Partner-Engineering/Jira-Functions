export class Blocks {

  //builds the blocks to post to a channel. This is what the end user will see in Slack.

  getBlocks(header: any, number: any, shortDescription: any, curState: any, comments: any, caller: any, assignedTo: any, incidentLink: any, blocks: any, type:any) {
    console.log('getBlocks called in utils')

    console.log(caller)
    console.log('comments')
    console.log(comments)

    if (comments.length > 0 ) {
      comments = comments[0].body
    } else if (comments == undefined) {
      console.log('comments are undefined')
      comments = "N/A"
    }
    if (!assignedTo) {
      console.log('no assignedTo')
      assignedTo = 'N/A'
    }

    blocks.push({
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": header,
        "emoji": true
      }
    },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Issue ID:* " + `${number}`+ "\n" + "*Type*: " + `${type}`
          },
          {
            "type": "mrkdwn",
            "text": "*Short Description: *\n" + `${shortDescription}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Status:*\n" + `${curState}`
          },
          {
            "type": "mrkdwn",
            "text": "*Comments:*\n" + `${comments}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": ":woman-raising-hand::skin-tone-4: *Reporter:*\n" + `@${caller}`
          },
          {
            "type": "mrkdwn",
            "text": ":man-raising-hand::skin-tone-2: *Assigned To:*\n" + `@${assignedTo}` 
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "<" + `${incidentLink}` + "|" + "View Issue" + ">"
        }
      });

    return blocks;
  }

  getNewIssueBlocks(header: any, number: any, shortDescription: any, curState: any, comments: any, caller: any, assignedTo: any, incidentLink: any, blocks: any, type:any) {
    console.log('getBlocks called in utils')

    console.log(caller)
    console.log('comments')
    console.log(comments)

    if (comments.length > 0 ) {
      comments = comments[0].body
    } else if (comments == undefined) {
      console.log('comments are undefined')
      comments = "N/A"
    }
    if (!assignedTo) {
      console.log('no assignedTo')
      assignedTo = 'N/A'
    }

    blocks.push({
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": header,
        "emoji": true
      }
    },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Issue ID:* " + "\n" + `${number}`,
          },
          {
            "type": "mrkdwn",
            "text": "*Short Description: *\n" + `${shortDescription}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Status:*\n" + `${curState}`
          },
          {
            "type": "mrkdwn",
            "text": "*Type:*\n" + `${type}`
          }
        ]
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": ":woman-raising-hand::skin-tone-4: *Reporter:*\n" + `@${caller}`
          },
          {
            "type": "mrkdwn",
            "text": ":man-raising-hand::skin-tone-2: *Assigned To:*\n" + `@${assignedTo}` 
          }
        ]
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "<" + `${incidentLink}` + "|" + "View Issue" + ">"
        }
      });

    return blocks;
  }


  getCommentBlocks(blocks: any, commentText: any, link: any, issueKey: any, curUser:any, comment:any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `@${curUser}` + " commented on " + "<" + `${link}` + "|" + issueKey + "> \n" + ">" + comment,
      }
    });
  
    return blocks;
  }

  getUpdateBlocks(blocks: any, issueType: any, link: any, issueKey: any, curUser:any, comment:any) {
    let icon;
    switch (issueType) {
      case 'Bug':
        console.log('inside Bug 1')
        icon = "🐛";
        break;
      case 'Task':
        console.log('inside task 2')
        icon = "☑️";
        break;
      case 'Improvement':
        console.log('inside improvement 3')
        icon = "⬆️";
        break;
      case 'New Feature':
        console.log('inside case 2')
        icon = "➕";
        break;  
      default:
        console.log('default case')
        icon = "🐛"
    }

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `@${curUser}` + " updated the " + icon + " " + issueType +  " " + "<" + `${link}` + "|" + issueKey + "> \n" + ">" + comment,
      }
    });
  
    return blocks;
  }

  getStatusBlocks(blocks: any, issueType: any, link: any, issueKey: any, curUser:any, prevStatus:any, curStatus:any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `@${curUser}` + " updated "+  "<" + `${link}` + "|" + "the " + issueType + ": " + issueKey + ">"
          + " from " + "`" + prevStatus + "`" + " " + "→ " + "`" + curStatus +  "`"
      }
    });
  
    return blocks;
  }

  getIssueCreatedBlocks(blocks: any, commentText: any, link: any, issueKey: any, curUser:any, comment:any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `@${curUser}` + " commented on " + "<" + `${link}` + "|" + issueKey + "> \n" + ">" + comment,
      }
    });
  
    return blocks;
  }

  getFilterByAssigneeBlocks(blocks: any, numberOfIssues: any, assignee: any, issues: any, instance:any) {

    blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "🔎 There are " + numberOfIssues + " issues  assigned to " + "* 🙋🏽‍♀️ " +  assignee + " 🙋🏻‍♂️*"
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