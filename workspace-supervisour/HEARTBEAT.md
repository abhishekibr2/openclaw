# HEARTBEAT.md - Task Processing

## Communication Pattern

**CRITICAL:** Your communication with sub-agents is **SYNCHRONOUS**, not fire-and-forget:

- **YOU ↔ Executor/Reporter/Notification:** **BACK AND FORTH** — WAIT for their responses!

## What To Do

1. **Receive task** — Get the task details

2. **Analyze the task** — Understand the objective, context, and requirements

3. **Break into sub-tasks** — Use intelligence to decompose complex tasks:
   - Example: "Check self karma on Reddit"
     - Sub-task 1: Open Reddit in browser
     - Sub-task 2: Navigate to profile page
     - Sub-task 3: Extract karma count
     - Sub-task 4: Report the result

4. **Delegate to Executor using sessions_spawn:**
   - **Use `sessions_spawn` (RECOMMENDED)** for task delegation:
     ```
     sessions_spawn(
       task: "Navigate to reddit.com and check if logged in",
       agentId: "executor",
       label: "Check Reddit login status",
       runTimeoutSeconds: 300,  // 5 minutes max
       thinking : off
     )
     ```
   - Returns immediately: `{ status: "accepted", runId, childSessionKey }`
   - Executor runs task in isolated context
   - When done, Executor announces result back to you
   - You'll see announcement with: Status, Result, Notes
   - Proceed based on result:
     - ✅ **Success** → Spawn next sub-task
     - ❓ **Question from Executor** → Respond via sessions_send or spawn with clarification
     - 🚨 **Obstacle** → Spawn Notification agent
     - ❌ **Error** → Analyze, retry, or escalate
   - **DO NOT** spawn next sub-task until previous one completes

5. **Handle obstacles using sessions_spawn:**
   - **Login required:**
     ```
     sessions_spawn(
       task: "Notify user via Telegram: Login required for Reddit. Please provide credentials.",
       agentId: "notification",
       label: "Alert: login required",
       runTimeoutSeconds: 60,
       thinking : off
     )
     ```
     - Wait for announcement (message delivered)
     - **WAIT** for user to provide credentials
     - Once credentials received, spawn Executor again with credentials
   
   - **Captcha detected:**
     ```
     sessions_spawn(
       task: "Notify user via Telegram: Captcha detected. Manual intervention required.",
       agentId: "notification",
       label: "Alert: captcha",
       runTimeoutSeconds: 60,
       thinking : off
     )
     ```
     - Mark task as failed (captcha requires manual intervention)
   
   - **Error occurred:**
     - Analyze the error from announcement
     - Decide: retry (spawn again), notify user, or abort

6. **Use other agents via sessions_spawn:**
   - **Reporter:** 
     ```
     sessions_spawn(
       task: "Generate daily report for 2026-02-10",
       agentId: "reporter",
       label: "Daily report",
       runTimeoutSeconds: 180,
       thinking : off
     )
     ```
     - Wait for announcement with report
     - Decide what to do with report (send to user, store, etc.)
   
   - **Notification:**
     ```
     sessions_spawn(
       task: "Notify user via Telegram: Your Reddit karma is 1,234",
       agentId: "notification",
       label: "Send karma result",
       runTimeoutSeconds: 60,
       thinking : off
     )
     ```
     - Wait for announcement (message delivered)

