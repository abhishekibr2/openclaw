# Supabase Task Status Update

This folder contains scripts for updating task status in the Supabase database.

## Files

- **`update-task-status.js`** — Node.js script that updates task status in Supabase
- **`../update-task.sh`** — Bash wrapper for easy command-line usage

## Usage

### From Bash (Recommended)

```bash
# Mark task as completed (success)
./update-task.sh <taskId> completed "Task finished successfully"

# Mark task as done (alternative success status)
./update-task.sh <taskId> done "Comment posted on Reddit"

# Mark task as failed
./update-task.sh <taskId> failed "Login required - credentials not available"
```

### From Node.js

```javascript
const { markTaskCompleted, markTaskFailed } = require('./supabase/update-task-status.js');

// Mark as completed
await markTaskCompleted('task-id-here', 'Task finished successfully');

// Mark as failed
await markTaskFailed('task-id-here', 'Error message here');
```

### Direct Node Execution

```bash
node supabase/update-task-status.js <taskId> [status] [message]
```

## Status Options

- **`completed`** — Task finished successfully (default)
- **`done`** — Alternative success status
- **`failed`** — Task failed (provide error message)

## Examples

```bash
# Simple completion
./update-task.sh 27fd3f9b-36f7-42a2-835f-8183f6b20ebf completed

# Completion with result message
./update-task.sh 27fd3f9b-36f7-42a2-835f-8183f6b20ebf completed "Successfully commented on Reddit post"

# Task failure with error
./update-task.sh 27fd3f9b-36f7-42a2-835f-8183f6b20ebf failed "Login credentials required"

# Alternative done status
./update-task.sh 27fd3f9b-36f7-42a2-835f-8183f6b20ebf done "Task executed"
```

## Environment Variables

The script uses environment variables from `/home/abhishek-sharma/.openclaw/.env`:

- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_ANON_KEY` — Your Supabase anonymous key

## Task Workflow

When Supervisor orchestrates a task:

1. **Receive task** from Dispatcher
2. **Break down** into sub-tasks
3. **Delegate** to Executor
4. **Monitor** execution
5. **Update status** using this script:
   - If all sub-tasks succeed → `completed`
   - If task fails → `failed` with error message

## What Gets Updated

The script updates the following fields in the `tasks` table:

**For completed/done tasks:**
- `status` → 'completed' or 'done'
- `completed_at` → current timestamp
- `updated_at` → current timestamp
- `result` → optional result message

**For failed tasks:**
- `status` → 'failed'
- `updated_at` → current timestamp
- `error` → error message

## Error Handling

The script will:
- Validate status values (only accepts: completed, done, failed)
- Check if task exists in database
- Return error if Supabase connection fails
- Exit with error code 1 on failure

## Supervisor Agent Usage

As the Supervisor agent, use this script when:

1. **All sub-tasks completed successfully:**
   ```bash
   ./update-task.sh $TASK_ID completed "All sub-tasks executed successfully"
   ```

2. **Task encountered an obstacle:**
   ```bash
   ./update-task.sh $TASK_ID failed "Login required - notified user"
   ```

3. **Executor reported success:**
   ```bash
   ./update-task.sh $TASK_ID done "Comment posted on Reddit"
   ```

Remember: You orchestrate, you don't execute. Update the status based on what your delegated agents report back.
