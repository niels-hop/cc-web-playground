# Hooks Testing Experiment

Testing which Claude Code hooks are supported in the web version.

## Quick Start

1. **View the manual**: See `CLAUDE.md` for comprehensive testing instructions
2. **Current hooks configured**: PreToolUse, PostToolUse, UserPromptSubmit (+ SessionStart)
3. **View logs**: `cat test-results/hook-results.log`

## Test the Hooks

- **PreToolUse**: Ask Claude to create/edit a file or run a bash command
- **PostToolUse**: Ask Claude to read a file
- **UserPromptSubmit**: Send any message (this hook just triggered!)

## Status

- ✅ SessionStart (working)
- 🧪 PreToolUse (testing)
- 🧪 PostToolUse (testing)
- 🧪 UserPromptSubmit (testing)
- 📋 Stop, SubagentStop, Notification, SessionEnd, PreCompact (pending)

Read `CLAUDE.md` for full documentation and testing procedures.
