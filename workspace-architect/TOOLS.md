# TOOLS.md - Skill Management Tools

This file documents tools and best practices for managing skill files.

## File Editing Tools

### view_file
**Purpose**: Read skill files before editing
**Usage**: Always read the entire file first to understand current state

```
view_file(~/.openclaw/workspace-executor/browser/SKILL.md)
```

### replace_file_content
**Purpose**: Make single, contiguous block edits
**Usage**: When editing one section of a skill file

**Best Practices**:
- Specify exact `TargetContent` (including whitespace)
- Provide clear `StartLine` and `EndLine`
- Use `AllowMultiple: false` unless you're certain
- Always verify after editing

### multi_replace_file_content
**Purpose**: Make multiple non-adjacent edits
**Usage**: When editing several scattered sections

**Best Practices**:
- Define each `ReplacementChunk` carefully
- Ensure chunks don't overlap
- Verify all chunks are necessary

## Diff Generation

After editing, generate diffs to verify changes:

```bash
# View git diff if workspace is a git repo
cd ~/.openclaw/workspace-<agent>
git diff <skill-folder>/SKILL.md
```

Alternatively, keep a backup copy before editing:

```bash
cp SKILL.md SKILL.md.bak
# ... make edits ...
diff SKILL.md.bak SKILL.md
```

## Backup Procedures

### Before Major Edits

1. **Read and save current content** mentally or in a note
2. **Document the current state** in your memory
3. **Make the edit**
4. **Verify immediately**
5. **If broken, revert** using the saved content

### Simple Backup Command

```bash
# Create timestamped backup
cp SKILL.md SKILL.md.$(date +%Y%m%d_%H%M%S).bak
```

## Rollback Procedures

If an edit breaks something:

### Method 1: Manual Revert
1. Open the skill file
2. Replace content with the backup you saved
3. Document what went wrong in `memory/YYYY-MM-DD.md`

### Method 2: Git Revert (if available)
```bash
cd ~/.openclaw/workspace-<agent>
git checkout HEAD -- <skill-folder>/SKILL.md
```

### Method 3: Restore from Backup
```bash
cp SKILL.md.bak SKILL.md
```

## YAML Validation

Skill files start with YAML frontmatter. Validate it:

```yaml
---
name: skill-name
description: Brief description
---
```

**Rules**:
- Must start with `---`
- Must end with `---`
- `name` field is required
- `description` field is required
- No tabs, use spaces for indentation
- String values can be quoted or unquoted

## Common Skill File Sections

When enhancing skills, consider adding these sections:

### Purpose
What this skill enables the agent to do

### Workflows
Step-by-step processes for common tasks

### Constraints
Rules, limits, boundaries for the skill

### Error Handling
How to handle common failure scenarios

### Examples
Concrete examples of the skill in action

### Best Practices
Lessons learned, tips, optimizations

## Editing Patterns

### Pattern 1: Add New Section
```markdown
## New Section Name

Content here...
```

**Tip**: Add new sections at the end, before any existing appendices

### Pattern 2: Enhance Existing Section
- Read the section first
- Understand its current purpose
- Add clarifying details or examples
- Preserve existing structure

### Pattern 3: Add Constraint
```markdown
## Constraints

- Existing constraint 1
- Existing constraint 2
- **New constraint**: [Your addition with clear reasoning]
```

### Pattern 4: Document Workflow
```markdown
## Workflows

### Task Name
1. Step one with clear action
2. Step two with expected outcome
3. Step three with error handling
4. Final verification step
```

## Safety Reminders

### Before Every Edit

- [ ] Read `SOUL.md` to remember your principles
- [ ] Check the file is in `AGENTS.md` registry
- [ ] Read the entire file first
- [ ] Understand why the change is needed
- [ ] Make targeted edits only
- [ ] Verify after editing
- [ ] Document the change

### Red Flags

**Stop immediately if**:
- File path is not `/workspace-*/*/SKILL.md`
- File extension is `.js`, `.sh`, `.json`, etc.
- Filename is `AGENTS.md`, `SOUL.md`, `BOOTSTRAP.md`, etc.
- You're unsure about the impact
- The change affects multiple skills simultaneously

**Ask the human first** when you see red flags.

## Verification Commands

After editing, verify the agent can still function:

```bash
# Check file exists and is readable
ls -lh /path/to/SKILL.md

# Verify YAML frontmatter syntax (basic check)
head -n 10 /path/to/SKILL.md

# Check for syntax errors (if tools available)
# yamllint, yq, or similar
```

## Memory Maintenance

Track all edits in `memory/YYYY-MM-DD.md`:

**Format**:
```markdown
### Skill Edit: [name] at [time]
**File**: [path]
**Reason**: [why]
**Changes**: [what]
**Impact**: [expected effect]
```

**Review frequency**: Check yesterday's memory each session

## Learning and Improvement

As you gain experience:

1. **Document patterns** you discover
2. **Note common mistakes** to avoid
3. **Refine your workflow** based on what works
4. **Update this file** with lessons learned

But always: **Safety first. Measure twice, cut once.**

---

These are your tools. Use them wisely. 🏗️
