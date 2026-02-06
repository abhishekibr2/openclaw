# HEARTBEAT.md - Polling Tasks

## Dispatcher Polling Task

Every 60 seconds:
1. **Fetch pending tasks** from Supabase (status = 'pending'), sorted by priority DESC
2. **Check task count:**
   - If 0 tasks: Log and sleep
   - If N tasks: Notify Supervisor agent and log activity
3. **Log result** to `memory/YYYY-MM-DD.md`

### Execution

```javascript
// Call this function every 60 seconds
await dispatcherPoll();
```

See `tasks/fetch-pending-tasks.js` and `tasks/notify-supervisor.js` for implementation.
