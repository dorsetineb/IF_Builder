# IF Builder — Introduction

Welcome to **IF Builder**, a visual editor for creating **interactive fiction** — text-based narratives where the reader decides what happens next.

---

## What is Interactive Fiction?

Interactive fiction (IF) is a story where the player actively participates. Instead of reading passively, they make decisions, explore environments, collect objects, and interact with the world created by the author.

There are two classic styles of IF:

| Style | How it works |
|-------|-------------|
| **Parser** | The player types verbs like `take key`, `open door`, `examine table` |
| **Choice (IF)** | The player clicks predefined options to advance the story |

IF Builder supports **both styles**, and you can mix them in the same project.

---

## What you can create with IF Builder

- Branching stories with multiple endings
- Text adventures with inventory and collectible objects
- Narratives with consequence systems (health, money, sanity...)
- Visual experiences with images, music, and screen effects
- Complete exportable games that run in any browser

---

## How the editor is organized

IF Builder is divided into **panels and tabs**:

```
┌──────────────────────────────────────────────────┐
│  Header (Save / Load / Preview)                  │
├──────────┬───────────────────────────────────────┤
│ Sidebar  │  Main editing area                    │
│          │                                       │
│ • Narr.  │  (Branch Editor / Objects /           │
│ • Map    │   Interactions / Settings...)         │
│ • Obj.   │                                       │
│ • ...    │                                       │
└──────────┴───────────────────────────────────────┘
```

| Element | Function |
|---------|----------|
| **Sidebar** | Navigate between editor modules |
| **Narrative List** | All branches and chapters of your fiction |
| **Branch Editor** | Where you write and configure each scene |
| **Header** | Global actions: save, load, preview |

---

## Core Concepts

Before starting, familiarize yourself with these terms used throughout the editor:

| Term | Description |
|------|-------------|
| **Branch** | A scene or location in your story |
| **Chapter** (Vignette) | Cinematic screen (opening, transition, conclusion) |
| **Object** | A scene item the player can interact with |
| **Interaction** | Rule defining what happens when a verb is used |
| **Tracker** | Numeric variable (Health, Money, Sanity...) |
| **Global Verb** | Command that works in any branch |

---

## What we'll build in this tutorial

Throughout this tutorial, you'll create **"The Lighthouse Key"** — a complete interactive fiction featuring:

- ✅ Parser mode (typed verbs)
- ✅ 5 navigable branches
- ✅ 1 collectible object (Rusty Key)
- ✅ 1 Health Tracker
- ✅ Opening and conclusion vignettes
- ✅ Export as `.zip` ready to share

**Estimated time:** 30–45 minutes to complete all modules.

---

## Next step

→ [Module 01 — Creating your Project](./01-creating-project.md)
