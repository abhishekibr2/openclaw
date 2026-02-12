---
name: reddit-stats
description: Tracking and reporting for Reddit automation activities, including karma tracking and CSV generation.
---

## Purpose
Maintain detailed records of Reddit engagement and produce daily performance reports.

## Workflows

### log_activity
1. Record the following fields for every comment posted:
   - Timestamp
   - Subreddit
   - Post Title
   - Comment Text
2. Store data in a persistent local CSV or database.

### track_karma
1. Retrieve and log the account's total karma at the start of the session.
2. Retrieve and log the account's total karma at the end of the session.

### daily_report
1. Aggregate data from the activity log.
2. Calculate metrics:
   - Total comments posted.
   - Total karma gained.
   - Most active/successful subreddits.
3. Generate a CSV report and summarize findings.

## Constraints
- **Data Integrity**: Ensure every successful post is logged immediately.
- **Reporting Period**: Default reports should cover the last 24-hour cycle.
