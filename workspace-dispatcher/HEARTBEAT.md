# HEARTBEAT.md - Task Checking Workflow

## When This Agent Runs

Triggered by **cron** in the openclaw library (periodic wake-up).

## What To Do

1. **Check for pending tasks** — Run `./fetch_pending_task.sh` to query Supabase
2. **If tasks found**:
   - Take the **first pending task** (highest priority or oldest)
   - Send it to Supervisor agent using multi-agent communication:
   ```
   sessions_send(
     sessionKey: "agent:supervisour:main",
     message: "New task: [task details]",
     timeoutSeconds: 30
   )
   ```
   - Log the handoff in `memory/YYYY-MM-DD.md`
3. **If no tasks found**:
   - Reply `HEARTBEAT_OK`
   - Go back to sleep
4. Done until next cron trigger

## Key Behaviors

- **One task at a time** — Only send ONE task to Supervisor per cycle
- **Priority handling** — Send highest priority tasks first
- **No retry logic** — If Supervisor receives the task, your job is done
- **Minimal logging** — Just track task handoffs

---

_Check. Delegate. Sleep. Repeat._
