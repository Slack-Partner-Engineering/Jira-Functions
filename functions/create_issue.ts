import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { State } from "../utils/get_state.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { CreateIssue } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"

  /** This function lets a user in Slack create an issue, bug, task, or improvement
   * within an already existing Jira Cloud instance.
   * @see https://api.slack.com/methods/users.info
   * 
   * Env variables required:
   * 
   * JIRA_PROJECT - This is the project in Jira. You must have an already created project
   * in Jira to run this function.
   * 
   * Example: JIRA_PROJECT=TEST
   * 
   * JIRA_INSTANCE - This is your cloud instance URL. Set this in your .env file and 
   * then run `source .env` to apply your env variable changes. 
   * 
   * JIRA_USERNAME - The username associated with your Jira Cloud instance.
   * 
   * Example = JIRA_USERNAME=rogerfederer@gmail.com
   * 
   * JIRA_API_KEY - The API key associated with your Jira Cloud instance. To learn how 
   * to create one, see the URL below.
   * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-examples/
   * Example = JIRA_API_KEY=sPadwkkff2jEd*****CD04
   *  
   * Example: JIRA_INSTANCE=horeaporutiu.atlassian.net
   * name: create_issue
   * type: Run On Slack function used to create an issue in a Jira Cloud Instance.
   * inputs: 
   * 
   * inputs.summary
   * 
   * inputs.description
   * 
   * inputs.issueType: 
   * 
   * inputs: userID. Needed to get display name from UserID.
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
    const channel = inputs.channel
    const header = "Issue Info :information_source:";
    console.log('basicAuth: ')
    console.log(basicAuth)
    let url = "https://" + instance + issueURL
    console.log(url)
    //build the requestBody with our inputs from the UI

    // const person: Person = {
    //   name: 'James',
    //   address: {
    //     country: 'Chile',
    //     city: 'Santiago',
    //   },
    // };

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