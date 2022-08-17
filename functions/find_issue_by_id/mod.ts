// deno-lint-ignore-file no-explicit-any
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { call_add_comment } from "../../utils/call_add_comment.ts";
import { call_update_status } from "../../utils/call_update_status.ts";
import { Blocks } from "../../utils/get_blocks.ts";
import { User } from "../../utils/get_user_info.ts";
import { Channel } from "../../utils/channel_utils.ts";
import { Auth } from "../../utils/get_auth.ts";
import { FindIssueByID } from "./definition.ts";
const issueURL = "/rest/api/2/issue/"
import { SlackAPI } from 'deno-slack-api/mod.ts';


import {
  updateStatusModal, addCommentModal
} from "../../views/index.ts";

import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";

const find_issue_by_id: SlackFunctionHandler<typeof FindIssueByID.definition> = async (
  { inputs, env, token },
) => {
  try {
    //no need for API key + username, can just pass Access token as auth header
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)

    const url = "https://" + instance + issueURL + inputs.issueKey

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

    //set variables to surface to UI
    const issueType = getTicketResp.fields.issuetype.name;
    const ticketKey = getTicketResp.key;
    let assignee;
    if (assignee == null) {
      assignee = 'Unassigned'
    } else {
      assignee = getTicketResp.fields.assignee.displayName;
    }

    const priority = getTicketResp.fields.priority.name;
    const summary = getTicketResp.fields.summary;
    const status = getTicketResp.fields.status.name;
    const comments = getTicketResp.fields.comment.comments;
    const link = "https://" + instance + "/browse/" + inputs.issueKey
    let searcherUsername;
    const user = new User();

    if (inputs.currentUser != null) {
      searcherUsername = await user.getUserName(token, inputs.currentUser)
    }

    const block = new Blocks();

    let incidentBlock: any = [];

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.viewIssueBlocks(ticketKey, summary,
      status, comments, searcherUsername, assignee, link, incidentBlock, issueType, priority)


    //get channel name, and blocks to channel
    const channelObj = new Channel()
    const DMInfo: any = await channelObj.startAppDM(token, inputs.currentUser)
    const DMID = DMInfo.channel.id

    await channelObj.postToChannel(token, DMID, incidentBlock);

    //output modal once the function finishes running
    return {
      completed: false,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  }
};

export default find_issue_by_id;


const router = BlockActionsRouter(FindIssueByID);

export const blockActions = router.addHandler(

  ['transition_issue_from_find'], // The first argument to addHandler can accept an array of action_id strings, among many other formats!
  // Check the API reference at the end of this document for the full list of supported options
  async ({ action, body, token }) => { // The second argument is the handler function itself
    const client = SlackAPI(token);

    const ModalView = await updateStatusModal(
      action.value,
    );


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

  ['add_comment_from_find'],
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
