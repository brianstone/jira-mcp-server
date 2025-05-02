import z from 'zod';
import { Tool } from '../tool';
import { apiKey, jiraProjectUrl } from '../../utils/utils';
import { Issue } from './issues.types';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { formatIssue } from './utils';
import { createIssueSchema } from '../schemas/createIssue';
import { searchIssuesSchema } from '../schemas/searchIssue';
import { assignIssueSchema, unassignIssueSchema, userResponseSchema } from '../schemas/assignIssue';
import { editIssueSchema, updatePayload } from '../schemas/editIssue';

const issueKeySchema = z.object({
  key: z.string().describe('The key of the issue (e.g. ABC-1)'),
});

const getIssueByKey: Tool = {
  schema: {
    name: 'get_issue_by_key',
    description: 'Get an issue by key',
    inputSchema: zodToJsonSchema(issueKeySchema),
  },
  handle: async (params) => {
    let validParams;

    const result = issueKeySchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
      };
    } else {
      validParams = result.data;
    }

    const issueUrl = `${process.env.JIRA_PROJECT_URL}/issue/${validParams.key}`;

    const response = await fetch(issueUrl, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Error retrieving issue. Error: ${JSON.stringify(await response.json())}`,
          },
        ],
        isError: true,
      };
    }

    const data: Issue = await response.json();

    const formattedIssue = formatIssue(data);
    const issueText = `Issue ${validParams.key}:\n\n${formattedIssue}`;

    return {
      content: [
        {
          type: 'text',
          text: issueText,
        },
      ],
    };
  },
};

const searchIssues: Tool = {
  schema: {
    name: 'search_issues',
    description: 'Search for issues using JQL',
    inputSchema: zodToJsonSchema(searchIssuesSchema),
  },
  handle: async (params) => {
    let validParams;
    const result = searchIssuesSchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
      };
    } else {
      validParams = result.data;
    }

    const issueUrl = `${process.env.JIRA_PROJECT_URL}/search/jql`;

    const response = await fetch(issueUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validParams),
    });

    if (!response.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Error searching issues. Error: ${JSON.stringify(await response.json())}`,
          },
        ],
        isError: true,
      };
    }

    const data = await response.json();

    if (data.issues.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No issues found for query.`,
          },
        ],
        isError: true,
      };
    }

    let issues: string[] = [];

    for (const i of data.issues) {
      const response = await fetch(i.self, {
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const issue: Issue = await response.json();
      const formattedIssue = formatIssue(issue);
      issues.push(formattedIssue);
    }

    return {
      content: [
        {
          type: 'text',
          text: `${issues}`,
        },
      ],
    };
  },
};

const createIssue: Tool = {
  schema: {
    name: 'create_issue',
    description: 'Create a new issue',
    inputSchema: zodToJsonSchema(createIssueSchema),
  },
  handle: async (params) => {
    let validParams;
    const result = createIssueSchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
      };
    } else {
      validParams = result.data;
    }

    const issueUrl = `${process.env.JIRA_PROJECT_URL}/issue/`;

    const response = await fetch(issueUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validParams),
    });

    if (!response.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Error creating issue. Error: ${JSON.stringify(await response.json())}`,
          },
        ],
        isError: true,
      };
    }

    const data = await response.json();

    return {
      content: [
        {
          type: 'text',
          text: `Issue created successfully. ${jiraProjectUrl()}/browse/${data.key}`,
        },
      ],
    };
  },
};