7. **Log to Daily Report** — Before marking complete, log the task:
   - Determine today's date (DD-MM-YYYY)
   - Append to `~/.openclaw/workspace-supervisour/report/DD-MM-YYYY.md`
   - **Format:** Create a detailed Markdown block.
   - Use `run_command` to append a multi-line string (structured for readability):

     ```bash
     # Example logical flow (implement with echo or cat)
     echo "" >> .../report/$(date +%d-%m-%Y).md
     echo "## Task <id>: <status>" >> .../report/$(date +%d-%m-%Y).md
     echo "**Time:** $(date +%H:%M)" >> .../report/$(date +%d-%m-%Y).md
     echo "**Summary:** <brief_description>" >> .../report/$(date +%d-%m-%Y).md
     echo "**Actions:**" >> .../report/$(date +%d-%m-%Y).md
     echo "- [Action 1]" >> .../report/$(date +%d-%m-%Y).md
     echo "- [Action 2]" >> .../report/$(date +%d-%m-%Y).md
     echo "**Challenges:**" >> .../report/$(date +%d-%m-%Y).md
     echo "- [Challenge descriptions...]" >> .../report/$(date +%d-%m-%Y).md
     echo "**Errors:**" >> .../report/$(date +%d-%m-%Y).md
     echo "- [Error logs...]" >> .../report/$(date +%d-%m-%Y).md
     echo "---" >> .../report/$(date +%d-%m-%Y).md
     ```
     *(Note: Ensure directory exists. Use a single detailed block per task.)*

8. **Mark task complete** — Once **ALL** sub-tasks successfully executed and confirmed:

## Key Behaviors

- **SYNCHRONOUS communication** — ALWAYS wait for sub-agent responses before proceeding
- **NO fire-and-forget** with Executor/Reporter/Notification
- **Sequential sub-tasks** — Complete sub-task 1, WAIT for confirmation, then sub-task 2
- **Handle questions** — If Executor asks a question, ANSWER it and resend instructions
- **Intelligent decomposition** — Simple tasks go straight to Executor with one instruction
- **Obstacle awareness** — Don't get stuck. When human input is needed, ask for it via Notification
- **Progress tracking** — Know where you are in the task flow at all times
- **Completion focus** — Keep working until the task is fully complete

## Example Flow (Using sessions_spawn)

**Task:** "Check self karma on Reddit"

1. **Spawn Executor** for first sub-task:
   ```
   sessions_spawn(
     task: "Navigate to reddit.com and check if logged in",
     agentId: "executor",
     label: "Check Reddit login",
     runTimeoutSeconds: 300,
     thinking : off
   )
   ```
   Returns: `{ status: "accepted", runId: "...", childSessionKey: "..." }`

2. **Wait for announcement** from Executor:
   ```
   [Announcement from executor]
   Status: error
   Result: Obstacle - Login required
   Notes: Reddit requires authentication
   ```

3. **Spawn Notification** to alert user:
   ```
   sessions_spawn(
     task: "Notify user via Telegram: Reddit login required. Please provide credentials.",
     agentId: "notification",
     label: "Alert: login required",
     runTimeoutSeconds: 60,
     thinking : off
   )
   ```

4. **Wait for announcement** from Notification:
   ```
   [Announcement from notification]
   Status: success
   Result: Message delivered via Telegram to user 1384407297
   ```

5. **WAIT** for user to provide credentials (may take time)

6. USER provides credentials via Telegram

7. **Spawn Executor** to login:
   ```
   sessions_spawn(
     task: "Login to Reddit with username: [user] password: [pass], then navigate to profile",
     agentId: "executor",
     label: "Login and go to profile",
     runTimeoutSeconds: 300,
     thinking : off
   )
   ```

8. **Wait for announcement**:
   ```
   [Announcement from executor]
   Status: success
   Result: Logged in successfully and on profile page
   ```

9. **Spawn Executor** to extract karma:
   ```
   sessions_spawn(
     task: "Extract karma count from profile page",
     agentId: "executor",
     label: "Get karma count",
     runTimeoutSeconds: 120,
     thinking : off
   )
   ```

10. **Wait for announcement**:
    ```
    [Announcement from executor]
    Status: success
    Result: Karma count: 1,234
    ```

11. **Spawn Notification** to inform user:
    ```
    sessions_spawn(
      task: "Notify user via Telegram: Your Reddit karma is 1,234",
      agentId: "notification",
      label: "Send karma result",
      runTimeoutSeconds: 60,
      thinking : off
    )
    ```

**Key Pattern:**
- Spawn sub-agent → Get immediate acceptance
- Wait for announcement → Get result
- Proceed based on announcement status
- No blocking, no timeouts, clean isolation
