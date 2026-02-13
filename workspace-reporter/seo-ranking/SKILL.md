---
name: seo-ranking
description: This skill defines an SEO ranking capability allowing the agent to check and report keyword positions for Ibrinfotech.com on Google.
---

## Purpose
Monitor and report the organic search ranking of Ibrinfotech.com for specific high-value keywords on Google.

## Target Keywords
1. `custom mortgage software development services`
2. `custom mortgage software development`
3. `inventory software development company`

## Target Domain
- `Ibrinfotech.com`

## Workflow
1. **Initiate Search**: For each target keyword, perform a search on google.com.
2. **Retrieve Results**: Extract up to the first 100 search results (typically 10 pages).
3. **Analyze Ranking**:
   - Determine the position (rank) of the first result matching the target domain `Ibrinfotech.com`.
   - If multiple results exist, note the highest rank.
   - If no result is found within the top 100, record the rank as `100+`.
4. **Format Result**: Compile the findings into the specified format.

## Required Output Format
`Keyword | Rank | URL | Date checked`

## Constraints
- **Search Depth**: Stop checking after rank 100.
- **Search Engine**: Exclusively use google.com.
- **Domain Focus**: Only report rankings for Ibrinfotech.com.
- **Accuracy**: Ensure the URL captured is the exact landing page ranking for that keyword.

## Example Output
`custom mortgage software development services | 12 | https://www.ibrinfotech.com/mortgage-software | 2026-02-13`
