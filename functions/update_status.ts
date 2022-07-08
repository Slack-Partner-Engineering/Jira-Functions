import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { UpdateStatus } from "../manifest.ts";
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
    // the channel to post incident info to
    console.log(inputs)
    const issueKey = inputs.issueKey
    const updator = inputs.updator

    let findUrl = "https://" + instance + issueURL + inputs.issueKey
    console.log(findUrl)

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

    console.log("getTicketResp:")
    console.log(getTicketResp)
    console.log("after create resp:")
    const prevStatus = getTicketResp.fields.status.name
    const issueType = getTicketResp.fields.issuetype.name
    console.log("prevStatus: ")
    console.log(prevStatus)
    console.log("issueType: ")
    console.log(issueType)

    // API call to transition
    let url = "https://" + instance + issueURL + issueKey + "/transitions"
    console.log(url)
    const link = "https://" + instance + "/browse/" + issueKey

    console.log("inputs.status")
    console.log(inputs.status)
    var requestBody: any = JSON.stringify({
      "transition": {
        "id": inputs.status
      }
    })

    console.log("requestBody")
    console.log(requestBody)

    const addCommentResp: any = await fetch(
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
      .then((addCommentResp) => console.log(addCommentResp))


    console.log("addCommentResp:")
    console.log(addCommentResp)
    console.log("after add comment resp:")

    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let user = new User()
    let curUserName = await user.getUserName(token, updator)
    let block = new Blocks();

    let incidentBlock: any = [];

    let commentText = "Someone updated the status on issue *" + inputs.issueKey + "*";
    let curStatus;

    switch (inputs.status) {
      case "11":
        console.log("inside 11")
        curStatus = "To Do";
        break;
      case "21":
        console.log("inside 11")
        curStatus = "In Progress";
        break;
      case "31":
        console.log("inside 31")
        curStatus = "In Review";
        break;
      case "41":
        console.log("inside 41")
        curStatus = "Done";
        break;  
    }

    incidentBlock = await block.getStatusBlocks(incidentBlock, issueType, link, issueKey, curUserName, prevStatus, curStatus)

    let DMInfo: any = await channelObj.startAppDM(token, updator)
    let DMID = DMInfo.channel.id

    console.log(incidentBlock)


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