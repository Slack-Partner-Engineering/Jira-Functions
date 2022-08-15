
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import type { CreateIssue } from "./definition.ts";

import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { SlackAPI } from 'deno-slack-api/mod.ts';

import {
  updateStatusModal, addCommentModal
} from "../views/index.ts";

import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";

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
    console.log('hello')
    const projectKey = env["JIRA_PROJECT"];
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)

    let url = "https://" + instance + issueURL

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

    let getInfoUrl = url + createTicketResp.key

    const getIssueInfo: any = await fetch(
      getInfoUrl,
      {
        method: "GET",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
      },
    )
      .then((getIssueInfo) => getIssueInfo.json())
    const header = "New " + inputs.issueType + " Created :memo:";


    //set variables to surface to UI
    const issueType = inputs.issueType;
    const ticketKey = createTicketResp.key;
    const summary = getIssueInfo.fields.summary;

    let assignee = inputs.assigned_to;
    if (assignee == null) {
      assignee = 'Unassigned'
    }
    const status = await getIssueInfo.fields.status.name;

    const priority = getIssueInfo.fields.priority.name;
    const comments = 'test';
    const link = "https://" + instance + "/browse/" + createTicketResp.key
    let assigneeUsername, creatorUsername;
    let user = new User();
    if (await user.isSlackUser(token, assignee)) {
      assigneeUsername = await user.getUserName(token, assignee)
    } else assigneeUsername = assignee

    if (inputs.creator != null) {
      creatorUsername = await user.getUserName(token, inputs.creator)
    }

    let block = new Blocks();

    let incidentBlock: any = [];

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.getIssueBlocks(header, ticketKey, summary,
      status, comments, creatorUsername, assigneeUsername, link, incidentBlock, issueType, priority)

    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let DMInfo: any = await channelObj.startAppDM(token, inputs.creator)
    let DMID = DMInfo.channel.id

    await channelObj.postToChannel(token, DMID, incidentBlock);
    return {
      completed: false,
    };

  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  }
};

export default create_issue;

const router = BlockActionsRouter(CreateIssue);

export const blockActions = router.addHandler(

  ['transition_issue'], // The first argument to addHandler can accept an array of action_id strings, among many other formats!
  // Check the API reference at the end of this document for the full list of supported options
  async ({ action, body, inputs, token }) => { // The second argument is the handler function itself
    const client = SlackAPI(token);

    const ModalView = await updateStatusModal(
      action.value,
    );


    const response = await client.views.open({
      trigger_id: body.trigger_id,
      view: ModalView,
    });

  });

export const viewSubmission = async ({ body, view, inputs, token }: any) => {
  if (view.callback_id === "update_status_modal") {
    let statusValue = view.state.values.update_status_block.update_status_action.selected_option.value

    let issueKey = view.private_metadata

    const client = SlackAPI(token, {});

    let output = await client.apiCall("functions.run", {
      function_reference: body.api_app_id +
        "#/functions/update_status",
      inputs: {
        issueKey: issueKey,
        status: statusValue,
        updator: inputs.creator
      },
    });

  }

  if (view.callback_id === "add_comment_modal") {

    let comment = view.state.values.add_comment_block.add_comment_action.value

    let issueKey = view.private_metadata

    const client = SlackAPI(token, {});

    let output = await client.apiCall("functions.run", {
      function_reference: body.api_app_id +
        "#/functions/add_comment",
      inputs: {
        issueKey: issueKey,
        creator: inputs.creator,
        comment: comment,
      },
    });

  }
};


export const AddCommentHandler = router.addHandler(

  ['add_comment'],
  async ({ action, body, inputs, token }) => {
    const client = SlackAPI(token);

    const ModalView = await addCommentModal(
      action.value,
    );

    const response = await client.views.open({
      trigger_id: body.trigger_id,
      view: ModalView,
    });

  });

