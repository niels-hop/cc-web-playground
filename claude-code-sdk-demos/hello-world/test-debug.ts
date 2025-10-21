import { query } from '@anthropic-ai/claude-agent-sdk';
import type { HookJSONOutput } from "@anthropic-ai/claude-agent-sdk";
import * as path from "path";

console.log('Starting hello-world agent...');
console.log('Current working directory:', process.cwd());
console.log('Agent directory:', path.join(process.cwd(), 'agent'));

async function main() {
  console.log('Creating query...');

  const q = query({
    prompt: 'Hello, Claude! Please introduce yourself in one sentence.',
    options: {
      maxTurns: 100,
      cwd: path.join(process.cwd(), 'agent'),
      model: "opus",
      executable: "node",
      allowedTools: [
        "Task", "Bash", "Glob", "Grep", "LS", "ExitPlanMode", "Read", "Edit", "MultiEdit", "Write", "NotebookEdit",
        "WebFetch", "TodoWrite", "WebSearch", "BashOutput", "KillBash"
      ],
    },
  });

  console.log('Query created, starting iteration...');

  let messageCount = 0;
  for await (const message of q) {
    messageCount++;
    console.log(`\nMessage ${messageCount}:`, message.type);

    if (message.type === 'assistant' && message.message) {
      const textContent = message.message.content.find((c: any) => c.type === 'text');
      if (textContent && 'text' in textContent) {
        console.log('Claude says:', textContent.text);
      }
    }
  }

  console.log('\nAgent completed!');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
