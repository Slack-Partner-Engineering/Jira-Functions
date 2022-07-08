import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { FindIssueByAssignee } from "../manifest.ts";
const searchURL = "/rest/api/2/search/?jql=assignee='"

// var myHeaders = new Headers();
// myHeaders.append("Authorization", "Basic aG9yZWFwb3J1dGl1QGdtYWlsLmNvbTpzUGFkd2trZmYyakVkaDV1NkprQ0NEMDQ=");
// myHeaders.append("Cookie", "atlassian.xsrf.token=4bea51e5-f10a-4140-bc69-9469bd4c91a6_47707207755aeb3a2944e62aa9d370141751728b_lin");

// var requestOptions = {
//   method: 'GET',
//   headers: myHeaders,
//   redirect: 'follow'
// };

// fetch("https://horeaporutiu.atlassian.net/rest/api/2/search?jql=assignee='Lauren Hooper'", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));

const find_issue_by_assignee: SlackFunctionHandler<typeof FindIssueByAssignee.definition> = async (
  { inputs, env, token },
) => {
  try {
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const header = "Issue Info :information_source:";
    console.log('basicAuth: ')
    console.log(basicAuth)
    let url = "https://" + instance + searchURL + inputs.assignee + "'"
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

    let block = new Blocks();

    let incidentBlock: any = [];

    for (let i = 0; i < getTicketResp.issues.length; i++) {

      let curIssue = getTicketResp.issues[i]
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

          // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.getNewIssueBlocks(header, ticketID, description,
      status, comments, reporter, assignee, link, incidentBlock, issueType)

    }

    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let DMInfo: any = await channelObj.startAppDM(token, inputs.searcher)
    let DMID = DMInfo.channel.id

    await channelObj.postToChannel(token, DMID, incidentBlock);

    //output modal once the function finishes running
    return { outputs: {} };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  } 
};

export default find_issue_by_assignee;

