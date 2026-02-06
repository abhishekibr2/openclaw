# Dispatcher Agent

**The Task Router** — Finds work, delegates to Supervisor, repeats.

## Overview

The Dispatcher Agent is responsible for:
1. **Polling** Supabase for pending tasks (every 60 seconds)
2. **Notifying** the Supervisor Agent when tasks are available
3. **Logging** all polling activity to daily memory files
4. **Sleeping** when no tasks are available

This is a **headless agent** — no direct user interaction. It runs on a schedule and coordinates task flow through the multi-agent system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Dispatcher Agent                          │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Fetch      │  │   Notify     │  │    Log Memory   │   │
│  │   Pending    │→ │  Supervisor  │→ │     Activity    │   │
│  │    Tasks     │  │              │  │                 │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│         ↓                                                    │
│    Supabase                      Supervisor Queue           │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
workspace-dispatcher/
├── SOUL.md                          # Purpose & operating principles
├── IDENTITY.md                      # Agent identity & vibe
├── USER.md                          # Multi-agent context
├── HEARTBEAT.md                     # Polling schedule/tasks
├── BOOTSTRAP.md                     # Bootstrap instructions
├── AGENTS.md                        # Agent guidelines
├── TOOLS.md                         # Local configuration
├── package.json                     # Dependencies
├── README.md                        # This file
├── tasks/
│   ├── dispatcher.js               # Main polling orchestrator
│   ├── supabase-client.js          # Supabase connection
│   ├── fetch-pending-tasks.js      # Task query logic
│   ├── notify-supervisor.js        # Supervisor notification
│   └── memory-logger.js            # Activity logging
└── memory/
    └── YYYY-MM-DD.md               # Daily activity logs (auto-created)
```

## Setup

### 1. Install Dependencies

```bash
cd /home/ibr-ai-agent/.openclaw/workspace-dispatcher
npm install
```

### 2. Verify .env

Ensure `/home/ibr-ai-agent/.openclaw/.env` contains:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Test Connection

```bash
npm test
```

Expected output:
```json
{
  "healthy": true,
  "timestamp": "2026-02-06T10:30:00.000Z",
  "supabaseConnected": true
}
```

## Polling Cycle

### Every 60 Seconds:

1. **POLL_START** event logged
2. Test Supabase connection
3. Fetch all tasks with `status = 'pending'`
4. Sort by priority (descending), then creation time (ascending)
5. **If 0 tasks:**
   - Log `POLL_NO_TASKS`
   - Return early (agent sleeps)
   - Next poll in 60 seconds
6. **If N tasks:**
   - Format tasks for Supervisor
   - Write notification to Supervisor's queue
   - Log `SUPERVISOR_NOTIFIED` with stats
   - Return success

### Environment Handling:

- **Connection Error:** Log error, continue polling next cycle
- **Supervisor Unreachable:** Log error, task remains pending (Supervisor can pick it up later)
- **Unexpected Error:** Log full error, retry next cycle

## Task Notification Format

When tasks are found, Dispatcher writes to:
```
../.openclaw/agents/supervisour/sessions/pending_queue.jsonl
```

Each notification (JSONL format):
```json
{
  "type": "tasks_available",
  "timestamp": "2026-02-06T10:30:00.000Z",
  "task_count": 3,
  "from_agent": "dispatcher",
  "tasks": [
    {
      "id": "uuid",
      "title": "Process data export",
      "description": "Extract monthly metrics from warehouse",
      "priority": 8,
      "metadata": {...},
      "created_at": "2026-02-06T10:20:00.000Z"
    },
    ...
  ]
}
```

## Memory Logs

All activity is logged to `memory/YYYY-MM-DD.md`:

```markdown
# Memory Log - 2026-02-06

## Dispatcher Polling Activity

---

**[2026-02-06T10:30:05.123Z]** POLL_START

**[2026-02-06T10:30:06.456Z]** POLL_TASKS_FOUND
```json
{
  "task_count": 3,
  "supervisor_notified": true,
  "stats": {
    "total": 3,
    "byPriority": { "8": 2, "5": 1 },
    "highestPriority": 8
  }
}
```

**[2026-02-06T10:31:05.789Z]** POLL_NO_TASKS
```json
{
  "task_count": 0,
  "supervisor_notified": false
}
```
```

## Manual Testing

### Test Polling:

```bash
npm run poll
```

### Check Today's Memory:

```bash
cat memory/$(date +%Y-%m-%d).md
```

### List Recent Logs:

```bash
ls -la memory/ | tail -5
```

## API Reference

### `dispatcherPoll()`
**Main polling function. Call every 60 seconds.**

Returns:
```javascript
{
  success: boolean,
  message: string,
  tasksProcessed: number,
  stats: {
    total: number,
    byPriority: Object,
    highestPriority: number
  }
}
```

### `healthCheck()`
**Check Dispatcher health.**

Returns:
```javascript
{
  healthy: boolean,
  timestamp: string,
  supabaseConnected: boolean,
  error?: string
}
```

## Task Lifecycle in the System

```
┌──────────────┐
│   NEW TASK   │
│  (pending)   │
└──────┬───────┘
       │
       ↓
┌──────────────────────┐
│ Dispatcher Finds Task│
│   (every 60 sec)     │
└──────┬───────────────┘
       │
       ↓ (notifies)
┌──────────────────────┐
│  Supervisor Agent    │
│  - Picks executor    │
│  - Assigns task      │
│  (status: in_progress)
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Executor Agent(s)    │
│ - Perform work       │
│ - Create reports     │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│  Task Complete/Failed│
│   (supervisor updates)
│  status: completed   │
│  status: failed      │
└──────────────────────┘
```

## Troubleshooting

### No tasks being found?
- Check Supabase has data: `select count(*) from tasks where status = 'pending';`
- Check network connection: `npm test`
- Check memory logs: `cat memory/$(date +%Y-%m-%d).md`

### Supervisor not receiving tasks?
- Check supervisor queue path exists: `ls -la ../.openclaw/agents/supervisour/sessions/`
- Check dispatcher logs: `cat memory/$(date +%Y-%m-%d).md`
- Check queue file: `tail -20 ../.openclaw/agents/supervisour/sessions/pending_queue.jsonl`

### Connection errors?
- Verify `.env` file exists and has valid credentials
- Test Supabase connection: `npm test`
- Check internet connectivity

## Notes

- Dispatcher is **stateless** — all state lives in Supabase and daily memory logs
- **No retries** on supervisor notification failure — next polling cycle will find the task again
- **No rate limiting** — uses standard Supabase client (respects Supabase rate limits)
- **Graceful degradation** — errors are logged, next poll continues as normal

---

*Keep it simple. Find work. Hand it off. Repeat.*
