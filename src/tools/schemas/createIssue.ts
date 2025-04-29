import {
  adfDocParagraph,
  adfDocHeading,
  adfBulletList,
  adfOrderedList,
  adfCodeBlock,
  adfBlockQuote,
} from './adfNodes';
import { z } from 'zod';

export const createIssueSchema = z
  .object({
    fields: z.object({
      assignee: z.object({ id: z.string() }).optional(),
      components: z.array(z.object({ id: z.string() })).optional(),
      description: z.object({
        type: z.string().default('doc'),
        version: z.number().default(1),
        content: z.array(
          z.discriminatedUnion('type', [
            adfDocParagraph,
            adfDocHeading,
            adfBulletList,
            adfOrderedList,
            adfCodeBlock,
            adfBlockQuote,
          ])
        ),
      }),
      duedate: z.string().optional(),
      fixVersions: z.array(z.object({ id: z.string() })).optional(),
      labels: z.array(z.string()).optional(),
      summary: z.string().optional(),
      project: z.object({ key: z.string().default(process.env.JIRA_PROJECT_KEY || '') }),
      issuetype: z.object({ name: z.string() }),
    }),
  })
  .describe('The schema to use for creating a new Jira issue.');
