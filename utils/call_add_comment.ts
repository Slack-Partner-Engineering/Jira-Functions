// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from 'deno-slack-api/mod.ts';

//call my function add_comment via functions.run
//reusable so it can be used in all workflows
export async function call_add_comment(view: any, token: string, body: any, inputs: any) {

  const comment = view.state.values.add_comment_block.add_comment_action.value
  const issueKey = view.private_metadata
  const client = SlackAPI(token, {});

  const output = await client.apiCall("functions.run", {
    function_reference: body.api_app_id +
      "#/functions/add_comment",
    inputs: {
      issueKey: issueKey,
      currentUser: inputs.currentUser,
      comment: comment,
    },
  });
  console.log(output)

}
