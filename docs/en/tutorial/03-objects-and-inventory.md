# Module 03 — Objects and Inventory

**Tutorial: The Lighthouse Key**  
Estimated time: 6–8 minutes

---

## How objects work

In IF Builder, objects are **global**: created once, reusable across multiple branches.

An object can have:
- **Name**: how it's referred to in the game
- **Examine Description**: what the player sees when inspecting it
- **Image**: photo or illustration
- **Collectible**: whether it can be added to the inventory

---

## Step 1 — Access the Object Library

In the sidebar, click **"Objects"**.

---

## Step 2 — Create the Rusty Key

Click **"Create Object"** (`+` icon).

Fill in the fields:

| Field | Value |
|-------|-------|
| **Object Name** | Rusty Key |
| **Examine Description** | An old key, covered in rust and slime. Strangely, it feels solid. The handle is shaped like a miniature lighthouse. |
| **Collectible** | ✅ Enabled |

> 💡 This description appears when the player types `examine key`, `look key`, or `read key` — these verbs work automatically.

---

## Step 3 — Create the Iron Staircase

| Field | Value |
|-------|-------|
| **Object Name** | Iron Staircase |
| **Examine Description** | Rusty iron steps spiral upward. The structure seems solid enough to hold your weight. Creaky, but firm. |
| **Collectible** | ❌ No |

---

## Step 4 — Link Objects to the Branch

1. Go to the **"Lighthouse Entrance"** branch in the narrative
2. In the Branch Editor, click the **"Objects"** tab
3. Click **"Link object to branch"**
4. Search for and select **"Rusty Key"** → click "Link Now"
5. Repeat for **"Iron Staircase"**

---

## Step 5 — Test in Preview

Click **"Test Branch"** in the Lighthouse Entrance editor. Test:
- `examine key` → should show the Rusty Key description
- `look staircase` → should show the Iron Staircase description
- `inventory` → still empty (key not yet collected)

---

## How inventory works in the game

When the player **collects** an object (via interaction — covered in Module 04):
- The object appears in the game's **inventory panel**
- The player can check inventory with the verb `inventory`
- The object can be **required as a prerequisite** in other interactions

---

## ✅ Module 03 Checklist

- [ ] "Rusty Key" object created and marked as collectible
- [ ] "Iron Staircase" object created (not collectible)
- [ ] Both linked to the "Lighthouse Entrance" branch
- [ ] Preview tested: `examine key` and `look staircase` work

---

## Next step

→ [Module 04 — Interactions and Parser](./04-interactions-and-parser.md)
