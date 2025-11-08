# Claude Code Web Playground

Testing ground for Claude Code features in the web version. This repository contains experiments, examples, and utilities to explore what works in the browser-based Claude Code environment.

## 📁 Structure

```
cc-web-playground/
├── examples/           # Demo applications
│   └── bun-react-app/  # React + Bun + Shadcn UI starter
├── experiments/        # Research & testing projects
│   └── hooks-testing/  # Claude Code hooks validation
├── utilities/          # Reusable testing tools
│   └── web-testing/    # HTTP & browser automation helpers
└── .claude/            # Claude Code configuration
    ├── settings.json   # Hooks & project settings
    └── scripts/        # Hook scripts
```

## 🚀 Quick Start

### Running the Bun React App
```bash
cd examples/bun-react-app
bun install
bun dev  # Visit http://localhost:3000
```

### Testing Hooks
See [experiments/hooks-testing/README.md](experiments/hooks-testing/README.md) for hook testing documentation.

### Using Web Testing Utilities
See [utilities/web-testing/README.md](utilities/web-testing/README.md) for HTTP and browser testing tools.

## 🎯 Purpose

This playground helps validate:
- Which Claude Code hooks work in the web version
- Bun runtime compatibility and performance
- Web testing approaches (HTTP vs browser automation)
- SessionStart automation for package installation

## 🔧 Active Features

- **SessionStart Hook**: Auto-installs Bun on session start (web version only)
- **React App**: Modern stack with Bun, React 19, Tailwind, Shadcn UI
- **Testing Tools**: HTTP-based testing with cheerio for HTML parsing

## 📚 Documentation

Each subdirectory contains its own README with specific instructions:
- [examples/bun-react-app/README.md](examples/bun-react-app/README.md) - App setup and usage
- [experiments/hooks-testing/README.md](experiments/hooks-testing/README.md) - Hooks testing guide
- [utilities/web-testing/README.md](utilities/web-testing/README.md) - Testing utilities

## 🧪 Experiments

Current experiments track which Claude Code features are supported in web vs desktop:
- ✅ SessionStart hook (working)
- 🧪 PreToolUse, PostToolUse, UserPromptSubmit hooks (tested)
- ✅ Stop hook with prompt-based validation (working)
- 📋 SubagentStop, Notification, SessionEnd, PreCompact (pending)

## 📝 Notes

- Designed for ephemeral web environments where packages need reinstallation
- Git history shows iterative development of hook implementations
- Focus on lightweight, fast-loading examples suitable for web testing
