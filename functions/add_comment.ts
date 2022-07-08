import type { SlackFunctionHandler } from "deno-slack-sdk/types.ts";
import { Blocks } from "../utils/get_blocks.ts";
import { User } from "../utils/get_user_info.ts";
import { Channel } from "../utils/channel_utils.ts";
import { Auth } from "../utils/get_auth.ts";
import { AddComment } from "../manifest.ts";
const issueURL = "/rest/api/2/issue/"

  /** This function lets a user in Slack add a comment to an already 
   * existing Jira issue. 
   * @see https://developer.atlassian.com/server/jira/platform/jira-rest-api-example-add-comment-8946422/
   */
  const add_comment: SlackFunctionHandler<typeof AddComment.definition> = async (
  { inputs, env, token },
) => {
  try {
    const projectKey = env["JIRA_PROJECT"];
    const instance = env["JIRA_INSTANCE"];
    const auth = new Auth()
    const basicAuth = await auth.getBasicAuth(env)
    // the channel to post incident info to
    console.log(inputs)
    const issueKey = inputs.issueKey
    const comment = inputs.comment
    const creator = inputs.creator

    let url = "https://" + instance + issueURL + issueKey + "/comment"
    console.log(url)
    let comments = await JSON.stringify(inputs.comment)
    console.log('comments: ')
    console.log(comments)
    const link = "https://" + instance + "/browse/" + issueKey


    const requestBody: any = {
      "body": inputs.comment 
    }

    const addCommentResp: any = await fetch(
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

    console.log('addCommentResp:')
    console.log(addCommentResp)
    console.log('after add comment resp:')

    //get channel name, and blocks to channel
    let channelObj = new Channel()
    let user = new User()
    let curUserName = await user.getUserName(token, inputs.creator)
    let block = new Blocks();

    let incidentBlock: any = [];

    let commentText = "Someone commented on issue *" + inputs.issueKey + "*";

    incidentBlock = await block.getCommentBlocks(incidentBlock, commentText, link, issueKey, curUserName, comment)

    let DMInfo: any = await channelObj.startAppDM(token, inputs.creator)
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

export default add_comment;