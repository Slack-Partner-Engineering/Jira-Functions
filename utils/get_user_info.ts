import { SlackAPI } from 'deno-slack-api/mod.ts';

export class User {

  /** This function converts a userID to a username using Slack's users.info API
   * @see https://api.slack.com/methods/users.info
   *
   * name: getUserInfo
   * type: helper function
   * inputs: token. Needed to make API call
   * inputs: userID. Needed to get display name from UserID.
   */
  async getUserName(token: any, userID: any) {
    console.log('getUserInfo called in utils: ')
    console.log('userID: ')
    // console.log(userID)
    // console.log(token)

    const client = SlackAPI(token, {});

    const userInfoResp = await client.apiCall("users.info", {
      user: userID,
    });
    console.log('userInfoResp in get user info: ')
    // console.log(userInfoResp)

    let user: any = await userInfoResp.user

    return user.name;
  }

  /** This checks if a user is a Slack user
   *
   * name: getUserInfo
   * type: helper function
   * inputs: token. Needed to make API call
   * input
   */ 
  async isSlackUser(token: string, userID: string): Promise<boolean> {
    console.log('getUserInfo called in utils: ')
    console.log('userID: ')
    // console.log(userID)

    const client = SlackAPI(token, {});

    const userInfoResp = await client.apiCall("users.info", {
      user: userID,
    });
    console.log('userInfoResp in get user info: ')
    // console.log(userInfoResp)
    if (userInfoResp.error) {
      return false
    }

    return true;
  }
}
