import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../../utils/get_blocks.ts";
import { Channel } from "../../utils/channel_utils.ts";
import { Auth } from "../../utils/get_auth.ts";
import { FindIssueByAssignee } from "./definition.ts";
const searchURL = "/rest/api/2/search/?jql=assignee='"
import { SlackAPI } from 'deno-slack-api/mod.ts';


const find_issue_by_assignee: SlackFunctionHandler<typeof FindIssueByAssignee.definition> = async (
  { inputs, env, token },
) => {
  try {
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const header = "Issue Info :information_source:";
    let url = "https://" + instance + searchURL + inputs.assignee + "'"
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

    let block = new Blocks();

    let incidentBlock: any = [];

    let numIssues = getTicketResp.issues.length;

    // //assign Block Kit blocks for a better UI experience, check if someone was assigned    
    incidentBlock = await block.getFilterByAssigneeBlocks(incidentBlock, numIssues, inputs.assignee,
      getTicketResp.issues, instance)

    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let DMInfo: any = await channelObj.startAppDM(token, inputs.currentUser)
    let DMID = DMInfo.channel.id

    await channelObj.postToChannel(token, DMID, incidentBlock);
    const client = SlackAPI(token, {});

    return { outputs: {} };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  }
};

export default find_issue_by_assignee;

