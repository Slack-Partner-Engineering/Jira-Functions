// deno-lint-ignore-file no-explicit-any
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { call_add_comment } from "../../utils/call_add_comment.ts";
import { call_update_status } from "../../utils/call_update_status.ts";
import { Blocks } from "../../utils/get_blocks.ts";
import { Channel } from "../../utils/channel_utils.ts";
import { Auth } from "../../utils/get_auth.ts";
import { FindIssueByAssignee } from "./definition.ts";
const searchURL = "/rest/api/2/search/?jql=assignee='"
import { SlackAPI } from 'deno-slack-api/mod.ts';

import {
  updateStatusModal, addCommentModal
} from "../../views/index.ts";

import { BlockActionsRouter } from "deno-slack-sdk/mod.ts";


const find_issue_by_assignee: SlackFunctionHandler<typeof FindIssueByAssignee.definition> = async (
  { inputs, env, token },
) => {
  try {
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const url = "https://" + instance + searchURL + inputs.assignee + "'"
    console.log(url)

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

    const block = new Blocks();

    let incidentBlock: any = [];

    const numIssues = getTicketResp.issues.length;

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.getFilterByAssigneeBlocks(incidentBlock, numIssues, inputs.assignee,
      getTicketResp.issues, instance)

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

export default find_issue_by_assignee;


const router = BlockActionsRouter(FindIssueByAssignee);

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

