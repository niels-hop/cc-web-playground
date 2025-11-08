# Test Instructions for New Session

## ⚠️ Important: Hooks Require New Session

According to the Claude Code documentation:
> "Claude Code captures a snapshot of hooks at startup"

This means the 3 new hooks (PreToolUse, PostToolUse, UserPromptSubmit) we just configured **will NOT be active in this session**. They require starting a new session to take effect.

## How to Test in New Session

### Step 1: Start a New Session
Close and restart Claude Code, or start a fresh conversation.

### Step 2: Test PreToolUse Hook
Ask Claude:
```
Create a file called hooks-testing/test.txt with the text "testing PreToolUse hook"
```

**Expected**: You should see a message like:
```
🔵 PreToolUse Hook: About to execute tool 'Write' at [timestamp]
```

### Step 3: Test PostToolUse Hook
Ask Claude:
```
Read the file hooks-testing/CLAUDE.md
```

**Expected**: You should see a message like:
```
🟢 PostToolUse Hook: Finished executing tool 'Read' at [timestamp]
```

### Step 4: Test UserPromptSubmit Hook
Send any message to Claude (even "hello").

**Expected**: You should see a message like:
```
🟡 UserPromptSubmit Hook: User submitted a prompt at [timestamp]
```

### Step 5: Verify Logs
Ask Claude to show the log file:
```
Show me the contents of hooks-testing/test-results/hook-results.log
```

You should see detailed JSON logs for each hook execution.

## Troubleshooting

If hooks don't trigger:
1. Verify `.claude/settings.json` has the hook configurations
2. Verify scripts are executable: `ls -l hooks-testing/test-scripts/`
3. Check for errors in the session startup messages
4. Try the `/hooks` command to see active hooks

## Web Version Limitations

We're specifically testing which hooks work in the web version. Not all hooks may be supported. Document any differences you observe:

- [ ] PreToolUse - Works? Y/N
- [ ] PostToolUse - Works? Y/N
- [ ] UserPromptSubmit - Works? Y/N

Update `CLAUDE.md` with findings!
