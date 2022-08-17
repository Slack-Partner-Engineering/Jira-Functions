// deno-lint-ignore-file no-explicit-any
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../../utils/get_blocks.ts";
import { User } from "../../utils/get_user_info.ts";
import { Channel } from "../../utils/channel_utils.ts";
import { Auth } from "../../utils/get_auth.ts";
import { UpdateStatus } from "./definition.ts";
const issueURL = "/rest/api/2/issue/"

/** This function lets a user in Slack add a comment to an already 
 * existing Jira issue. 
 * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-example-add-comment-8946422/
 */
const update_status: SlackFunctionHandler<typeof UpdateStatus.definition> = async (
  { inputs, env, token },
) => {
  try {
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)

    const issueKey = inputs.issueKey
    const currentUser = inputs.currentUser

    const findUrl = "https://" + instance + issueURL + inputs.issueKey

    const getTicketResp: any = await fetch(
      findUrl,
      {
        method: "GET",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
      },
    )
    .then((getTicketResp) => getTicketResp.json())

    const prevStatus = getTicketResp.fields.status.name
    const issueType = getTicketResp.fields.issuetype.name

    // API call to transition
    const url = "https://" + instance + issueURL + issueKey + "/transitions"
    const link = "https://" + instance + "/browse/" + issueKey

    const requestBody: any = await JSON.stringify({
      "transition": {
        "id": inputs.status
      }
    })

    await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Authorization": basicAuth,
          "Content-Type": "application/json",
        },
        body: requestBody
      },
    )
      .then((addCommentResp) => addCommentResp.toString())

    //get channel name, and blocks to channel
    const channelObj = new Channel()
    const user = new User()
    const curUserName = await user.getUserName(token, currentUser)
    const block = new Blocks();

    let incidentBlock: any = [];

    let curStatus;

    switch (inputs.status) {
      case "11":
        curStatus = "To Do";
        break;
      case "21":
        curStatus = "In Progress";
        break;
      case "31":
        curStatus = "In Review";
        break;
      case "41":
        curStatus = "Done";
        break;
    }

    incidentBlock = await block.getStatusBlocks(incidentBlock, issueType, link, issueKey, curUserName, prevStatus, curStatus)

    const DMInfo: any = await channelObj.startAppDM(token, currentUser)
    const DMID = DMInfo.channel.id

    await channelObj.postToChannel(token, DMID, incidentBlock);

    //output modal once the function finishes running
    return { outputs: {} };

  } catch (error) {
    const msg = error instanceof Error ? error.message : "unknown";
    console.log(error);
    return { error: msg };
  }
};

export default update_status;