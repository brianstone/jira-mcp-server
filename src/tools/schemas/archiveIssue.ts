import { z } from 'zod';

export const archiveIssueSchema = z.object({
  issueIdsOrKeys: z.array(z.string()).describe('An array of issue ids or keys'),
  jql: z.string().describe('The JQL for which to query issues.'),
});

const errorPropertiesSchema = z.object({
  count: z.number(),
  issueIdsOrKeys: z.array(z.string()),
  message: z.string(),
});

const archiveErrors = z.object({
  issueIsSubtask: errorPropertiesSchema,
  issuesInArchivedProjects: errorPropertiesSchema,
  issuesInUnlicensedProjects: errorPropertiesSchema,
  issuesNotFound: errorPropertiesSchema,
  userDoesNotHavePermission: errorPropertiesSchema,
});

export const archiveResponseSchema = z.object({
  errors: archiveErrors,
  numberOfIssuesUpdated: z.number(),
});
