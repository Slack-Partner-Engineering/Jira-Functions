import { Manifest} from "deno-slack-sdk/mod.ts";
import { AtlassianProvider } from "./auth/auth.ts";
import { CreateIssue } from "./functions/create_issue/definition.ts";
import { AddComment } from "./functions/add_comment/definition.ts";
import { UpdateStatus } from "./functions/update_status/definition.ts";
import { FindIssueByID } from "./functions/find_issue_by_id/definition.ts";
import { FindIssueByAssignee } from "./functions/find_issue_by_assignee/definition.ts";
import { CreateIssueWF } from "./workflows/create_issue_wf.ts";
import { AddCommentWF } from "./workflows/add_comment_wf.ts";
import { UpdateStatusWF } from "./workflows/update_status_wf.ts";
import { FindIssueByIDWF } from "./workflows/find_issue_by_id_wf.ts";
import { FindIssueByAssigneeWF } from "./workflows/find_issues_by_assignee_wf.ts";

export default Manifest({
  name: "Jira Functions Deployed",
  description: "Create, Update, Find, and Close Jira Tickets all from Slack.",
  icon: "assets/icon.png",
  workflows: [
    FindIssueByIDWF,
    FindIssueByAssigneeWF,
    CreateIssueWF, 
    AddCommentWF, 
    UpdateStatusWF
  ],

  functions: [
    FindIssueByID,
    FindIssueByAssignee,
    CreateIssue,
    AddComment,
    UpdateStatus
  ],
  outgoingDomains: ["horeaporutiu.atlassian.net"],
  botScopes: ["commands", "chat:write", "chat:write.public", "channels:read", "users:read", "im:write", "triggers:write"],
  externalAuthProviders: [
    AtlassianProvider,
  ],
});

