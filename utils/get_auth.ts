export class Auth {

  // This function returns the Auth string needed to Auth into ServiceNow APIs using Basic Auth.
  async getBasicAuth(env: any) {
    //needed for auth,
    const username = env["JIRA_USERNAME"];
    const password = env["JIRA_API_KEY"];
    const basicAuth = await "Basic " + btoa(username + ":" + password);
    return basicAuth
  }

  // This function returns the Auth string needed to Auth into ServiceNow APIs using Bearer Auth.
  async getBearerAuth(env: any) {
    //needed for Bearer Auth
    const accessToken = env["ACCESS_TOKEN"];

    const bearerAuth = await "Bearer " + accessToken
    return bearerAuth
  }
}