import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { FindIssueByID } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"

const find_issue_by_id: SlackFunctionHandler<typeof FindIssueByID.definition> = async (
  { inputs, env, token },
) => {
  try {
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const channel = inputs.channel
    const header = "Issue Info :information_source:";
    console.log('basicAuth: ')
    console.log(basicAuth)
    let url = "https://" + instance + issueURL + inputs.issueKey
    console.log(url)


    // https://supportdesk423.atlassian.net/rest/api/2/issue/
    //API request to create a new incident in ServiceNow
    const getTicketResp: any = await fetch(
      url,
      {
        method: "GET",
        headers: {          
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
      },
    )
      .then((getTicketResp) => getTicketResp.json())

    console.log('getTicketResp:')
    console.log(getTicketResp)
    console.log('after create resp:')

    //set variables to surface to UI
    const issueType = getTicketResp.fields.issuetype.name;
    const ticketID = getTicketResp.id;
    const description = getTicketResp.fields.description;
    const assignee = getTicketResp.fields.assignee;
    const reporter = getTicketResp.fields.reporter.displayName;
    const status = getTicketResp.fields.status.name;
    const comments = getTicketResp.fields.comment.comments;
    const link = "https://" + instance + "/browse/" + inputs.issueKey

    console.log("issueType, ticketID, description, assignee, reporter, status, comments, link: ")
    console.log(issueType, ticketID, description, assignee, reporter, status, comments, link)
  
    let block = new Blocks();

    let incidentBlock: any = [];

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
      incidentBlock = block.getBlocks(header, ticketID, description,
        status, comments, reporter, assignee, link, incidentBlock, issueType)


    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let channelInfo: any = await channelObj.getChannelInfo(token, channel)
    console.log('channelInfo: ')
    console.log(channelInfo)
    await channelObj.postToChannel(token, channel, incidentBlock);

    //output modal once the function finishes running
    return await {
      outputs: {
        JiraResponse: "Please go to channel " + `#${channelInfo.name}` + " to view your newly created ticket: " +
          `${getTicketResp.id}` + "."
      },
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  } 
};

export default find_issue_by_id;

