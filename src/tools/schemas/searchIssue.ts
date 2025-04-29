import { z } from 'zod';

export const searchIssuesSchema = z.object({
  expand: z.string().optional(),
  fields: z.array(z.string()).optional(),
  fieldsByKeys: z.boolean().default(false),
  jql: z.string(),
  maxResults: z.number().default(50),
  nextPageToken: z.string().optional(),
  properties: z.array(z.string()).length(5),
  reconcileIssues: z.array(z.number()).optional(),
});
