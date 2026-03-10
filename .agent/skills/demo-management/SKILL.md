---
name: demo-management
description: Skill to automate the reconstruction and fixing of demo games in the `public` folder.
---

# Demo Management Skill (demo-management)

This skill provides a standardized way to keep demo games in the `public/` directory up-to-date with the latest `game-engine.ts` and ensure all CSS fixes (like the frame selector issue) are applied.

## 🛠️ Protocols

### 1. Rebuilding Demos
Whenever the core game engine (`src/components/game-engine.ts`) or the default styles (`src/lib/gameDefaults.ts`) are updated, the demos in `public/` (and their corresponding ZIP files) must be synchronized.

### 2. Demo Structure
Each demo (e.g., `public/fuja_da_masmorra`) should contain:
- `index.html`: The game entry point.
- `game.js`: The game engine combined with the `embeddedGameData`.
- `style.css`: The game styles.
- `editor_data.json`: The source JSON for the project, allowing it to be opened in the IF Builder editor.

### 3. ZIP Synchronization
Demos in folder form must always match their counterpart ZIP files (e.g., `public/fuja_da_masmorra.zip`) to provide a consistent experience for users who download the example.

## 🚀 Automation

A script is provided to automate this process:

```bash
node .agent/skills/demo-management/scripts/rebuild-demos.js
```

This script:
1.  Loads `editor_data.json` from each demo folder.
2.  Reconstructs `game.js` with the latest engine from `src/components/game-engine.ts`.
3.  Sanitizes `style.css` in the demo folders to fix legacy CSS bugs (like missing spaces in descendant selectors).
4.  Updates the `.zip` files in `public/` to match.
