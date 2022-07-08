import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { CreateIssue } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"

  /** This function lets a user in Slack create an issue, bug, task, or improvement
   * within an already existing Jira Cloud instance.
   * @see https://api.slack.com/methods/users.info
   * 
   * Env variables required
   * @see https://slack-github.com/hporutiu/Jira-Functions#step-2-jira-cloud-configuration-via-environmental-variables
   * 
   * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/
   */
  const create_issue: SlackFunctionHandler<typeof CreateIssue.definition> = async (
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

    let url = "https://" + instance + issueURL
    console.log(url)
    //build the requestBody with our inputs from the UI

    const requestBody: any = {
      "fields": {
        "project": 
        {
          "key": projectKey
        },
        "summary": "N/A",
        "description": inputs.description,
        "issuetype": {
          "name": inputs.issueType
        }
      }
    }

    //only add optional fields to request body if they were filled in in the UI
    if (inputs.summary) {
      requestBody.fields.summary = inputs.summary
    }

    const createTicketResp: any = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      },
    )
      .then((createTicketResp) => createTicketResp.json())

    console.log('createTicketResp:')
    console.log(createTicketResp)
    console.log('after create resp:')
    const header = "New " + inputs.issueType + " Created :memo:";

    //set variables to surface to UI
    const issueType = inputs.issueType;
    const ticketID = createTicketResp.id;
    const description = inputs.description;
    const assignee = inputs.assigned_to;
    const reporter = inputs.creator;
    const status = inputs.status;
    const comments = 'test';
    const link = "https://" + instance + "/browse/" + createTicketResp.key

    let user = new User();
    let assigneeUser = await user.getUserName(token, assignee)
    let reporterUser = await user.getUserName(token, reporter)
    console.log(assigneeUser, reporterUser)

    console.log("issueType, ticketID, description, assignee, reporter, status, comments, link: ")
    console.log(issueType, ticketID, description, assigneeUser, reporterUser, status, comments, link)

    let block = new Blocks();

    let incidentBlock: any = [];

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = block.getNewIssueBlocks(header, ticketID, description,
      status, comments, reporterUser, assigneeUser, link, incidentBlock, issueType)


    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let DMInfo: any = await channelObj.startAppDM(token, inputs.creator)
    let DMID = DMInfo.channel.id

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

export default create_issue;