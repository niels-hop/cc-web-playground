#!/bin/bash
# UserPromptSubmit Hook Test Script
# Triggers when user submits a prompt

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
RESULTS_FILE="./hooks-testing/test-results/hook-results.log"

# Read JSON input from stdin
INPUT=$(cat)

# Log to results file
echo "[$TIMESTAMP] UserPromptSubmit hook triggered" >> "$RESULTS_FILE"
echo "$INPUT" | jq '.' >> "$RESULTS_FILE" 2>/dev/null || echo "$INPUT" >> "$RESULTS_FILE"
echo "---" >> "$RESULTS_FILE"

# Extract prompt preview if possible
PROMPT_PREVIEW=$(echo "$INPUT" | jq -r '.user_prompt // "unknown"' 2>/dev/null | head -c 50)

# Output message that will appear in conversation
echo "🟡 UserPromptSubmit Hook: User submitted a prompt at $TIMESTAMP"
echo "   Preview: ${PROMPT_PREVIEW}..."

exit 0
