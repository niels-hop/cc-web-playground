#!/bin/bash

# Only run in remote (web) environments
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

# Install bun via npm
echo "Installing bun via npm..."
npm install -g bun

# Check if installation was successful
if [ $? -eq 0 ]; then
  echo "Bun installation successful!"
  bun --version
  exit 0
else
  echo "Error: Bun installation failed"
  exit 1
fi
