# Skills System Documentation

**Understanding and creating skills in OpenClaw**

---

## What Are Skills?

**Skills** are the building blocks of agent capabilities in OpenClaw. Instead of hardcoding behavior into agents, we define **what agents should do** in markdown files called `SKILL.md`.

### Core Concept

```
Agent = Expert in "HOW to do things" (hardcoded expertise)
Skill = Definition of "WHAT to do" (configurable instructions)
```

**Example**:
- **Executor agent** knows HOW to use a browser (hardcoded expertise)
- **Browser skill** defines WHAT to do with that browser (configurable via SKILL.md)

---

## Skill File Structure

### Location

Skills live in agent workspaces:

```
workspace-<agent>/<skill-name>/SKILL.md
```

**Examples**:
- `workspace-executor/browser/SKILL.md`
- `workspace-reporter/daily-report/SKILL.md`
- `workspace-notification/email/SKILL.md`

### Format

Every `SKILL.md` file follows this structure:

```markdown
---
name: skill-name
description: Brief description of what this skill enables
---

## Purpose
Detailed explanation of the skill's purpose

## Workflows
### Workflow Name
1. Step one with clear action
2. Step two with expected outcome
3. Error handling steps
4. Final verification

## Constraints
- Rule 1: Never do X
- Rule 2: Always verify Y
- Rule 3: Timeout after Z seconds

## Error Handling
### Error Type
- Detection: How to identify this error
- Response: What to do when it happens
- Fallback: Alternative approach

## Examples
Concrete examples of the skill in action
```

### YAML Frontmatter

The section between `---` markers is YAML:

```yaml
---
name: browser
description: This skill defines a browser capability allowing the agent to access and interact with web content.
---
```

**Required fields**:
- `name` - Skill identifier (lowercase, hyphens)
- `description` - One-line summary

---

## Current Skills Registry

### Supervisor Skills

#### supervisour-skill
**Location**: `workspace-supervisour/supervisour-skill/SKILL.md`
**Purpose**: Behavioral capability for managing sub-agents and delegating tasks

**Current state**: Minimal (YAML only)

**Enhancement opportunities**:
- Add delegation workflows
- Define priority handling
- Document escalation procedures
- Error recovery strategies

---

### Executor Skills

#### browser
**Location**: `workspace-executor/browser/SKILL.md`
**Purpose**: Browser capability for accessing and interacting with web content

**Current state**: Minimal (YAML only)

**Enhancement opportunities**:
- Navigation workflows
- Data extraction patterns
- Form filling procedures
- Screenshot capture guidelines
- Timeout handling
- Element selectors best practices

**Example enhancement**:
```markdown
## Workflows

### Navigate and Extract Data
1. Receive URL and selectors from Supervisor
2. Launch browser (profile: openclaw)
3. Navigate to URL with 30s timeout
4. Wait for page load (check document.readyState)
5. Extract data using provided CSS selectors
6. Structure results as JSON
7. Take screenshot for verification
8. Close browser
9. Return results to Supervisor

## Constraints
- Never scrape robots.txt-disallowed pages
- Respect rate limits (max 1 req/sec per domain)
- Timeout page loads after 30 seconds
- Close browser sessions after task completion
- Never interact with /r/problemsInSoftware on Reddit

## Error Handling

### Page Load Timeout
- Detection: 30s elapsed without load event
- Response: Retry once with extended 60s timeout
- Fallback: Return partial data if available, else fail gracefully

### Element Not Found
- Detection: querySelector returns null
- Response: Log specific selector that failed
- Fallback: Report missing element to Supervisor, don't crash
```

---

### Reporter Skills

#### daily-report
**Location**: `workspace-reporter/daily-report/SKILL.md`
**Purpose**: Generating and managing daily reports

#### weekly-report
**Location**: `workspace-reporter/weekly-report/SKILL.md`
**Purpose**: Generating and managing weekly reports

#### task-report
**Location**: `workspace-reporter/task-report/SKILL.md`
**Purpose**: Generating and managing task reports

**Enhancement opportunities**:
- Report templates
- Metric aggregation formulas
- Data sources (which tables to query)
- Format specifications (markdown, PDF, HTML)

---

### Notification Skills

#### email
**Location**: `workspace-notification/email/SKILL.md`
**Purpose**: Email notification capabilities

