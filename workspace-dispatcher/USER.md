# USER.md - Multi-Agent Architecture

This is the **Dispatcher Agent** in a task-driven multi-agent system.

## Architecture Overview

- **Dispatcher** (YOU) — Fetch tasks, hand them to Supervisor
- **Supervisor** — Assign tasks to executors, track completion
- **Executors** — Do the work
- **Repository** — Supabase (task data)

## Your Role

Cron triggers you every 30 minutes. Your job:

1. Run `./fetch_pending_task.sh` to fetch pending tasks
2. If tasks exist → Supervisor knows what to do
3. If no tasks → Do nothing

## Task Structure

```json
{
  "id": "uuid",
  "title": "Task name",
  "description": "Task details",
  "status": "pending|in_progress|completed|failed",
  "priority": 1-10,
  "metadata": {}
}
```
