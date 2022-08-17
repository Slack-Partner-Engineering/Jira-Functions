// deno-lint-ignore-file no-explicit-any
import { SlackAPI } from 'deno-slack-api/mod.ts';

export class Channel {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.
  async postToChannel(token: any, channel: any, incidentBlock: any) {

    const client = SlackAPI(token, {});

    const resp = await client.apiCall("chat.postMessage", {
      channel: channel,
      blocks: incidentBlock,
      unfurl_links: false
    });

    return resp;
  }

  //returns channelInfo, such as channel name
  async getChannelInfo(token: any, channelID: any) {

    const client = SlackAPI(token, {});

    const channelInfoResp = await client.apiCall("conversations.info", {
      channel: channelID,
    });
    const channelInfo: any = await channelInfoResp.channel

    return channelInfo;
  }

  //use chat.postMessage
  async startAppDM(token: any, user: any) {

    const client = SlackAPI(token, {});
    const openDM = await client.apiCall("conversations.open", {
      users: user
    });

    return openDM

  }
}