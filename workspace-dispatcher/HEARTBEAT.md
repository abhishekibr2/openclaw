# HEARTBEAT.md - Activation Trigger

## When This Agent Runs

Cron job triggers this agent every **30 minutes**.

## What To Do

1. Run `./fetch_pending_task.sh` to fetch pending tasks from Supabase
2. If tasks exist: Hand them over to Supervisor agent
3. If no tasks: Do nothing
4. Done.

### Command

```bash
./fetch_pending_task.sh
```
