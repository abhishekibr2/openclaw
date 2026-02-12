# HEARTBEAT.md - Report Generation

## When This Agent Runs

Use this workflow whenever a report is requested (by the **user** or by the **Supervisor**).

## What To Do

1. **Receive report request** — Get report type (task/daily/weekly/monthly/metrics) and scope (task ID, date, week, month, etc.) from the requester
2. **Determine time range** (for daily/weekly/monthly reports):
   - Daily: start/end of the requested day
   - Weekly: start/end of the requested week
   - Monthly: start/end of the requested month
3. **Gather data**:
   - **Read Supervisor's report** (Primary Source): `/home/ibr-ai-agent/.openclaw/workspace-supervisour/report/YYYY-MM-DD.md`
   - Read Executor's memory logs (task executions)
   - Read Notification logs (messages sent)
   - Review memory files from agents
4. **Analyze data**:
   - Calculate success/failure rates
   - Identify patterns and obstacles
   - Measure execution times
   - Note key achievements
5. **Generate report** — Create structured documentation:
   - Task Summary Report
   - Daily Report
   - Weekly/Monthly Summary
   - Performance Metrics
6. **Persist report**:
   - Save markdown to the appropriate file:
     - `task-report/[task-id].md`
     - `daily-report/YYYY-MM-DD.md`
     - `weekly-report/YYYY-WW.md` (or similar monthly file)
7. **Deliver report** — Reply with the report content to whoever requested it (user or Supervisor)

## Report Templates

**Task Summary Report:**
```markdown
# Task Report: [Task Title]

## Overview
- **Task ID:** [id]
- **Status:** Completed/Failed
- **Started:** [timestamp]
- **Completed:** [timestamp]
- **Duration:** [time taken]

## Execution
- **Sub-tasks:** [number completed/total]
- **Actions taken:** [summary]

## Obstacles
- [List any obstacles: login, captcha, errors]

## Results
- **Outcome:** [what was achieved]
- **Output:** [files, links, data generated]
```

**Daily Report:**
```markdown
# Daily Report: [Date]

## Summary
- **Tasks executed:** [number]
- **Success rate:** [percentage]
- **Total time:** [duration]

## Completed Tasks
1. [Task 1] - Success
2. [Task 2] - Failed (reason)

## Common Obstacles
- Login required: [count]
- Captcha: [count]
- Errors: [count]

## Key Achievements
- [Notable successes]
```

## Report Storage

Save reports to:
- `task-report/[task-id].md` — Individual task reports
- `daily-report/YYYY-MM-DD.md` — Daily summaries
- `weekly-report/YYYY-WW.md` — Weekly summaries
- `metrics/performance.json` — Performance metrics
---

_Document thoroughly. Report clearly._
