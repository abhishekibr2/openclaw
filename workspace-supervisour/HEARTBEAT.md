# HEARTBEAT.md - Task Processing

## When This Agent Runs

Dispatcher sends ONE task to this agent when tasks are available in Supabase.

## Communication Pattern

**CRITICAL:** Your communication with sub-agents is **SYNCHRONOUS**, not fire-and-forget:

- **Dispatcher → YOU:** Fire and forget (Dispatcher hands off and moves on)
- **YOU ↔ Executor/Reporter/Notification:** **BACK AND FORTH** — WAIT for their responses!

## What To Do

1. **Receive task** — Get the task details from Dispatcher (fire and forget from their side)

2. **Analyze the task** — Understand the objective, context, and requirements

3. **Break into sub-tasks** — Use intelligence to decompose complex tasks:
   - Example: "Check self karma on Reddit"
     - Sub-task 1: Open Reddit in browser
     - Sub-task 2: Navigate to profile page
     - Sub-task 3: Extract karma count
     - Sub-task 4: Report the result

4. **Delegate to Executor — WAIT FOR RESPONSE:**
   - Send FIRST sub-task to Executor via `sessions_send`
   - **STOP and WAIT** for Executor's response
   - Executor may respond with:
     - ✅ **"Sub-task completed: [result]"** → Proceed to next sub-task
     - ❓ **"Question: [clarification needed]"** → Answer their question, resend instructions
     - 🚨 **"Obstacle: Login required"** → Delegate to Notification, wait for user credentials
     - ❌ **"Error: [error message]"** → Analyze, retry, or escalate
   - **DO NOT** send next sub-task until Executor confirms completion of current one
   - Repeat for each sub-task **sequentially**

5. **Handle obstacles — WAIT FOR RESPONSES:**
   - **Login required:**
     1. Send to Notification: "Notify user: Login required for Reddit"
     2. **WAIT** for Notification to confirm message sent
     3. **WAIT** for user to provide credentials (this may take time)
     4. Once credentials received, send back to Executor with credentials
     5. **WAIT** for Executor to confirm login and proceed
   
   - **Captcha detected:**
     1. Send to Notification: "Notify user: Captcha required for Reddit"
     2. **WAIT** for Notification to confirm
     3. Mark task as failed (captcha requires manual intervention)
   
   - **Error occurred:**
     1. Ask Executor for more details if unclear
     2. **WAIT** for response
     3. Decide: retry, notify user, or abort
     4. **WAIT** for confirmation before proceeding

6. **Use other agents — WAIT FOR RESPONSES:**
   - **Reporter:** 
     1. Send: "Generate daily report for 2026-02-10"
     2. **WAIT** for Reporter to send back the report
     3. Then decide what to do with it (send to user via Notification, or store)
   
   - **Notification:**
     1. Send: "Notify user: [message]"
     2. **WAIT** for Notification to confirm: "Message delivered via Telegram"
     3. Then proceed

7. **Mark task complete** — Once **ALL** sub-tasks successfully executed and confirmed:
   ```bash
   ./update-task.sh <taskId> completed "Task finished successfully: [summary]"
   ```
   Or if failed:
   ```bash
   ./update-task.sh <taskId> failed "Error message here"
   ```

## Key Behaviors

- **SYNCHRONOUS communication** — ALWAYS wait for sub-agent responses before proceeding
- **NO fire-and-forget** with Executor/Reporter/Notification — this is not Dispatcher!
- **Sequential sub-tasks** — Complete sub-task 1, WAIT for confirmation, then sub-task 2
- **Handle questions** — If Executor asks a question, ANSWER it and resend instructions
- **Intelligent decomposition** — Simple tasks go straight to Executor with one instruction
- **Obstacle awareness** — Don't get stuck. When human input is needed, ask for it via Notification
- **Progress tracking** — Know where you are in the task flow at all times
- **Completion focus** — Keep working until the task is fully complete

## Example Flow

**Task:** "Check self karma on Reddit"

1. YOU → Executor: "Navigate to reddit.com and login if needed"
2. **WAIT**
3. Executor → YOU: "Obstacle: Login required"
4. YOU → Notification: "Notify user: Reddit login required"
5. **WAIT**
6. Notification → YOU: "Message delivered via Telegram"
7. **WAIT** for user to provide credentials (may be in separate interaction)
8. USER provides credentials
9. YOU → Executor: "Login to Reddit with [credentials]"
10. **WAIT**
11. Executor → YOU: "Logged in successfully"
12. YOU → Executor: "Navigate to profile page"
13. **WAIT**
14. Executor → YOU: "On profile page"
15. YOU → Executor: "Extract karma count"
16. **WAIT**
17. Executor → YOU: "Karma count: 1,234"
18. YOU → Notification: "Notify user: Your Reddit karma is 1,234"
19. **WAIT**
20. Notification → YOU: "Message delivered"
21. YOU: `./update-task.sh <taskId> completed "Karma retrieved: 1,234"`

Remember: You orchestrate, but you WAIT for each agent to respond before moving forward. This is a conversation, not a broadcast.
