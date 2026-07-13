# Module 08 — Complete Project: The Lighthouse Key

**Tutorial Overview and Final Reference**

---

## Congratulations! 🎉

You've completed the IF Builder tutorial by building **"The Lighthouse Key"** — a complete interactive fiction with Parser mode, objects, inventory, trackers, vignettes, and export.

---

## Fiction Diagram

```
╔══════════════════╗
║  VIGNETTE        ║
║  Opening         ║
║  "The Lighthouse ║
║   Key"           ║
╚════════╤═════════╝
         │ button "Enter the Lighthouse"
         ▼
╔══════════════════╗
║  STARTING BRANCH ║
║  Lighthouse      ║◄─── examine key → description
║  Entrance        ║◄─── examine staircase → description
╚═══════╤══════════╝
        │
        ├─ "take key" ─────────────────── Rusty Key → Inventory ✓
        │
        ├─ "climb" (WITHOUT key) ───────► stays in branch (blocking message)
        │
        └─ "climb" (WITH key in inventory) ────────────┐
                                                         ▼
                                             ╔══════════════════╗
                                             ║  BRANCH          ║
                                             ║  Dark            ║
                                             ║  Corridor        ║
                                             ╚══════╤═══════════╝
                                                    │
                                        "continue"  │ → Health +1
                                                    │
                                      ┌─────────────┴─────────────┐
                                      │                           │
                               Health < 3                   Health = 3
                                      │                           │
                                      ▼                           ▼
                          ╔══════════════════╗       ╔══════════════════╗
                          ║  FINAL BRANCH    ║       ║  FINAL BRANCH    ║
                          ║  Lantern Room ✅ ║       ║  Defeat ❌       ║
                          ╚══════╤═══════════╝       ╚══════╤═══════════╝
                                 │                          │
                                 ▼                          ▼
                     ╔═════════════════════╗    ╔══════════════════════╗
                     ║  VIGNETTE           ║    ║  VIGNETTE            ║
                     ║  Victory Conclusion ║    ║  Defeat Conclusion   ║
                     ╚═════════════════════╝    ╚══════════════════════╝
```

---

## Summary of Created Elements

### Branches (4)

| Name | Type | Function |
|------|------|----------|
| Lighthouse Entrance | Starting Branch | Starting point; collect key |
| Dark Corridor | Middle Branch | Drains Health; bridge to the top |
| Lantern Room | Final Branch (positive) | Story resolution |
| Defeat | Final Branch (negative) | Health Tracker consequence |

### Chapters/Vignettes (3)

| Name | Type | Connected to |
|------|------|-------------|
| Opening - The Lighthouse | Opening | Lighthouse Entrance |
| Conclusion - Victory | Conclusion | Lantern Room |
| Conclusion - Defeat | Conclusion | Defeat branch |

### Objects (2)

| Name | Collectible | Branch |
|------|-------------|--------|
| Rusty Key | ✅ Yes | Lighthouse Entrance |
| Iron Staircase | ❌ No | Lighthouse Entrance |

### Interactions (4)

| Verbs | Target | Requirement | Outcome |
|-------|--------|-------------|---------|
| take, grab, collect | Rusty Key | — | Adds to inventory |
| climb, go up | Iron Staircase | — | Blocking message |
| climb, go up | Iron Staircase | Key in inventory | → Dark Corridor |
| continue, advance | — (environment) | — | → Lantern Room + Health +1 |

### Trackers (1)

| Name | Initial | Max | Consequence |
|------|---------|-----|-------------|
| Health | 0 | 3 | → Defeat Branch |

---

## What's Next: Exploring Further

### 🎭 Richer narrative
- Add more branches and alternative paths
- Create global verbs like `help`, `inventory`, `status`
- Use **Transition Vignettes** for dramatic moments

### 🎨 Custom visuals
- Go to **Game Settings** → **Interface** to adjust colors, fonts, and layout
- Try **Predefined Themes**: Vampire, Cyberpunk, Parchment...
- Add **overlay effects** to specific branches (rain, glitch, CRT)

### 🔧 Advanced mechanics
- Create **multiple Trackers** (Health + Sanity + Gold)
- Use **Global Verbs** to build a help menu
- Configure the **Logbook** to automatically record events
- Try **Choice mode** for some branches (clickable buttons)

---

## ✅ Final Tutorial Checklist

- [ ] Module 00 — Introduction: concepts understood
- [ ] Module 01 — Project created with Parser mode and systems enabled
- [ ] Module 02 — 4 branches created with descriptions and interactive text
- [ ] Module 03 — 2 objects created and linked to the starting branch
- [ ] Module 04 — 4 interactions created (take, block, climb, continue)
- [ ] Module 05 — Health Tracker created and connected to interaction
- [ ] Module 06 — 3 vignettes created (opening, victory, defeat)
- [ ] Module 07 — Project saved as `.zip` and tested offline
- [ ] Complete and functional game from start to finish 🎉
