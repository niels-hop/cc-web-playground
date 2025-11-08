# New Session Testing Guide

## ⚠️ Hooks Require New Session

Hooks are captured at startup. To test new hook configurations, restart Claude Code or start a fresh conversation.

## Test Steps

**1. PreToolUse**: `Create a file called test.txt`
→ Expect: `🔵 PreToolUse Hook: About to execute tool 'Write'...`

**2. PostToolUse**: `Read the file CLAUDE.md`
→ Expect: `🟢 PostToolUse Hook: Finished executing tool 'Read'...`

**3. UserPromptSubmit**: Send any message
→ Expect: `🟡 UserPromptSubmit Hook: User submitted a prompt...`

**4. Verify**: `cat test-results/hook-results.log`
→ Should show JSON logs for each execution

## Troubleshooting

- Check `.claude/settings.json` has hook configs
- Verify scripts are executable: `ls -l test-scripts/`
- Use `/hooks` command to see active hooks

## Document Results

Update `CLAUDE.md` with which hooks work in web version.
