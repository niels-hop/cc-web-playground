# Hooks Testing - Experiment Guide

**Goal**: Test which Claude Code hooks work in web version vs desktop and document differences.

## Test Results

| Hook | Status | Test Method |
|------|--------|-------------|
| SessionStart | ✅ Working | Auto-installs Bun on startup |
| Stop | ✅ Working | Prompt-based validation |
| PreToolUse | 🧪 Tested | Script: `test-scripts/pre-tool-use.sh` |
| PostToolUse | 🧪 Tested | Script: `test-scripts/post-tool-use.sh` |
| UserPromptSubmit | 🧪 Tested | Script: `test-scripts/user-prompt-submit.sh` |
| SubagentStop | 📋 Pending | Needs Task tool trigger |
| Notification | 📋 Pending | Needs permission dialog |
| SessionEnd | 📋 Pending | Hard to test |
| PreCompact | 📋 Pending | Hard to trigger |

## Quick Test

**PreToolUse**: Ask Claude to create a file → expect `🔵 PreToolUse Hook: About to execute...`
**PostToolUse**: Ask Claude to read a file → expect `🟢 PostToolUse Hook: Finished executing...`
**UserPromptSubmit**: Send any message → expect `🟡 UserPromptSubmit Hook: User submitted...`
**Stop**: Complete a feature → validates task completion and rule compliance

**View logs**: `cat test-results/hook-results.log`

## Configuration

Test hooks archived in `archive/test-hooks-config.json` and `archive/stop-hook-prompt.txt`.
Active configuration in `../../.claude/settings.json` (currently only SessionStart).

## Technical Reference

**Hook Input** (via stdin):
```json
{"session_id": "...", "hook_event_name": "PreToolUse", "tool_name": "Write"}
```

**Hook Output**:
- Exit 0: Success (stdout shown)
- Exit 2: Block (stderr to Claude)
- Other: Non-blocking error

**Environment**:
- `CLAUDE_PROJECT_DIR`: Project root
- `CLAUDE_CODE_REMOTE`: "true" in web version

## Next Steps

1. Test SubagentStop with Task tool
2. Test Notification with permission dialogs
3. Document web vs desktop differences
4. Create hook usage examples
