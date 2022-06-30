# 🤖 Jira Functions 🤖

This project aims to speed up the time to understand & implement functions with the [beta Slack platform](https://api.slack.com/future/quickstart). It uses the beta platform to perform CRUD operations (Create, Read, Update, Delete) for a Jira Cloud instance (must be configured via env variables) within Slack. 

# Steps 
1. [Clone the repo](#step-1-clone-the-repo)
2. [Jira Cloud Configuration Via Environmental Variables](#step-2-Jira-cloud-configuration-via-environmental-variables)
3. [Add Environmental Variables in Hermes](#step-3-add-environmental-variables-in-hermes)
4. [Deploy the App](#step-4-deploy-the-app)
4. [Run the Functions](#step-4-run-the-functions)

## Step 1. Clone the Repo

```git clone git@slack-github.com:hporutiu/Jira-Functions.git```

## Step 2. Jira Cloud Configuration Via Environmental Variables

First, we will learn Basic Auth since it is easier to setup. All we need is your `JIRA_USERNAME` and
 `JIRA_API_KEY`. We will need to set these environmental variables so that our Slack app can be connected 
to the right 
Jira Cloud account.

* Your JIRA_USERNAME should be your email, unless you changed it. Mine is `helloworld@gmail.com`
* Your JIRA_API_KEY will just be your api key that you created in Jira. If you haven't done so yet, check the [docs](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/).
* Your JIRA_INSTANCE should be `<jirainstance>.atlassian.net`. Mine is `horeaporutiu.atlassian.net`.
* Your JIRA_PROJECT is whatever you named your project. Mine is `TEST`.
 
For example, in the screenshot below, you can find my `JIRA_INSTANCE` in the browser, and then then my `JIRA_PROJECT` right under the URL.

[![Jira_Project](https://media.slack-github.com/user/2212/files/f2b57aeb-493f-4b56-b049-80095ede916a)](https://media.slack-github.com/user/2212/files/f2b57aeb-493f-4b56-b049-80095ede916a)

> If you want to run this is local mode, you will need to copy the `sample.env` file, rename it to `.env`, add your env variables, and then run `source .env` to set your variables. 

Save all those to a clipboard, since you will need to set them as env variables.

## Step 3. Add Environmental Variables in Hermes
Now, we will need to add our env variables in Hermes. You will do so with the CLI. Make sure you are logged into the CLI first. If you haven't gotten the CLI installed, 
you can find the install script [here](https://api.slack.com/future/quickstart).

```bash
$ hermes var add JIRA_USERNAME [Ctrl+V] [Enter]
$ hermes var add JIRA_API_KEY [Ctrl+V] [Enter]
$ hermes var add JIRA_INSTANCE [Ctrl+V] [Enter]
$ hermes var add JIRA_PROJECT [Ctrl+V] [Enter]
```

Now that we've added our env variables, we need to tell our Slack Function which domains that we will be sending requests to.
Change this line in your manifest file to use your `JIRA_INSTANCE`. Since my `JIRA_INSTANCE` is `horeaporutiu.atlassian.net`, I will change my `outgoing_domains` to be the following:

```
"outgoing_domains": ["horeaporutiu.atlassian.net"]
```

## Step 4. Deploy the App

That's it, you're ready to deploy.

```bash
$ hermes deploy
```

## Step 5. Run the Functions

[![FindByID](https://media.slack-github.com/user/2212/files/f2b57aeb-493f-4b56-b049-80095ede916a)](https://media.slack-github.com/user/2212/files/7030e5bf-f872-48ed-94b3-5d9274020f0e)

[![CreateUpdate](https://media.slack-github.com/user/2212/files/f2b57aeb-493f-4b56-b049-80095ede916a)](https://media.slack-github.com/user/2212/files/fcbc08be-1cf1-4365-9126-e6d4ff5b311a)




Great job! Now you should be able to find your shortcut in the shortcuts menu! Go ahead and try it out by clicking on the shortcut and filling in the form.

## 🎊 Conclusion 🎊 

Great job! You've learned how to develop your first Function with Slack's beta platform. Please file any issues you may have in this repo.
