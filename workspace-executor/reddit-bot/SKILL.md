---
name: reddit-bot
description: Browser automation for navigating Reddit, finding specific posts, and posting comments.
---

## Purpose
Perform high-precision browser actions on Reddit to discover and engage with new posts.

## Workflows

### navigate_subreddit
1. Open the browser to `reddit.com/r/[subreddit]`.
2. Locate the feed sorting mechanism.
3. Select "New" to view the most recent posts.

### find_target_posts
1. Scan the "New" feed.
2. Filter for posts with a timestamp of 5-10 minutes ago.
3. Check comment counts and identify posts with 0-5 comments.
4. Return a list of post URLs for engagement.

### post_comment
1. Navigate to the specific post URL.
2. Locate the comment input field.
3. Paste the generated comment text.
4. Click the "Comment" or "Submit" button.
5. Verify the comment appears on the page.

## Constraints
- **Stealth**: Mimic human scroll and click patterns.
- **Accuracy**: Ensure the correct post is selected before commenting.
- **Login State**: Ensure the browser is authenticated with the target Reddit account.
