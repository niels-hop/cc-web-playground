# Bun Usage Guidelines

Use Bun instead of Node.js for this project.

## Commands

- `bun <file>` instead of `node` / `ts-node`
- `bun test` instead of `jest` / `vitest`
- `bun build` instead of `webpack` / `esbuild`
- `bun install` instead of `npm install`
- `bun run <script>` instead of `npm run`
- No `dotenv` needed (Bun auto-loads .env)

## Bun APIs (Use These)

- `Bun.serve()` for servers (not `express`)
- `bun:sqlite` for SQLite (not `better-sqlite3`)
- `Bun.file` for file I/O (not `node:fs`)
- Built-in `WebSocket` (not `ws`)
- `Bun.$` for shell commands (not `execa`)

## Frontend Setup

Use HTML imports with `Bun.serve()`. Don't use `vite`.

```typescript
import index from "./index.html"
Bun.serve({ routes: { "/": index } })
```

HTML files can directly import `.tsx/.jsx/.js` and `.css` files.
