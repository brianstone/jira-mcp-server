import { Issue } from './issues.types';

export function formatIssue(issue: Issue) {
  const issueFields = issue.fields;
  const issueType = issueFields?.issuetype;
  const issueProject = issueFields?.project;
  const issueTimeTracking = issueFields?.timetracking;

  return [
    `========== Issue ${issue.key} ==========`,
    `Id: ${issue.id}`,
    `Key: ${issue.key}`,
    `Status Category Change Date: ${issueFields?.statuscategorychangedate}`,
    `Issue Type: ${issueType?.name}`,
    `Subtask: ${issueType?.subtask}`,
    `Components: ${issueFields?.components.map((component) => component) || []}`,
    `Time Spent: ${issueFields?.timespent}`,
    `Time Original Estimate: ${issueFields?.timeoriginalestimate}`,
    `Project: ${issueProject?.name}`,
    `Project Id: ${issueProject?.id}`,
    `Project Key: ${issueProject?.key}`,
    `Description: ${JSON.stringify(issueFields?.description?.content)}`,
    `Fix Versions: ${issueFields?.fixVersions?.map((fixVersion) => fixVersion) || []}`,
    `Aggregate Time Spent: ${issueFields?.aggregatetimespent}`,
    `Status Category:  ${issueFields?.statusCategory.name}`,
    `Resolution: ${issueFields?.resolution?.description}`,
    `Resolution Date: ${issueFields?.resolutiondate}`,
    `Time Tracking - Original Estimate: ${issueTimeTracking?.originalEstimate}`,
    `Time Tracking - Original Estimate in Seconds: ${issueTimeTracking?.originalEstimateSeconds}`,
    `Time Tracking - Remaining Estimate: ${issueTimeTracking?.remainingEstimate}`,
    `Time Tracking - Remaining Estimate in Seconds: ${issueTimeTracking?.remainingEstimateSeconds}`,
    `Time Tracking - Time Spent: ${issueTimeTracking?.timeSpent}`,
    `Time Tracking - Time Spent in Seconds: ${issueTimeTracking?.timeSpentSeconds}`,
    // attachment: any[];
    `Aggregate Time Estimate: ${issueFields?.aggregatetimeestimate}`,
    `Work Ratio: ${issueFields?.workratio}`,
    `Summary: ${issueFields?.summary}`,
    // issueRestriction: IssueRestriction;
    `Last Viewed Date: ${issueFields?.lastViewed}`,
    // watches: Watches;
    `Creator Name: ${issueFields?.creator.displayName}`,
    `Creator Email: ${issueFields?.creator.emailAddress}`,
    `Subtasks: ${issueFields?.subtasks?.map((subtask) => subtask) || []}`,
    `Created Date: ${issueFields?.created}`,
    `Reporter Name: ${issueFields?.reporter.displayName}`,
    `Reporter Email: ${issueFields?.reporter.emailAddress}`,
    `Progress: ${issueFields?.progress.progress}`,
    `Progress Total: ${issueFields?.progress.total}`,
    `Priority: ${issueFields?.priority.name}`,
    `Labels: ${issueFields?.labels.map((label) => label) || []}`,
    `Environment: ${issueFields?.environment}`,
    `Time Estimate: ${issueFields?.timeestimate}`,
    `Aggreate Time Original Estimate: ${issueFields?.aggregatetimeoriginalestimate}`,
    `Versions: ${issueFields?.versions?.map((version) => version) || []}`,
    `Due Date: ${issueFields?.duedate}`,
    `Votes: ${issueFields?.votes.votes}`,
    `Has Voted: ${issueFields?.votes.hasVoted}`,
    `Comments: ${issueFields?.comment.comments?.map((comment) => comment) || []}`,
    `Issue Links: ${issueFields?.issuelinks?.map((issuelink) => issuelink) || []}`,
    `Work Log: ${issueFields?.worklog?.worklogs?.map((worklog) => worklog) || []}`,
    `Assignee Name: ${issueFields?.assignee?.displayName || 'Unassigned'}`,
    `Assignee Email: ${issueFields?.assignee?.emailAddress || 'Unassigned'}`,
    `Updated Date: ${issueFields?.updated}`,
    `Status: ${issueFields?.status.name}`,
  ].join('\n');
}
