import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { CreateIssue } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"


const create_issue: SlackFunctionHandler<typeof CreateIssue.definition> = async (
  { inputs, env, token },
) => {
  try {
    const projectKey = env["JIRA_PROJECT"];
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const channel = inputs.channel
    const header = "Issue Info :information_source:";
    console.log('basicAuth: ')
    console.log(basicAuth)
    let url = "https://" + instance + issueURL
    console.log(url)
    //build the requestBody with our inputs from the UI
    let requestBody: any = {}
    requestBody.fields.project.key = projectKey
    requestBody.fields.description = inputs.description;
    requestBody.fileds.issuetype.name = inputs.issueType;
    //only add optional fields to request body if they were filled in in the UI
    if (inputs.summary) {
      requestBody.fields.summary = inputs.summary
    } else {requestBody.fileds.summary = "N/A"}

    // basic structure of the body to send to create API call
    //   {
    //     "fields": {
    //        "project":
    //        {
    //           "key": "TEST"
    //        },
    //        "summary": "REST ye merry gentlemen.",
    //        "description": "Creating of an issue using project keys and issue type names using the REST API",
    //        "issuetype": {
    //           "name": "Bug"
    //        }
    //    }
    // }


    // https://supportdesk423.atlassian.net/rest/api/2/issue/
    //API request to create a new incident in ServiceNow
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

    //set variables to surface to UI
    const issueType = createTicketResp.fields.issuetype.name;
    const ticketID = createTicketResp.id;
    const description = createTicketResp.fields.description;
    const assignee = createTicketResp.fields.assignee;
    const reporter = createTicketResp.fields.reporter.displayName;
    const status = createTicketResp.fields.status.name;
    const comments = createTicketResp.fields.comment.comments;
    const link = "https://" + instance + "/browse/" + "idk"

    console.log("issueType, ticketID, description, assignee, reporter, status, comments, link: ")
    console.log(issueType, ticketID, description, assignee, reporter, status, comments, link)
  
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
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  } 
};

export default create_issue;