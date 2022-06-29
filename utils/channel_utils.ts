import { SlackAPI } from 'deno-slack-api/mod.ts';

export class Channel {

  // This function returns the state - it converts from integer which is often returned 
  // from ServiceNow to the value which is more readable. For example - 6 means Resolved.
  async postToChannel(token: any, channel: any, incidentBlock: any) {
    console.log('postToChannel called in utils: ')

    const client = SlackAPI(token, {});

    const resp = await client.apiCall("chat.postMessage", {
      channel: channel,
      blocks: incidentBlock,
    });

    return resp;
  }

  //returns channelInfo, such as channel name
  async getChannelInfo(token: any, channelID: any) {
    console.log('getChannelInfo called in utils: ')

    const client = SlackAPI(token, {});

    const channelInfoResp = await client.apiCall("conversations.info", {
      channel: channelID,
    });
    let channelInfo: any = await channelInfoResp.channel

    return channelInfo;
  }

  //use chat.postMessage
  async startAppDM(token: any, user:any) {
    console.log('this function will start an app DM. The DM will be coming from the installed app.')

    const client = SlackAPI(token, {});
    console.log('user: ')
    console.log(user)

    const openDM = await client.apiCall("conversations.open", {
      users:user
    });
    console.log('after conversations.open in startAppDM function')
    console.log(openDM)
    return openDM

  }
}