# Hooks Testing Experiment

Tests which Claude Code hooks work in web version vs desktop.

## Quick Reference

- **Test scripts**: `test-scripts/` (PreToolUse, PostToolUse, UserPromptSubmit)
- **Archived configs**: `archive/` (test hooks moved here, only SessionStart active)
- **View logs**: `cat test-results/hook-results.log`
- **Full guide**: See `CLAUDE.md` for test instructions and results

## Status Summary

- ✅ SessionStart (working - auto-installs Bun)
- ✅ Stop (working - prompt-based validation)
- 🧪 PreToolUse, PostToolUse, UserPromptSubmit (tested)
- 📋 SubagentStop, Notification, SessionEnd, PreCompact (pending)
