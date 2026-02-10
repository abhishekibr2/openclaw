# HEARTBEAT.md - Task Processing

## When This Agent Runs

Dispatcher triggers this agent with ONE pending task.

## What To Do

1. **Receive task** — Get the single task from Dispatcher
2. **Understand it** — Read and understand what needs to be done
3. **Decide on steps** — If needed, break into logical steps. If simple, execute directly.
4. **Spawn executor** — Create an executor agent instance for this task
5. **Guide through steps** — Give steps one by one, like a senior teaching a junior:
   - Explain what needs to be done in this step
   - Give the executor context and expectations
   - Wait for completion before moving to next step
6. **Done** — When all steps complete, task is complete

Think like a mentor, not a boss. Teach, guide, explain. Each step builds on the previous.
