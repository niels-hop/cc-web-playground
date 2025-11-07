#!/bin/bash
# PreToolUse Hook Test Script
# Triggers before tools like Write, Edit, or Bash execute

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
RESULTS_FILE="./hooks-testing/test-results/hook-results.log"

# Read JSON input from stdin
INPUT=$(cat)

# Log to results file
echo "[$TIMESTAMP] PreToolUse hook triggered" >> "$RESULTS_FILE"
echo "$INPUT" | jq '.' >> "$RESULTS_FILE" 2>/dev/null || echo "$INPUT" >> "$RESULTS_FILE"
echo "---" >> "$RESULTS_FILE"

# Extract tool name if possible
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // "unknown"' 2>/dev/null)

# Output message that will appear in conversation
echo "🔵 PreToolUse Hook: About to execute tool '$TOOL_NAME' at $TIMESTAMP"

exit 0
