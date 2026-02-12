# OpenClaw Multi-Agent System

> **A distributed AI agent orchestration platform** built on skill-based architecture and intelligent task delegation.

[![Version](https://img.shields.io/badge/version-2026.2.1-blue.svg)](https://github.com/abhishekibr2/openclaw)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🚀 Overview

**OpenClaw** is a sophisticated multi-agent system where specialized AI agents collaborate to execute complex tasks. Instead of monolithic agents that do everything, OpenClaw employs **specialized agents** that excel at specific domains, coordinated through an intelligent task delegation system.

### Core Philosophy

- **🎯 Specialization over Generalization** - Each agent is an expert in their domain
- **📋 Skills over Hard-coding** - Behavior defined in `SKILL.md` files, not code
- **🔄 Orchestration over Isolation** - Agents collaborate seamlessly
- **🛡️ Safety over Speed** - Careful, verified execution with rollback capabilities

---

## 🏗️ Architecture

````mermaid
graph TD
    User[👤 User] -->|Telegram/CLI| Main[Main Agent]
    Main -->|Complex Task| Supervisor[🧠 Supervisor<br/>Orchestrator]
    
    Supervisor -->|Delegate| Executor[⚡ Executor<br/>Browser Automation]
    Supervisor -->|Request Report| Reporter[📊 Reporter<br/>Documentation]
    Supervisor -->|Send Alert| Notification[📧 Notification<br/>Email/Telegram]
    
    Executor -->|Update Status| DB
    Reporter -->|Store Report| DB
    
    Architect[🏗️ Architect<br/>Skill Manager] -.->|Manages Skills| Supervisor
    Architect -.->|Manages Skills| Executor
    Architect -.->|Manages Skills| Reporter
    
    GitHubSync[🔗 GitHubSync] -->|Sync Data| DB
    
    style Main fill:#1e90ff
    style Supervisor fill:#ff6b6b
    style Executor fill:#51cf66
    style Reporter fill:#ffd43b
    style Notification fill:#fa8072
    style Architect fill:#e67e22
    style DB fill:#4dabf7
````

### System Flow

1. **User submits task** via Telegram or direct chat
3. **Supervisor receives** task notification and analyzes requirements
4. **Supervisor delegates** to specialized agents (Executor, Reporter, etc.)
5. **Agents execute** their portion and update status
6. **Supervisor coordinates** completion and notifies user
7. **Architect maintains** skill files to improve agent behavior

---

## 🤖 Agents

| Agent | Emoji | Role | Skills |
|-------|-------|------|--------|
| **Main** | 🤝 | User interface & conversational AI | General assistance, routing |
| **Supervisor** | 🧠 | Task orchestrator & coordinator | Strategic planning, delegation |
| **Executor** | ⚡ | Action specialist | Browser automation, web scraping |
| **Reporter** | 📊 | Documentation specialist | Report generation, metrics |
| **Notification** | 📧 | Alert manager | Email, Telegram notifications |
| **GitHubSync** | 🔗 | Git synchronization | Repository syncing |
| **Architect** | 🏗️ | Skill file manager | Maintains SKILL.md files |

### Agent Details

Each agent operates in its own workspace (`workspace-<agent>/`) with:
- **IDENTITY.md** - Who they are (name, persona, emoji, vibe)
- **SOUL.md** - Core principles and operating philosophy
- **AGENTS.md** - Operational guidelines and workflows
- **TOOLS.md** - Environment-specific configurations
- **USER.md** - Who they serve and expectations
- **memory/** - Daily activity logs for continuity
- **skills/** - SKILL.md files defining capabilities

---

## 🎯 Key Features

### 1. **Skill-Based Architecture**

Agents don't have hardcoded behaviors. Instead, they read `SKILL.md` files that define:
- **What to do** (workflows, tasks, constraints)
- **How to handle errors** (graceful degradation)
- **Best practices** (learned from experience)

**Example**: The Executor's browser skill lives in `workspace-executor/browser/SKILL.md` and can be updated by the Architect agent without changing code.

### 2. **Task Queue**

- Cron Wakes up the supervisour
- Priority-based task ordering
- Full audit trail (created_at, started_at, completed_at)
- Reports linked to tasks for traceability

### 3. **Agent-to-Agent Communication**

Agents can invoke each other using the `agent_to_agent` tool:
```javascript
// Supervisor calling Executor
await callAgent('executor', {
  task: 'Navigate to example.com and extract pricing table',
  timeout: 300
});
```

### 4. **Memory & Continuity**

Each agent maintains:
- **Daily logs** (`memory/YYYY-MM-DD.md`) - Raw activity logs
- **Long-term memory** (`MEMORY.md`) - Curated learnings (main agent only)
- **Session context** - Recent conversation history

### 5. **Safety & Rollback**

- **Architect agent** only edits SKILL.md files, never system files
- **Backup procedures** before major edits
- **Change documentation** for every modification
- **Verification workflows** before going live

### 6. **Multi-Channel Support**

- **Telegram** - Bot integration with group/DM support
- **CLI** - Direct terminal interaction
- **HTTP Gateway** - REST API on port 18789 (local mode)

---

## 📦 Installation

### Prerequisites

- **Node.js** 16+ and npm
- **Google Chrome** (for browser automation)  
- **Telegram bot token** (optional, for Telegram integration)

### Configuration

Edit `openclaw.json` to configure:

- **Agents** - Enable/disable agents, set workspaces
- **Models** - LLM providers (OpenRouter, Qwen Portal, etc.)
- **Browser** - Chrome executable path, profiles
- **Channels** - Telegram, HTTP gateway settings
- **Auth** - API keys and OAuth configurations

---

## 🎮 Usage

### Creating a Task

**Via Telegram:**
```
/task Create a weekly report of all completed tasks
```

**Via CLI:**
```bash
openclaw task create "Research competitors" --priority 5
```

### Monitoring Tasks

```bash
# View pending tasks
openclaw task list --status pending

# View task details
openclaw task show <task-id>

# View reports for a task
openclaw report list --task-id <task-id>
```

### Managing Agents

```bash
# List all agents
openclaw agent list

# Check agent status
openclaw agent status supervisor

# View agent workspace
cd /home/ibr-ai-agent/.openclaw/workspace-supervisor
cat IDENTITY.md
```

### Editing Skills (via Architect)

```bash
# Talk to the Architect agent
openclaw chat -a architect

> Add error handling to the email notification skill for SMTP timeouts

> Document the workflow for the supervisor skill's task delegation
```

---

## 📚 Documentation

Detailed documentation is available in the [`docs/`](./docs/) directory:

- **[Architecture Guide](./docs/architecture.md)** - Deep dive into system design
- **[Agent Specifications](./docs/agents.md)** - Detailed agent roles and workflows
- **[Skill System](./docs/skills.md)** - How skills work and how to create them
- **[Deployment Guide](./docs/deployment.md)** - Production deployment instructions
- **[Development Guide](./docs/development.md)** - Contributing and extending OpenClaw
---

## 🛠️ Development

### Project Structure

```
openclaw/
├── agents/                    # Agent runtime directories
│   ├── main/
│   ├── supervisor/
│   ├── executor/
│   └── ...
├── workspace-*/               # Agent workspaces (IDENTITY, SOUL, skills, memory)
├── docs/                      # Documentation
├── browser/                   # Browser automation configs
├── credentials/               # Auth credentials (gitignored)
├── openclaw.json             # Main configuration
├── schema.sql                # Database schema
├── package.json              # Node dependencies
└── README.md                 # This file
```

### Adding a New Agent

1. **Create workspace** directory: `workspace-<agent-name>/`
2. **Define identity** in `IDENTITY.md`
3. **Create soul** in `SOUL.md` with operating principles
4. **Add to configuration** in `openclaw.json`:
   ```json
   {
     "id": "my-agent",
     "name": "my-agent",
     "workspace": "/path/to/workspace-my-agent"
   }
   ```
5. **Create skills** in `workspace-my-agent/<skill-name>/SKILL.md`
6. **Test and iterate**

### Adding a New Skill

Skills are defined in `SKILL.md` files with YAML frontmatter:

```markdown
---
name: my-skill
description: What this skill enables the agent to do
---

## Purpose
Detailed explanation of the skill's purpose

## Workflows
### Task Name
1. Step one
2. Step two
3. Final verification

## Constraints
- Rule 1
- Rule 2

## Error Handling
How to handle failures gracefully
```

Use the **Architect agent** to safely create/edit skills:
```bash
openclaw chat -a architect
```

---

## 🔒 Security

- **Credentials** stored in `.env` (gitignored)
- **Token authentication** for HTTP gateway
- **Agent permissions** controlled via `allowAgents` in config
- **Sandbox mode** for browser (noSandbox flag for testing only)
- **Local-first** - All data stays on your machine

### Production Checklist

- [ ] Change default gateway auth token
- [ ] Enable browser sandbox (`noSandbox: false`)
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS for gateway (via reverse proxy)
- [ ] Set up Telegram webhook instead of polling (if using Telegram)

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update documentation
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- Browser automation via [Puppeteer](https://pptr.dev)
- LLM integration via [OpenRouter](https://openrouter.ai)
- Inspired by multi-agent systems research

---

## 📞 Support

- **Documentation**: [`/docs`](./docs/)
- **Issues**: [GitHub Issues](https://github.com/abhishekibr2/openclaw/issues)
- **Discussions**: [GitHub Discussions](https://github.com/abhishekibr2/openclaw/discussions)

---

**Built with 🏗️ by the OpenClaw team**

*Keep building. Keep orchestrating.*
