# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Local notes and conventions that help you use your tools effectively. This file does **not** control which tools exist — it just documents how to use them in this workspace.

## Supabase Reporting Helpers

These bash scripts live in this workspace and are the canonical way for you to interact with Supabase for reporting:

### Fetch completed/done tasks for a time range

- Script: `./fetch_done_tasks.sh`
- Usage:
  - `./fetch_done_tasks.sh <startIso> <endIso>`
  - Example:
    - `./fetch_done_tasks.sh "2026-02-10T00:00:00.000Z" "2026-02-10T23:59:59.999Z"`
- Behavior:
  - Changes into `workspace-reporter/supabase/`
  - Calls the Node helper to fetch tasks with `status` in `['completed']` and `completed_at` between `<startIso>` and `<endIso>`
  - Prints the tasks as pretty JSON to stdout

Use this when you need a ground-truth list of completed tasks for daily/weekly/monthly reports.

### Insert a generated report into Supabase

- Script: `./insert_report.sh`
- Usage:
  - `./insert_report.sh <reportType> "<content>" [metadataJson]`
  - Examples:
    - `./insert_report.sh daily "Daily report content"`
    - `./insert_report.sh task "Task report for XYZ" '{"taskId":"123","status":"completed"}'`
- Behavior:
  - Changes into `workspace-reporter/supabase/`
  - Calls the Node helper to insert a row into the `reports` table with:
    - `content` → the report markdown/text
    - `report_type` → string like `daily`, `weekly`, `task`, `metrics`
    - `metadata` → optional JSON object (task IDs, date ranges, summary stats)

Use this after you generate a report to register it in the shared Supabase `reports` table.

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

Add whatever else helps you do your job. This is your cheat sheet.
