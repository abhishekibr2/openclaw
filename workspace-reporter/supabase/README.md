## Supabase Usage - Reporter Agent

The Reporter agent **does not execute Supabase scripts directly**, but it relies heavily on the Supabase `tasks` table as a primary data source for reports and metrics.

This folder documents **how Supabase is used in the system** so the Reporter can reason about task data correctly.

---

### 1. Supabase Clients and Scripts (Other Workspaces)

These scripts live in other workspaces and are responsible for interacting with Supabase:

- **Dispatcher Supabase client**  
  - `workspace-dispatcher/supabase/supabase-client.js`  
  - `workspace-dispatcher/supabase/fetch-pending-tasks.js`  
  - Purpose: Fetch tasks with `status = 'pending'` and hand them to the `dispatcher` → `supervisour` flow.

- **Supervisor task status updater**  
  - `workspace-supervisour/supabase/update-task-status.js`  
  - Purpose: Update `tasks.status`, `completed_at`, `updated_at`, `result`, and `error` fields when a task completes or fails.

The Reporter **reads the results of these operations** through the Supabase `tasks` table (conceptually), but does not call these scripts itself.

---

### 2. Relevant Task Fields for Reporting

When reasoning about task data from Supabase, the Reporter should pay attention to:

- **`id`** – Unique task identifier (links to `task-report/[task-id].md`)
- **`title` / `description`** – Human-readable context for the task
- **`status`** – `pending | completed | done | failed`
- **`created_at`** – When the task was created
- **`updated_at`** – Last status update
- **`completed_at`** – When the task finished (for `completed` / `done`)
- **`priority`** – Used by Dispatcher to select tasks
- **`metadata`** – Extra structured data about the task
- **`result`** – Success message or output stored by Supervisor
- **`error`** – Failure reason stored by Supervisor for `failed` tasks

These fields map directly into **daily**, **weekly**, and **task-level** reports (success rate, average duration, common errors, etc.).

---

### 3. How Reporter Uses Supabase Data

When Supervisor requests a report (see `AGENTS.md` and `HEARTBEAT.md`), the Reporter should conceptually:

1. **Identify scope**  
   - Single task → use `id`, status fields, and timestamps  
   - Daily/weekly → filter tasks by `created_at` / `completed_at` range  

2. **Aggregate metrics**  
   - Count by `status` (completed/done/failed/pending)  
   - Compute success rate  
   - Compute average/median duration from `created_at` → `completed_at`  
   - Group by `priority` if useful  

3. **Analyze errors and obstacles**  
   - Group by `error` messages (login required, captcha, network errors, etc.)  
   - Surface frequent failure reasons in reports  

4. **Link to local reports**  
   - For each task, cross-reference:  
     - `task-report/[task-id].md`  
     - Entries in `memory/YYYY-MM-DD.md`  

---

### 4. Configuration References

Reporter-specific configuration lives in:

- `reporter-config.json`  
- `reporter-config-v2.json`

These files define things like:

- Template locations (`daily-report/report-template.md`, `weekly-report/weekly-template.md`, `task-report/multi-agent-status-2026-02-10.md`)
- Reporting schedule (daily/weekly/on-demand)
- Distribution targets (which agents receive reports)
- Metrics tracked and baseline files (e.g., `metrics/baseline-metrics-2026-02-10.json`)

The Supabase `tasks` table is the **authoritative source of task status**, while Executor/Notification/other agent memory files provide **rich narrative context**.

---

### 5. Mental Model for the Reporter

When thinking about Supabase, the Reporter should treat it as:

- **The ground-truth ledger** of all tasks (`tasks` table)  
- A source for **quantitative metrics** (counts, rates, durations)  
- A way to validate that local markdown reports and memory files match actual task statuses  

The actual low-level Supabase connectivity and updates are handled by **Dispatcher** and **Supervisor**.  
The Reporter focuses on **reading and interpreting** that data to produce clear, accurate, and structured reports.