**Enhancement opportunities**:
- SMTP configuration guidelines
- Email templates
- Retry logic for failures
- Support for attachments

#### telegram
**Location**: `workspace-notification/telegram/SKILL.md`
**Purpose**: Telegram notification capabilities

**Enhancement opportunities**:
- Message formatting (markdown, HTML)
- Rich media support (images, files)
- Group vs DM handling
- Rate limit compliance

---

### GitHubSync Skills

#### githubsync
**Location**: `workspace-githubsync/githubsync/SKILL.md`
**Purpose**: GitHub synchronization capabilities

**Enhancement opportunities**:
- Clone workflows
- Commit/push procedures
- Branch management
- Conflict resolution

---

## Creating a New Skill

### Step 1: Plan the Skill

Answer these questions:
1. **What capability** does this skill enable?
2. **Which agent** will use it?
3. **What workflows** are involved?
4. **What can go wrong?** (error cases)
5. **What are the boundaries?** (constraints)

### Step 2: Create the File

```bash
cd /home/ibr-ai-agent/.openclaw
mkdir -p workspace-<agent>/<skill-name>
touch workspace-<agent>/<skill-name>/SKILL.md
```

### Step 3: Write Frontmatter

```yaml
---
name: my-new-skill
description: Brief one-line description
---
```

### Step 4: Define Purpose

```markdown
## Purpose

This skill enables the <agent> agent to <capability>.

Use cases:
- Use case 1
- Use case 2
```

### Step 5: Document Workflows

```markdown
## Workflows

### Primary Workflow Name
1. **Receive** parameters from caller
2. **Validate** input (check required fields)
3. **Execute** core logic
4. **Handle** errors gracefully
5. **Return** results or error details
```

### Step 6: Set Constraints

```markdown
## Constraints

- **Rate limiting**: Max 10 requests per minute
- **Timeout**: Fail after 60 seconds
- **Data size**: Max 10MB response
- **Security**: Never log sensitive data
```

### Step 7: Define Error Handling

```markdown
## Error Handling

### Timeout Error
- **Detection**: Operation exceeds 60s
- **Response**: Log timeout, clean up resources
- **Fallback**: Return partial results if available

### Authentication Error
- **Detection**: 401/403 status code
- **Response**: Log error, don't retry
- **Fallback**: Request credentials from Supervisor
```

### Step 8: Add Examples

```markdown
## Examples

### Example 1: Basic Usage
**Input**:
```json
{
  "url": "https://example.com",
  "selector": ".data-table"
}
```

**Output**:
```json
{
  "success": true,
  "data": [...]
}
```
```

### Step 9: Register with Architect

Add to architect's skill registry in `workspace-architect/AGENTS.md`:

```markdown
### My Agent Skills
- `/home/ibr-ai-agent/.openclaw/workspace-<agent>/<skill-name>/SKILL.md`
  - Purpose: Brief description
```

---

## Editing Existing Skills

### Using the Architect Agent

**Recommended approach**: Let the Architect agent edit skills safely.

```bash
openclaw chat -a architect

> Add timeout handling to the browser skill for slow-loading pages

> Document the retry logic for email notifications on SMTP failures
```

The Architect will:
1. ✅ Read the current skill file
2. ✅ Understand your request
3. ✅ Make targeted edits (not wholesale replacement)
4. ✅ Verify YAML syntax
5. ✅ Document changes in memory
6. ✅ Report what was modified

### Manual Editing

If editing manually:

1. **Backup first**:
   ```bash
   cp SKILL.md SKILL.md.bak
   ```

2. **Edit carefully** - Preserve YAML frontmatter

3. **Validate YAML**:
   ```bash
   head -5 SKILL.md  # Check frontmatter
   ```

4. **Test the skill** by running the agent

5. **Document changes** in agent's `memory/YYYY-MM-DD.md`

---

## Skill Best Practices

### 1. **Be Specific**

❌ Bad:
```markdown
1. Get data from the website
2. Process it
3. Return results
```

✅ Good:
```markdown
1. Navigate to URL provided in `task.url`
2. Wait for selector `.data-loaded` to appear (max 10s)
3. Extract all elements matching `.data-row`
4. Convert to JSON array with fields: id, title, value
5. Return `{ success: true, data: [...] }`
```

### 2. **Define Error Cases**

❌ Bad:
```markdown
Handle errors gracefully
```

