import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { UpdateIssue } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"

  /** This function lets a user in Slack update an issue, bug, task, or improvement
   * within an already existing Jira Cloud instance.
   */ 
  const update_issue: SlackFunctionHandler<typeof UpdateIssue.definition> = async (
  { inputs, env, token },
) => {
  try {
    const projectKey = env["JIRA_PROJECT"];
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    // const channel = inputs.channel
    console.log(inputs)
    let issueKey = inputs.issueKey

    let url = "https://" + instance + issueURL + issueKey
    console.log(url)
    //build the requestBody with our inputs from the UI


    const requestBody: any = {"fields": {}}

    //only add optional fields to request body if they were filled in in the UI
    if (inputs.summary) {
      requestBody.fields.summary = inputs.summary
    }
    if (inputs.description) {
      requestBody.fields.description = inputs.description
    }
    if (inputs.assignee) {
      requestBody.fields.assignee = {
        "accountId": inputs.assignee
      }
    }
    // if (inputs.issueType) {
    //   requestBody.fields.issueType = inputs.issueType
    // }
    // if (inputs.status) {
    //   requestBody.fields.status = inputs.status
    // }

    console.log('requestBody: ')
    console.log(requestBody)

    // const requestBody: any = { "fields": {"summary": "new summary"} }
    const link = "https://" + instance + "/browse/" + issueKey

    //Use PUT request to update 
    //API request to create a new incident in ServiceNow
    const updateTicketResp: any = await fetch(
      url,
      {
        method: "PUT",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      },
    )
      .then((updateTicketResp) => console.log(updateTicketResp))

    console.log('updateTicketResp:')
    console.log(updateTicketResp)
    console.log('after updateTicketResp resp:')

     //get channel name, and blocks to channel
     let channelObj = new Channel()
     let user = new User()
     let curUserName = await user.getUserName(token, inputs.updator)
     let block = new Blocks();
     let comment = ''
 
     let incidentBlock: any[];
     incidentBlock = [];
 
     let commentText = "Someone commented on issue *" + inputs.issueKey + "*";
 
     incidentBlock = await block.getUpdateBlocks(incidentBlock, inputs.issueType, link, issueKey, curUserName, comment)
 
     let DMInfo: any = await channelObj.startAppDM(token, inputs.updator)
     let DMID = DMInfo.channel.id
 
     console.log(incidentBlock)
    
     await channelObj.postToChannel(token, DMID, incidentBlock);


    //output modal once the function finishes running
    return await {
      outputs: {
        JiraResponse: "You should see a DM from this app shortly."
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  }
};

export default update_issue;