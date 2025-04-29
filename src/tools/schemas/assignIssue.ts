import z from 'zod';

export const assignIssueSchema = z.object({
  issueKey: z.string(),
  userQuery: z.string(),
});

export const unassignIssueSchema = z.object({
  issueKey: z.string(),
});

export const userResponseSchema = z.array(
  z.object({
    self: z.string(),
    accountId: z.string(),
    accountType: z.string(),
    emailAddress: z.string(),
    displayName: z.string(),
    active: z.boolean(),
    timeZone: z.string(),
    locale: z.string(),
  })
);
