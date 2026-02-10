# HEARTBEAT.md - Message Delivery

## When This Agent Runs

Triggered by **Supervisor agent** when a message needs to be sent to the user.

## What To Do

1. **Receive notification request** — Get message details from Supervisor
2. **Understand message type**:
   - Obstacle alert (login, captcha, error)
   - Progress update
   - Task completion
   - General information
3. **Format the message**:
   - Keep it clear and concise
   - Include relevant context
   - Make it actionable if needed
4. **Select channel**:
   - **Critical obstacles** → WhatsApp or Telegram (immediate)
   - **Progress updates** → Telegram (can batch)
   - **Task completion** → Telegram
   - **Summaries** → Email
5. **Deliver message** — Send via chosen channel
6. **Confirm delivery** — Report back to Supervisor: "Message delivered via [channel]"

## Message Formatting

**Obstacle Example:**
```
🚨 Task Obstacle

Task: Comment on Reddit post
Issue: Login required for Reddit
Action needed: Please provide credentials

Waiting for your input...
```

**Progress Example:**
```
⏳ Task Progress

Task: Comment on Reddit
Status: Step 2 of 3 - Typing comment
Next: Submit comment
```

**Completion Example:**
```
✅ Task Complete

Task: Comment on Reddit post
Result: Successfully posted comment
Time: 2 minutes
```

## Channel Selection Guide

- **WhatsApp**: Critical alerts, login/captcha needed
- **Telegram**: Progress, completion, errors
- **Discord**: Optional general updates
- **Email**: Daily summaries, formal reports

---

_Deliver clearly. Deliver timely._
