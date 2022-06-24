import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { FindIssue } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"

export default async ({ token, inputs, env }: any) => {
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
    const createTicketResp: any = await fetch(
      url,
      {
        method: "GET",
        headers: {          
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
      },
    )
      .then((createTicketResp) => createTicketResp.json())

    console.log('createTicketResp:')
    console.log(createTicketResp)
    console.log('after create resp:')

    let issueType = createTicketResp.fields.issuetype.name;
    console.log('issueType')
    console.log(issueType)

    let ticketID = createTicketResp.id;
    console.log('ticketID')
    console.log(ticketID)

    let description = createTicketResp.fields.description;
    console.log('description')
    console.log(description)

    let assignee = createTicketResp.fields.assignee;
    console.log('assignee')
    console.log(assignee)

    let reporter = createTicketResp.fields.reporter.displayName;
    console.log('reporter')
    console.log(reporter)

    let status = createTicketResp.fields.status.name;
    console.log('status')
    console.log(status)

    let comments = createTicketResp.fields.comment.comments;
    console.log('comments')
    console.log(comments)

    let link = "https://" + instance + "/browse/" + inputs.issueKey

    console.log('comments')
    console.log(comments)
  
    let block = new Blocks();
    // const incident_number = createTicketResp.result.task_effective_number
    // let incidentLink = "https://" + instance + ".service-now.com/nav_to.do?uri=task.do?sysparm_query=number=" + incident_number

    let incidentBlock: any[];
    incidentBlock = [];
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
          `${createTicketResp.id}` + "."
      },
    };

  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unexpected error', err);
    }
  }
};
