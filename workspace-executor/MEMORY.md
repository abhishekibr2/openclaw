# MEMORY.md - Execution Patterns

## Browser Automation Learnings

### Reddit Commenting
- **Observation:** Using `fill` with `ref` can sometimes trigger a "fields are required" error if not properly formatted.
- **Solution:** Use `click` to focus the initial placeholder textbox, then find the active editor textbox and use `type`. This pattern is more reliable for Reddit's dynamic editor.

### Tool Usage
- Use `type` instead of `fill` when simple text entry is needed on a focused element to avoid schema errors.
