# HEARTBEAT.md - Report Generation

## When This Agent Runs

Triggered by **Supervisor agent** when a report is needed.

## What To Do

1. **Receive report request** — Get report type and scope from Supervisor
2. **Gather data**:
   - Read Executor's memory logs (task executions)
   - Read Notification logs (messages sent)
   - Query Supabase for task statuses
   - Review memory files from agents
3. **Analyze data**:
   - Calculate success/failure rates
   - Identify patterns and obstacles
   - Measure execution times
   - Note key achievements
4. **Generate report** — Create structured documentation:
   - Task Summary Report
   - Daily Report
   - Weekly Summary
   - Performance Metrics
5. **Deliver report** — Send to Supervisor (who may forward to Notification for user delivery)

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
