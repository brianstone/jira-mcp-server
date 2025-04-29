export interface Issue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields?: IssueFields;
}

interface IssueFields {
  statuscategorychangedate: string;
  issuetype: IssueType;
  components: any[];
  timespent: null | number;
  timeoriginalestimate: null | number;
  project: Project;
  description: Description;
  fixVersions: any[];
  aggregatetimespent: null | number;
  statusCategory: StatusCategory;
  resolution: null | Resolution;
  timetracking: TimeTracking;
  security: null | any;
  attachment: any[];
  aggregatetimeestimate: null | number;
  resolutiondate: null | string;
  workratio: number;
  summary: string;
  issuerestriction: IssueRestriction;
  lastViewed: string;
  watches: Watches;
  creator: User;
  subtasks: any[];
  created: string;
  reporter: User;
  aggregateprogress: Progress;
  priority: Priority;
  labels: string[];
  environment: null | string;
  timeestimate: null | number;
  aggregatetimeoriginalestimate: null | number;
  versions: any[];
  duedate: null | string;
  progress: Progress;
  votes: Votes;
  comment: Comment;
  issuelinks: any[];
  worklog: Worklog;
  assignee: null | User;
  updated: string;
  status: Status;
  [key: `customfield_${string}`]: null | any;
}

interface IssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
  entityId: string;
  hierarchyLevel: number;
}

interface Project {
  self: string;
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
  simplified: boolean;
  avatarUrls: AvatarUrls;
}

interface Description {
  type: string;
  version: number;
  content: DescriptionContent[];
}

interface DescriptionContent {
  type: string;
  content?: DescriptionContentItem[];
}

interface DescriptionContentItem {
  type: string;
  text?: string;
}

interface StatusCategory {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
}

interface Resolution {
  self: string;
  id: string;
  description: string;
  name: string;
}

interface TimeTracking {
  originalEstimate?: string;
  remainingEstimate?: string;
  timeSpent?: string;
  originalEstimateSeconds?: number;
  remainingEstimateSeconds?: number;
  timeSpentSeconds?: number;
}

interface IssueRestriction {
  issueRestrictions: Record<string, unknown>;
  shouldDisplay: boolean;
}

interface Watches {
  self: string;
  watchCount: number;
  isWatching: boolean;
}

interface User {
  self: string;
  accountId: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
}

interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

interface Progress {
  progress: number;
  total: number;
}

interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

interface Votes {
  self: string;
  votes: number;
  hasVoted: boolean;
}

interface Comment {
  comments: any[];
  self: string;
  maxResults: number;
  total: number;
  startAt: number;
}

interface Worklog {
  startAt: number;
  maxResults: number;
  total: number;
  worklogs: any[];
}

interface Status {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
}
