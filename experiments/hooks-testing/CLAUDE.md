# Claude Code Hooks Testing Manual

## Overview

This directory contains test infrastructure for validating which Claude Code hooks are supported in the web version. The goal is to systematically test all 9 available hook types and document their behavior.

## Project Goal

**Primary Objective**: Determine which Claude Code hooks function correctly in the web version vs. desktop version, and document any differences or limitations.

**Secondary Objective**: Create reusable test scripts and examples for each hook type that can serve as reference implementations.

## Current Status

### ✅ Implemented Hooks (5/9)

| Hook | Status | Trigger | Test Method |
|------|--------|---------|-------------|
| **SessionStart** | ✅ Working | Session initialization | Runs on startup (pre-existing) |
| **PreToolUse** | 🧪 Testing | Before Write/Edit/Bash | Script at `test-scripts/pre-tool-use.sh` |
| **PostToolUse** | 🧪 Testing | After Read/Grep/Glob | Script at `test-scripts/post-tool-use.sh` |
| **UserPromptSubmit** | 🧪 Testing | User submits prompt | Script at `test-scripts/user-prompt-submit.sh` |
| **Stop** | ✅ Working | Claude finishes responding | Prompt-based hook (validates completion & rules) |

### 📋 Remaining Hooks (4/9)

| Hook | Priority | Trigger | Test Strategy |
|------|----------|---------|---------------|
| **SubagentStop** | High | Task tool completes | Create script + trigger with Task tool |
| **Notification** | Medium | Permission requests | Create script + trigger permission dialog |
| **SessionEnd** | Low | Session terminates | Create script (hard to test automatically) |
| **PreCompact** | Low | Before context compaction | Create script (hard to trigger manually) |

## Directory Structure

```
hooks-testing/
├── README.md                  # This file
├── test-scripts/             # Hook test scripts
│   ├── pre-tool-use.sh       # PreToolUse hook
│   ├── post-tool-use.sh      # PostToolUse hook
│   └── user-prompt-submit.sh # UserPromptSubmit hook
└── test-results/             # Log outputs
    └── hook-results.log      # Consolidated test logs
```

## Configuration

Hooks are configured in `.claude/settings.json` at the project root:

```json
{
  "hooks": {
    "SessionStart": [...],
    "PreToolUse": [{
      "matcher": "Write|Edit|Bash",
      "hooks": [{"type": "command", "command": "./hooks-testing/test-scripts/pre-tool-use.sh"}]
    }],
    "PostToolUse": [{
      "matcher": "Read|Grep|Glob",
      "hooks": [{"type": "command", "command": "./hooks-testing/test-scripts/post-tool-use.sh"}]
    }],
    "UserPromptSubmit": [{
      "hooks": [{"type": "command", "command": "./hooks-testing/test-scripts/user-prompt-submit.sh"}]
    }],
    "Stop": [{
      "hooks": [{
        "type": "prompt",
        "prompt": "Validates completion and CLAUDE.md rules compliance...",
        "timeout": 30
      }]
    }]
  }
}
```

## How to Test Current Hooks

### 1. PreToolUse Hook
**Triggers**: Before Write, Edit, or Bash commands execute

**Test it**:
```
Ask Claude to: "Create a new file called test.txt with 'hello' in it"
```

**Expected output**:
- Message: `🔵 PreToolUse Hook: About to execute tool 'Write' at [timestamp]`
- Entry in `test-results/hook-results.log`

### 2. PostToolUse Hook
**Triggers**: After Read, Grep, or Glob commands execute

**Test it**:
```
Ask Claude to: "Read the hooks-testing/README.md file"
```

**Expected output**:
- Message: `🟢 PostToolUse Hook: Finished executing tool 'Read' at [timestamp]`
- Entry in `test-results/hook-results.log`

### 3. UserPromptSubmit Hook
**Triggers**: When you submit any prompt

**Test it**:
```
Send any message to Claude
```

**Expected output**:
- Message: `🟡 UserPromptSubmit Hook: User submitted a prompt at [timestamp]`
- Entry in `test-results/hook-results.log`

### 4. Stop Hook (Prompt-Based)
**Triggers**: When Claude finishes responding and is about to stop

**Type**: Prompt-based hook (uses LLM evaluation)

**Test it**:
```
Ask Claude to: "Implement a simple feature and commit it"
```

