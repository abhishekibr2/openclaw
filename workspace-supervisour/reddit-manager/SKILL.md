---
name: reddit-manager
description: Orchestrates Reddit engagement automation, including post discovery, comment generation, and reporting.
---

## Purpose
Manage the end-to-end workflow for automating Reddit comments to build karma through helpful, non-promotional engagement.

## Workflows

### Daily Engagement Cycle
1. **Initialize**: Determine target subreddits (e.g., r/AskReddit, r/NoStupidQuestions, r/Entrepreneur).
2. **Discovery**: For each subreddit, use the Executor to find posts 5-10 minutes old with 0-5 comments.
3. **Engagement**:
   - Read post content.
   - Generate a 3-layer comment (Insight + Tip + Personal Touch).
   - Post the comment via browser automation.
   - Log the activity.
4. **Finalize**: At the end of the day, trigger the Reporter to generate a performance summary.

## Constraints
- **Pacing**: Limit interactions to avoid spam detection.
- **Tone**: Maintain a 3-5 sentence helpful tone.
- **Safety**: No links, promotional content, or spam patterns.
- **Post Age**: Only target posts 5-10 minutes old.
- **Engagement Level**: Only target posts with 0-5 existing comments.