✅ Good:
```markdown
### Network Timeout
- Retry once with 2x timeout
- If still fails, return `{ success: false, error: "timeout" }`

### Invalid Selector
- Log: "Selector '.invalid' not found"
- Return: `{ success: false, error: "element_not_found" }`
```

### 3. **Set Clear Boundaries**

```markdown
## Constraints

- **Max execution time**: 5 minutes
- **Max memory**: 500MB
- **Allowed domains**: Only example.com and api.example.com
- **Never**: Store credentials in logs
```

### 4. **Provide Examples**

Show concrete inputs and outputs:

```markdown
## Examples

### Success Case
Input: `{ "query": "AI tools" }`
Output: `{ "success": true, "results": 15 }`

### Error Case
Input: `{ "query": "" }`
Output: `{ "success": false, "error": "empty_query" }`
```

### 5. **Keep It Maintainable**

- Use headers for organization
- One workflow per task type
- Group related constraints together
- Update when behavior changes

---

## Skill Loading at Runtime

### How Agents Read Skills

```javascript
// Simplified example
function loadSkill(skillPath) {
  const content = fs.readFileSync(skillPath, 'utf8');
  const { frontmatter, body } = parseMarkdown(content);
  
  return {
    name: frontmatter.name,
    description: frontmatter.description,
    instructions: body
  };
}

// Agent behavior
const browserSkill = loadSkill('workspace-executor/browser/SKILL.md');
console.log(browserSkill.instructions); // Use to guide execution
```

Agents read skills:
- **At startup** - Load all available skills
- **On-demand** - When specific capability needed
- **After updates** - When Architect modifies skills

---

## Advanced Skill Patterns

### Conditional Workflows

```markdown
## Workflows

### Data Extraction with Authentication

**If authentication required:**
1. Check if credentials in metadata
2. Navigate to login page
3. Fill username/password
4. Submit form
5. Wait for redirect
6. Proceed to data extraction

**If no authentication:**
1. Skip directly to data extraction

**Data extraction (common path):**
1. Navigate to data URL
2. Extract using selectors
3. Return results
```

### Skill Composition

Skills can reference other skills:

```markdown
## Purpose

This skill combines the **browser** skill with **data-processing** skill
to scrape and clean data in one operation.

## Workflow

1. Use **browser skill** to navigate and extract raw data
2. Use **data-processing skill** to clean and validate
3. Return processed results
```

### Parameterized Constraints

```markdown
## Constraints

- **Max retries**: Configurable via `task.metadata.max_retries` (default: 3)
- **Timeout**: Configurable via `task.metadata.timeout_seconds` (default: 60)
- **Rate limit**: Configurable via `task.metadata.rate_limit_per_min` (default: 10)
```

---

## Skill Versioning

### Approach 1: In-Place Updates

Update the existing SKILL.md file (recommended for most changes)

**Pros**: Simple, agents always use latest
**Cons**: No rollback except via backups

### Approach 2: Versioned Skills

Create skill variants:

```
workspace-executor/
├── browser-v1/SKILL.md
├── browser-v2/SKILL.md
└── browser/SKILL.md  (symlink to v2)
```

**Pros**: Easy rollback, A/B testing
**Cons**: More complex management

---

## Troubleshooting

### Skill Not Following Instructions

1. **Check skill is loaded**: Verify agent reads the file
2. **Check LLM context**: Ensure skill content fits in context window
3. **Simplify instructions**: Break complex workflows into steps
4. **Add examples**: Show desired behavior concretely

### YAML Syntax Errors

```bash
# Install yamllint
npm install -g yaml-lint

# Validate frontmatter
yaml-lint SKILL.md
```

Common issues:
- Missing closing `---`
- Tabs instead of spaces
- Unquoted special characters

### Conflicting Instructions

If a skill has contradictory rules:
1. Architect agent should detect and fix
2. Manual review of constraints section
3. Prioritize safety over performance

---

## Future Enhancements

Potential skill system improvements:

1. **Skill inheritance** - Base skills that others extend
2. **Skill marketplace** - Share skills across installations
3. **Automated testing** - Validate skills with test cases
4. **Performance metrics** - Track skill effectiveness
5. **Skill composition UI** - Visual workflow builder

---

**Skills make agents flexible, maintainable, and continuously improvable.**
