import { z } from 'zod';

const avatarUrlsSchema = z.object({
  '16x16': z.string().url(),
  '24x24': z.string().url(),
  '32x32': z.string().url(),
  '48x48': z.string().url(),
});

const basicUserSchema = z.object({
  accountId: z.string(),
  accountType: z.string().optional(),
  active: z.boolean(),
  avatarUrls: avatarUrlsSchema.optional(),
  displayName: z.string(),
  key: z.string().optional(),
  name: z.string().optional(),
  self: z.string().url(),
});

const watcherSchema = z.object({
  isWatching: z.boolean(),
  self: z.string().url(),
  watchCount: z.number(),
});

const attachmentSchema = z.object({
  author: basicUserSchema,
  content: z.string().url(),
  created: z.string(),
  filename: z.string(),
  id: z.number(),
  mimeType: z.string(),
  self: z.string().url(),
  size: z.number(),
});

const statusSchema = z.object({
  iconUrl: z.string().url(),
  name: z.string(),
});

const issueReferenceSchema = z.object({
  fields: z.object({
    status: statusSchema,
  }),
  id: z.string(),
  key: z.string(),
  self: z.string().url(),
});

const issueLinkTypeSchema = z.object({
  id: z.string(),
  inward: z.string(),
  name: z.string(),
  outward: z.string(),
});

const issueLinkSchema = z.object({
  id: z.string(),
  inwardIssue: issueReferenceSchema.optional(),
  outwardIssue: issueReferenceSchema.optional(),
  type: issueLinkTypeSchema,
});

const subTaskSchema = z.object({
  id: z.string(),
  outwardIssue: issueReferenceSchema,
  type: issueLinkTypeSchema,
});

const projectCategorySchema = z.object({
  description: z.string(),
  id: z.string(),
  name: z.string(),
  self: z.string().url(),
});

const projectInsightSchema = z.object({
  lastIssueUpdateTime: z.string(),
  totalIssueCount: z.number(),
});

const projectSchema = z.object({
  avatarUrls: avatarUrlsSchema,
  id: z.string(),
  insight: projectInsightSchema.optional(),
  key: z.string(),
  name: z.string(),
  projectCategory: projectCategorySchema.optional(),
  self: z.string().url(),
  simplified: z.boolean().optional(),
  style: z.string().optional(),
});

const visibilitySchema = z.object({
  identifier: z.string(),
  type: z.string(),
  value: z.string(),
});

const commentSchema = z.object({
  author: basicUserSchema,
  body: z.string(),
  created: z.string(),
  id: z.string(),
  self: z.string().url(),
  updateAuthor: basicUserSchema,
  updated: z.string(),
  visibility: visibilitySchema.optional(),
});

const worklogSchema = z.object({
  author: basicUserSchema,
  comment: z.string(),
  id: z.string(),
  issueId: z.string(),
  self: z.string().url(),
  started: z.string(),
  timeSpent: z.string(),
  timeSpentSeconds: z.number(),
  updateAuthor: basicUserSchema,
  updated: z.string(),
  visibility: visibilitySchema.optional(),
});

const timetrackingSchema = z.object({
  originalEstimate: z.string(),
  originalEstimateSeconds: z.number(),
  remainingEstimate: z.string(),
  remainingEstimateSeconds: z.number(),
  timeSpent: z.string(),
  timeSpentSeconds: z.number(),
});

const fieldsSchema = z.object({
  watcher: watcherSchema.optional(),
  attachment: z.array(attachmentSchema).optional(),
  'sub-tasks': z.array(subTaskSchema).optional(),
  description: z.string().optional(),
  project: projectSchema,
  comment: z.array(commentSchema).optional(),
  issuelinks: z.array(issueLinkSchema).optional(),
  worklog: z.array(worklogSchema).optional(),
  updated: z.number().optional(),
  timetracking: timetrackingSchema.optional(),
});

export const jiraIssueSchema = z.object({
  expand: z.string(),
  fields: fieldsSchema,
  id: z.string(),
  key: z.string(),
  self: z.string().url(),
});
