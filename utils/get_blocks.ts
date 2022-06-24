export class Blocks {

  //builds the blocks to post to a channel. This is what the end user will see in Slack.

  getBlocks(header: any, number: any, shortDescription: any, curState: any, comments: any, caller: any, assignedTo: any, incidentLink: any, blocks: any, type:any) {
    console.log('getBlocks called in utils')

    console.log(caller)
    console.log('comments')
    console.log(comments)

    if (comments.length === 0) {
      console.log('no comments')
      comments = 'N/A'
    } else {
      comments = comments[0].body
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
            "text": "*Reporter:*\n" + `${caller}`
          },
          {
            "type": "mrkdwn",
            "text": "*Assigned To:*\n" + `@${assignedTo}`
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
}