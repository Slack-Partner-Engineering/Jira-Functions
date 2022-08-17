// deno-lint-ignore-file no-explicit-any
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { CreateIssue } from "./definition.ts";

import { call_add_comment } from "../../utils/call_add_comment.ts";
import { call_update_status } from "../../utils/call_update_status.ts";
import { Blocks } from "../../utils/get_blocks.ts";
import { User } from "../../utils/get_user_info.ts";
import { Channel } from "../../utils/channel_utils.ts";
import { Auth } from "../../utils/get_auth.ts";
import { SlackAPI } from 'deno-slack-api/mod.ts';

import {
  updateStatusModal, addCommentModal
} from "../../views/index.ts";

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
    const projectKey = env["JIRA_PROJECT"];
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)

    const url = "https://" + instance + issueURL

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

    const getInfoUrl = url + createTicketResp.key

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
    const user = new User();
    if (await user.isSlackUser(token, assignee)) {
      assigneeUsername = await user.getUserName(token, assignee)
    } else assigneeUsername = assignee

    if (inputs.currentUser != null) {
      creatorUsername = await user.getUserName(token, inputs.currentUser)
    }

    const block = new Blocks();

    let incidentBlock: any = [];

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.getIssueBlocks(ticketKey, summary,
      status, comments, creatorUsername, assigneeUsername, link, incidentBlock, issueType, priority)

    //get channel name, and blocks to channel
    const channelObj = new Channel()
    const DMInfo: any = await channelObj.startAppDM(token, inputs.currentUser)
    const DMID = DMInfo.channel.id

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
  ['transition_issue'],
  async ({ action, body, token }) => {

    const client = SlackAPI(token);

    //get the modal view from the views folder
    const ModalView = await updateStatusModal(
      action.value,
    );

    //open the modal with the view which we created above
    await client.views.open({
      trigger_id: body.trigger_id,
      view: ModalView,
    });
  });

export const viewSubmission = async ({ body, view, inputs, token }: any) => {
  if (view.callback_id === "update_status_modal") {

    await call_update_status(view, token, body, inputs)

  }

  if (view.callback_id === "add_comment_modal") {

    await call_add_comment(view, token, body, inputs)

  }
};


export const AddCommentHandler = router.addHandler(

  ['add_comment'],
  async ({ action, body, token }) => {

    const client = SlackAPI(token);

    const ModalView = await addCommentModal(
      action.value,
    );

    await client.views.open({
      trigger_id: body.trigger_id,
      view: ModalView,
    });

  });

