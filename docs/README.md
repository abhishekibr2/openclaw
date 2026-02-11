# OpenClaw Documentation Index

Welcome to OpenClaw's comprehensive documentation! 

---

## 📖 Documentation Structure

### Getting Started

**[README.md](../README.md)** - Start here!
- Project overview and introduction
- Quick start guide
- Installation instructions  
- Basic usage examples
- Feature highlights

### Core Documentation

**[Architecture Guide](./architecture.md)**
- System architectural layers
- Agent communication models
- Task lifecycle and workflows
- Skill system design
- Memory and continuity patterns
- Scalability considerations

**[Agent Specifications](./agents.md)**
- Detailed specs for all 8 agents
- Agent capabilities and responsibilities
- Communication patterns
- Configuration examples
- Error handling strategies

**[Skills System](./skills.md)**
- What are skills?
- Skill file structure (YAML + Markdown)
- Creating new skills
- Editing existing skills
- Best practices and patterns
- Skill registry (8 current skills)

### Operations

**[Deployment Guide](./deployment.md)**
- Production deployment steps
- Server configuration
- Security hardening
- Monitoring and logging
- Backup and recovery
- Performance optimization
- Troubleshooting

**[Development Guide](./development.md)**
- Development environment setup
- Adding new agents
- Creating skills
- Code style guidelines
- Testing and debugging
- Contributing guidelines

**[Dispatcher Documentation](./dispatcher.md)**
- Dispatcher agent details
- Polling cycle mechanics
- Task queue management
- Memory logging format

---

## 📊 Documentation Statistics

| Document | Words | Topics Covered |
|----------|-------|----------------|
| README.md | ~4,000 | Overview, installation, usage |
| architecture.md | ~7,000 | System design, layers, patterns |
| agents.md | ~5,000 | 8 agent specifications |
| skills.md | ~6,000 | Skill system, creation, editing |
| deployment.md | ~6,000 | Production deployment, ops |
| development.md | ~4,000 | Dev setup, contributing |
| **Total** | **~32,000** | Comprehensive coverage |

---

## 🗺️ Quick Navigation

### I want to...

**...understand the project**
→ Start with [README.md](../README.md)

**...install OpenClaw**
→ See [README.md § Installation](../README.md#-installation)

**...deploy to production**
→ Follow [deployment.md](./deployment.md)

**...add a new agent**
→ Read [development.md § Adding a New Agent](./development.md#adding-a-new-agent)

**...create a skill**
→ Check [skills.md § Creating a New Skill](./skills.md#creating-a-new-skill)

**...understand the architecture**
→ Dive into [architecture.md](./architecture.md)

**...learn about specific agents**
→ Browse [agents.md](./agents.md)

**...contribute code**
→ Review [development.md § Contributing](./development.md#contributing-guidelines)

---

## 🤖 Agent Reference

Quick links to agent specifications:

- [Main Agent](./agents.md#-main-agent) - User interface
- [Dispatcher Agent](./agents.md#-dispatcher-agent) - Task router
- [Supervisor Agent](./agents.md#-supervisor-agent) - Orchestrator
- [Executor Agent](./agents.md#-executor-agent) - Browser automation
- [Reporter Agent](./agents.md#-reporter-agent) - Documentation
- [Notification Agent](./agents.md#-notification-agent) - Alerts
- [GitHubSync Agent](./agents.md#-githubsync-agent) - Git sync
- [Architect Agent](./agents.md#-architect-agent) - Skill manager

---

## 📋 Current Skills Registry

Quick reference to all 8 skills:

### Supervisor Skills
- [supervisour-skill](./skills.md#supervisour-skill) - Sub-agent management

### Executor Skills
- [browser](./skills.md#browser) - Web automation

### Reporter Skills
- [daily-report](./skills.md#daily-report) - Daily reports
- [weekly-report](./skills.md#weekly-report) - Weekly reports
- [task-report](./skills.md#task-report) - Task reports

### Notification Skills
- [email](./skills.md#email) - Email notifications
- [telegram](./skills.md#telegram) - Telegram notifications

### GitHubSync Skills
- [githubsync](./skills.md#githubsync) - Repository sync

---

## 🔗 External Resources

- **Supabase**: https://supabase.com/docs
- **Puppeteer** (browser automation): https://pptr.dev
- **OpenRouter** (LLM API): https://openrouter.ai/docs
- **Telegram Bot API**: https://core.telegram.org/bots/api

---

## 📝 Documentation TODOs

Future documentation to add:

- [ ] API Reference (REST endpoints)
- [ ] CLI Command Reference
- [ ] Troubleshooting FAQ
- [ ] Video Tutorials
- [ ] Use Case Examples
- [ ] Performance Benchmarks

---

## ✏️ Contributing to Documentation

Found an error or want to improve documentation?

1. Edit the relevant `.md` file
2. Follow markdown style guidelines
3. Test links work
4. Submit a pull request

**Style Guide**:
- Use headers for organization
- Include code examples
- Add diagrams where helpful (mermaid)
- Keep it concise but complete
- Link to related sections

---

## 🏗️ Maintained By

This documentation is maintained by the OpenClaw team and community.

**Last Updated**: 2026-02-11

---

**Happy building with OpenClaw! 🚀**
