import { z } from 'zod';

export const transitionIssueSchema = z.object({
  issueKey: z.string(),
  transition: z.string(),
});

export const transitionsSchema = z.object({
  transitions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});
