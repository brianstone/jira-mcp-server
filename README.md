# Jira MCP Server

[![smithery badge](https://smithery.ai/badge/@brianstone/jira-mcp-server)](https://smithery.ai/server/@brianstone/jira-mcp-server)

⚠️ This MCP Server is a work in progress ⚠️

An MCP Server to communicate with Jira.

This may work with Jira Data Center rest endpoints (`/rest/api/2`), but as of right now only cloud endpoints have been tested (`/rest/api/3`).

## Running the Server

1. Clone this repo
2. `cd` into the repo
3. Run `npm install`
4. Run `npm run build`

In your MCP client, you'll need to add the following environment variables:

- `JIRA_PROJECT_URL` - Including `/rest/api/3` at the end. This should look like `https://your-project.atlassian.net/rest/api/3`.
- `JIRA_USER_EMAIL` - Your user email address. This is needed for Authorization with the API.
- `JIRA_API_KEY` - Your Jira API key. You can find info on creating and managing Jira API keys [here](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
- `JIRA_PROJECT_KEY` - The default key you'd like to use for creating new issues

## Available Tools

- Get Issue By Key
- Search Issues
- Create Issue
- Assign Issue
- Unassign Issue
- Edit Issue

## Resources

Setup, but none implemented.

## Setup with MCP Client (Claude Desktop, Cursor, etc.)

Add the server to the configuration file of your MCP Client.

```json
{
  "mcpServers": {
    "jira-mcp-server": {
      "command": "node",
      "args": ["path-to-repo/jira-mcp-server/build/index.js"],
      "env": {
        "JIRA_PROJECT_URL": "https://project-url.atlassian.net/rest/api/3",
        "JIRA_USER_EMAIL": "your_email@example.com",
        "JIRA_API_KEY": "yourAPIkey",
        "JIRA_PROJECT_KEY": "ABC"
      }
    }
  }
}
```

## Issues

Please open any issues if you encounter them.
