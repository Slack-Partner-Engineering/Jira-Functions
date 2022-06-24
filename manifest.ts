import { DefineFunction, Manifest, Schema } from "deno-slack-sdk/mod.ts";

export const FindIssue = DefineFunction({
  callback_id: "find_issue",
  title: "Find an Issue",
  description: "Create an issue in Jira right from Slack.",
  source_file: "functions/get_issue.ts",
  input_parameters: {
    properties: {
      issueKey: {
        type: Schema.types.string,
        description: "Key of the issue to look for",
      },
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Select channel to post the issue information in.",
      },
    },
    required: ["channel"],
  },
  output_parameters: {
    properties: {
      JiraResponse: {
        type: Schema.types.string,
        description: "The API response from Jira",
      },
    },
    required: ["JiraResponse"],
  },
});

export default Manifest({
  name: "Jira on Platform 2.0",
  description: "Create, Update, Find, and Close Jira Tickets all from Slack.",
  icon: "assets/icon.png",
  functions: [FindIssue],
  // outgoingDomains: ["dev88853.service-now.com"], this is what was needed for ServiceNow requests
  outgoingDomains: ["horeaporutiu.atlassian.net"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read"],
});