**What it validates**:
1. **User Request Completion**: Checks if all requested tasks are complete
   - Are all features implemented?
   - Are tests passing?
   - Have commits been made if requested?
   - Is there unfinished work?

2. **CLAUDE.md Rules Compliance**: Validates adherence to project rules
   - Bun usage rules (from `bun-test/CLAUDE.md`)
   - Hooks testing guidelines (from `hooks-testing/CLAUDE.md`)

**Expected behavior**:
- **Approve**: If work is complete and rules are followed
- **Block**: If work is incomplete or rules are violated
  - Claude will continue working to address the issues
  - User sees the reason for blocking
- **Warning**: If work is complete but there are minor concerns

**Example responses from the hook**:
```json
// Approve - everything good
{"decision": "approve", "reason": "All tasks complete and rules followed"}

// Block - work incomplete
{"decision": "block", "reason": "Tests have not been run yet"}

// Approve with warning
{"decision": "approve", "reason": "Work complete", "systemMessage": "Note: Consider adding error handling"}
```

### Viewing Results

Check the consolidated log file:
```bash
cat hooks-testing/test-results/hook-results.log
```

Or tail it in real-time:
```bash
tail -f hooks-testing/test-results/hook-results.log
```

## Next Steps

### Phase 2: Implement Remaining High-Priority Hooks

1. **SubagentStop Hook**
   - Create `test-scripts/subagent-stop.sh`
   - Add to `.claude/settings.json`
   - Test by asking Claude to use the Task tool (e.g., "Use the Explore agent to find all TypeScript files")

3. **Notification Hook**
   - Create `test-scripts/notification.sh`
   - Add to `.claude/settings.json`
   - Test by triggering permission dialogs (if possible in web version)

### Phase 3: Implement Low-Priority Hooks

4. **SessionEnd Hook**
   - Create `test-scripts/session-end.sh`
   - Add to `.claude/settings.json`
   - Test by ending the session (manual verification required)

5. **PreCompact Hook**
   - Create `test-scripts/pre-compact.sh`
   - Add to `.claude/settings.json`
   - Test by manually triggering context compaction

### Phase 4: Documentation

1. Create comprehensive results report
2. Document which hooks work in web version
3. Note any differences from desktop version
4. Create example use cases for each hook

## Technical Notes

### Hook Input Format

All hooks receive JSON via stdin with these common fields:
```json
{
  "session_id": "unique-session-id",
  "transcript_path": "/path/to/conversation",
  "cwd": "/current/working/directory",
  "permission_mode": "auto",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {...}
}
```

### Hook Output Methods

**Exit Codes**:
- `0`: Success (stdout shown in transcript)
- `2`: Blocking error (stderr fed to Claude)
- Other: Non-blocking (stderr shown to user)

**JSON Output** (advanced):
```json
{
  "continue": true,
  "systemMessage": "Optional message",
  "suppressOutput": false
}
```

### Environment Variables

- `CLAUDE_PROJECT_DIR`: Project root path (may be empty in web version)
- `CLAUDE_CODE_REMOTE`: Set to "true" in web version

## Troubleshooting

### Hooks Not Triggering

1. **Check configuration**: Ensure `.claude/settings.json` is valid JSON
2. **Check script permissions**: Scripts must be executable (`chmod +x`)
3. **Check script paths**: Paths are relative to project root
4. **Restart session**: Hooks are captured at session startup

### Scripts Failing

1. **Check logs**: View `test-results/hook-results.log`
2. **Test manually**: Run scripts directly: `./hooks-testing/test-scripts/pre-tool-use.sh < test-input.json`
3. **Check jq availability**: Scripts use `jq` for JSON parsing

## References

- [Claude Code Hooks Documentation](https://code.claude.com/docs/en/hooks)
- Project repository: `/home/user/cc-web-playground`
- Settings file: `.claude/settings.json`

## Testing Checklist

- [x] SessionStart hook (pre-existing)
- [ ] PreToolUse hook
- [ ] PostToolUse hook
- [ ] UserPromptSubmit hook
- [x] Stop hook (prompt-based)
- [ ] SubagentStop hook
- [ ] Notification hook
- [ ] SessionEnd hook
- [ ] PreCompact hook

---

**Last Updated**: 2025-11-07
