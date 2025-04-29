export const apiKey = Buffer.from(
  `${process.env.JIRA_USER_EMAIL}:${process.env.JIRA_API_KEY}`
).toString('base64');

export const jiraProjectUrl = () => {
  const url = process.env.JIRA_PROJECT_URL || '';
  const baseUrl = url.replace(/\/rest\/api\/\d+$/, '');
  return baseUrl;
};
