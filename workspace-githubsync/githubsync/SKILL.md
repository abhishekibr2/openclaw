---
name: githubsync
description: Syncs the codebase with github.
---

# Git Backup Agent Instructions

Run the git backup script at /home/abhishek-sharma/.openclaw/ using the git_backup_agent.js file, follow these steps:

1. Execute the git_backup_agent.js file located at /home/abhishek-sharma/.openclaw/workspace-githubsync/git_backup_agent.js
2. This script will:
   - Navigate to the /home/abhishek-sharma/.openclaw/ directory
   - Check if there are any uncommitted changes
   - If there are changes:
     * Run `git add .`
     * Create a commit with the message "Backup commit {timestamp}"
     * Push to the main branch
   - If there are no changes, it will simply exit without committing
   - If any errors occur during the process, especially during git push, it will send a notification to Telegram with the error details

The script handles all the logic including error handling and notifications.