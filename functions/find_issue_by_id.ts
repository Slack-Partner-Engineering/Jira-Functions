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
    //no need for API key + username, can just pass Access token as auth header
    console.log(`access token: ${inputs.atlassianAccessToken}.`);
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const header = "Issue Info :information_source:";
    console.log('basicAuth: ')
    // console.log(basicAuth)
    let url = "https://" + instance + issueURL + inputs.issueKey
    console.log(url)

    // https://<instancename>.atlassian.net/rest/api/2/issue/
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
    // console.log(getTicketResp)
    console.log('after create resp:')

    //set variables to surface to UI
    const issueType = getTicketResp.fields.issuetype.name;
    const ticketKey = getTicketResp.key;
    let assignee;
    if (assignee == null) {
      assignee = 'Unassigned'
    } else {
      assignee = getTicketResp.fields.assignee.displayName;
    }

    const priority = getTicketResp.fields.priority.name;;
    const summary = getTicketResp.fields.summary;
    const status = getTicketResp.fields.status.name;
    const comments = getTicketResp.fields.comment.comments;
    const link = "https://" + instance + "/browse/" + inputs.issueKey
    let assigneeUsername, searcherUsername;
    let user = new User();

    if (inputs.searcher != null) {
      searcherUsername = await user.getUserName(token, inputs.searcher)
    }
  
    let block = new Blocks();

    let incidentBlock: any = [];

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.viewIssueBlocks(header, ticketKey, summary,
      status, comments, searcherUsername, assignee, link, incidentBlock, issueType, priority)


    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let DMInfo: any = await channelObj.startAppDM(token, inputs.searcher)
    let DMID = DMInfo.channel.id

    await channelObj.postToChannel(token, DMID, incidentBlock);
    console.log(`access token: ${inputs.atlassianAccessToken}.`);

    //output modal once the function finishes running
    return { outputs: {} };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  } 
};

export default find_issue_by_id;