const assignIssue: Tool = {
  schema: {
    name: 'assign_issue',
    description: 'Assign an issue to a user.',
    inputSchema: zodToJsonSchema(assignIssueSchema),
  },
  handle: async (params) => {
    let validParams;
    const result = assignIssueSchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
      };
    } else {
      validParams = result.data;
    }

    const userSearchUrl = `${process.env.JIRA_PROJECT_URL}/user/search?query=${validParams.userQuery}`;

    const userResponse = await fetch(userSearchUrl, {
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `There was an error locating a user. Error: ${JSON.stringify(
              await userResponse.json()
            )}`,
          },
        ],
        isError: true,
      };
    }

    const userData = await userResponse.json();

    const user = userResponseSchema.parse(userData);

    if (user.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No user found for ${validParams.userQuery}`,
          },
        ],
        isError: true,
      };
    }

    const assignIssueUrl = `${process.env.JIRA_PROJECT_URL}/issue/${validParams.issueKey}/assignee`;

    const assignResponse = await fetch(assignIssueUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId: user[0].accountId }),
    });

    if (!assignResponse.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `There was an error assigning ${validParams.issueKey} to ${user[0].displayName}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Issue ${validParams.issueKey} assigned to ${user[0].displayName}`,
        },
      ],
    };
  },
};

const unassignIssue: Tool = {
  schema: {
    name: 'unassign_issue',
    description: 'Unassign an issue.',
    inputSchema: zodToJsonSchema(unassignIssueSchema),
  },
  handle: async (params) => {
    let validParams;
    const result = unassignIssueSchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
      };
    } else {
      validParams = result.data;
    }

    const unassignIssueUrl = `${process.env.JIRA_PROJECT_URL}/issue/${validParams.issueKey}/assignee`;

    const response = await fetch(unassignIssueUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountId: -1 }),
    });

    if (!response.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Error unassigning issue. Error: ${JSON.stringify(await response.json())}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Issue ${validParams.issueKey} successfully unassigned.`,
        },
      ],
    };
  },
};

const editIssue: Tool = {
  schema: {
    name: 'edit_issue',
    description: 'Edit the fields of an issue.',
    inputSchema: zodToJsonSchema(editIssueSchema),
  },
  handle: async (params) => {
    let validParams;
    const result = editIssueSchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
        isError: true,
      };
    } else {
      validParams = result.data;
    }

    const payload = await updatePayload(validParams.fieldsToUpdate);

    if (!payload) {
      return {
        content: [
          {
            type: 'text',
            text: 'Unable to create payload.',
          },
        ],
        isError: true,
      };
    }

    const updateIssueUrl = `${process.env.JIRA_PROJECT_URL}/issue/${validParams.issueKey}`;

    const updateResponse = await fetch(updateIssueUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!updateResponse.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Error updating issue ${
              validParams.issueKey
            }. Error: ${await updateResponse.json()}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Issue ${validParams.issueKey} updated successfully.`,
        },
      ],
    };
  },
};

const transitionIssueSchema = z.object({
  issueKey: z.string(),
  transition: z.string(),
});

const transitionIssue: Tool = {
  schema: {
    name: 'transition_issue',
    description: 'Transition an issue to another status.',
    inputSchema: zodToJsonSchema(transitionIssueSchema),
  },
  handle: async (params) => {
    let validParams;
    const result = transitionIssueSchema.safeParse(params);

    if (!result.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing parameters. Error: ${result.error.message}`,
          },
        ],
        isError: true,
      };
    } else {
      validParams = result.data;
    }

    const getTransitionsResponse = await fetch(
      `${process.env.JIRA_PROJECT_URL}/issue/${validParams.issueKey}/transitions`,
      {
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!getTransitionsResponse.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Issue retrieving transitions for ${
              validParams.issueKey
            }. Error: ${await getTransitionsResponse.json()}`,
          },
        ],
      };
    }

    const transitionsSchema = z.object({
      transitions: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ),
    });

    let issueTransitions;

    const transitionsResult = transitionsSchema.safeParse(await getTransitionsResponse.json());

    if (!transitionsResult.success) {
      return {
        content: [
          {
            type: 'text',
            text: `Error parsing transitions. Error: ${transitionsResult.error.message}`,
          },
        ],
        isError: true,
      };
    } else {
      issueTransitions = transitionsResult.data;
    }

    const transition = issueTransitions.transitions.filter((transition) => {
      return transition.name.toLowerCase() === validParams.transition.toLowerCase();
    });

    const transitionIssueResponse = await fetch(
      `${process.env.JIRA_PROJECT_URL}/issue/${validParams.issueKey}/transitions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transition: { id: transition[0].id } }),
      }
    );

    if (!transitionIssueResponse.ok) {
      return {
        content: [
          {
            type: 'text',
            text: `Error transitioning issue. Error: ${await transitionIssueResponse.json()}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Issue ${validParams.issueKey} transitioned to ${transition[0].name}`,
        },
      ],
    };
  },
};

export default [
  getIssueByKey,
  searchIssues,
  createIssue,
  assignIssue,
  unassignIssue,
  editIssue,
  transitionIssue,
];
