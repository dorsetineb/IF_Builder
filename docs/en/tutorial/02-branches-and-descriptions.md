# Module 02 — Branches and Descriptions

**Tutorial: The Lighthouse Key**  
Estimated time: 8–12 minutes

---

## Goal of this module

In this module you will:
- Understand what a Branch and a Chapter are
- Create the 5 branches of our fiction
- Write scene descriptions
- Use interactive text with `<word>`
- Configure image, music, and the starting branch

---

## Concept: Branches vs. Chapters

IF Builder has two types of narrative nodes:

| Type | Icon | Use |
|------|------|-----|
| **Branch** | Square | Scene/location where the player interacts |
| **Chapter** (Vignette) | Film strip | Cinematic screen (opening, transition, conclusion) |

In this module we'll create the **Branches**. Chapters will be created in Module 06.

---

## Our fiction's structure

```
[Lighthouse Entrance]  ← Starting Branch
         ↓
[Dark Corridor]
         ↓
[Lantern Room]         ← Final Branch (positive)
         ↓
[Defeat]               ← Final Branch (negative — via Tracker)
```

---

## Step 1 — Create "Lighthouse Entrance"

In the Branch Editor, configure:

**Properties Tab:**

| Field | Value |
|-------|-------|
| **Title** | Lighthouse Entrance |
| **Description** | *See text below* |

**Full description:**

```
The storm outside makes the windows rattle. You came in to seek shelter.

The lighthouse interior is damp and abandoned. An <iron staircase> spirals upward. On the floor, near the door, lies a <rusty key>.

The wind howls through the wall cracks.
```

> 💡 Words between `< >` become **clickable** in the game — the player can type `examine key` or `examine staircase` and the system recognizes the target.

**Set as Starting Branch:** In the Properties tab, mark this branch as **Start of story**.

---

## Step 2 — Create "Dark Corridor"

| Field | Value |
|-------|-------|
| **Title** | Dark Corridor |
| **Description** | *See text below* |

**Description:**

```
You climb the stairs and reach a narrow corridor. The darkness is almost total.

Your eyes take a moment to adjust. Across the hall, you see a <wooden door> slightly ajar.

The smell of mold is strong. Something creaked in the ceiling.
```

---

## Step 3 — Create "Lantern Room"

| Field | Value |
|-------|-------|
| **Title** | Lantern Room |
| **Description** | *See text below* |

**Description:**

```
The top room. The lighthouse's great lantern still works — it rotates slowly, projecting beams of light through the window.

From up here, you can see the churning ocean below.

You found what you were looking for.
```

**Mark as Final Branch:** Enable **"Ending Branch"** option.

---

## Step 4 — Create "Defeat" Branch

| Field | Value |
|-------|-------|
| **Title** | Defeat |
| **Description** | You couldn't resist the cold and exhaustion. The darkness won. |

Mark as a Final Branch (negative).

---

## Step 5 — Interactive Text with `<word>`

Syntax: `<object>` in the description text

**Example:**
```
On the floor lies a <rusty key>.
```

In the game, "rusty key" will be highlighted. The player can:
- Click it to automatically fill the command field
- Type `examine key` or `take key`

---

## ✅ Module 02 Checklist

- [ ] "Lighthouse Entrance" created and set as starting branch
- [ ] "Dark Corridor" created
- [ ] "Lantern Room" created and marked as final
- [ ] "Defeat" branch created and marked as final
- [ ] Interactive text with `<rusty key>` and `<iron staircase>` added

---

## Next step

→ [Module 03 — Objects and Inventory](./03-objects-and-inventory.md)
