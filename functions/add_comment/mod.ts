// deno-lint-ignore-file no-explicit-any
import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../../utils/get_blocks.ts";
import { User } from "../../utils/get_user_info.ts";
import { Channel } from "../../utils/channel_utils.ts";
import { Auth } from "../../utils/get_auth.ts";
import { AddComment } from "./definition.ts";
const issueURL = "/rest/api/2/issue/"


/** This function lets a user in Slack add a comment to an already 
 * existing Jira issue. 
 * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-example-add-comment-8946422/
 */
const add_comment: SlackFunctionHandler<typeof AddComment.definition> = async (
  { inputs, env, token },
) => {
  try {
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    const issueKey = inputs.issueKey
    const comment = inputs.comment

    const url = "https://" + instance + issueURL + issueKey + "/comment"
    const link = "https://" + instance + "/browse/" + issueKey

    const requestBody: any = {
      "body": inputs.comment
    }

    await fetch(
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
      .then((addCommentResp) => addCommentResp.json())

    //get channel name, and blocks to channel
    const channelObj = new Channel()
    const user = new User()
    const curUserName = await user.getUserName(token, inputs.currentUser)
    const block = new Blocks();

    let incidentBlock: any = [];

    incidentBlock = await block.getCommentBlocks(incidentBlock, link, issueKey, curUserName, comment)

    const DMInfo: any = await channelObj.startAppDM(token, inputs.currentUser)
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

export default add_comment;
