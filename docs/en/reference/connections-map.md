# Reference — Connections Map

The **Connections Map** provides a graphical view of your entire interactive fiction structure — branches, chapters, connections, and statistics.

---

## Access

Sidebar → **Branch Map**

---

## Map Overview

The map displays all branches and chapters as connected nodes:

```
[Opening] ──→ [Lighthouse Entrance] ──→ [Dark Corridor] ──→ [Lantern Room]
                                                 │
                                                 └──→ [Defeat]
```

### Node Legend

| Color/Style | Type |
|------------|------|
| 🟦 Blue | Starting branch |
| ⬜ Gray | Regular branch |
| 🟩 Green | Final branch (positive conclusion) |
| 🟥 Red | Final branch (defeat/negative) |
| 🎬 Film strip | Chapter/Vignette |
| ⚠️ Orange | Orphan branch (no incoming connections) |

---

## Map Navigation

| Action | How to do it |
|--------|-------------|
| **Move the map** | Click and drag the background |
| **Zoom** | Mouse scroll wheel |
| **Select node** | Click on the branch/chapter |
| **Go to editor** | Double-click or "Edit" button |
| **Move node** | Drag the branch card |
| **Reorganize** | "Reorganize" button — auto layout |

---

## Map Tools

| Button | Function |
|--------|----------|
| **View All** | Centers the map to show all nodes |
| **Reorganize** | Applies automatic hierarchy-based layout |
| **Orphans** | Highlights branches with no incoming connections |
| **Statistics** | Opens the project statistics panel |
| **Legend** | Displays the color and type legend |

---

## Statistics Panel

The map includes a **complete statistics modal** with:

### Narrative Metrics

| Metric | Description |
|--------|-------------|
| Total Branches | Number of branches in the project |
| Total Chapters | Number of vignettes |
| Total words | Word count across all descriptions |
| Reading time | Estimate based on 200 words/min |

### QA Audit

| Alert | Description |
|-------|-------------|
| **Orphan Branches** | Branches with no incoming connections — may be inaccessible |
| **Dead Ends** | Branches without exits not marked as final |
| **Useless Objects** | Objects not linked to any branch or interaction |
| **Hollow Actions** | Interactions with no configured outcome |

### Performance Alerts

| Alert | Trigger |
|-------|---------|
| Heavy image | Image file above ~0.5MB |
| Very long description | Description above 2000 characters |
| Too many interactions | More than 15 interactions in a single branch |
