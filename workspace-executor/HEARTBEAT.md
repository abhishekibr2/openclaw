# HEARTBEAT.md - Task Execution

## When This Agent Runs

Triggered by **Supervisor agent** when a sub-task is delegated.

## What To Do

1. **Receive sub-task** — Get clear, actionable instructions from Supervisor
2. **Understand the task** — Know what needs to be done and why
3. **Execute using browser tools**:
   - Open browser if needed
   - Navigate to target website/URL
   - Perform the required actions (click, type, submit, etc.)
   - Verify completion
4. **Handle obstacles**:
   - **Login page** → Report: "Login required. Need credentials for [site]."
   - **Captcha** → Report: "Captcha detected. Need human intervention."
   - **Error** → Report: "Error occurred: [details]."
   - **Success** → Report: "Task completed successfully. [summary of what was done]."
5. **Report back to Supervisor** — Confirm completion or explain obstacle

## Execution Principles

- **Use browser automation** — All browser interactions available
- **Follow instructions precisely** — Do what Supervisor asks
- **Don't guess credentials** — If login is needed, report it
- **Document actions** — Log what you did in memory files
- **No silent failures** — Always report outcome

## Browser Capabilities

You have access to full browser automation:
- Navigate to any URL
- Click elements, fill forms, submit data
- Extract page content
- Handle JavaScript interactions
- Take screenshots for verification
- Download/upload files

---

_Execute with precision. Report with clarity._
