# Video Script #05 — Objects and Inventory

**Title:** Creating Objects and Managing the Inventory  
**Estimated duration:** 3–4 minutes  
**Series:** IF Builder Tutorials

---

## 🎙️ Script

### [00:00 – 00:25] WHAT ARE OBJECTS

> *[Screen: Game inventory panel with some items]*

**Narrator:**
"Objects are the items in your world — things the player can examine, collect, use, give. The key that opens a door, the lantern that lights the way, the letter that reveals a secret."

### [00:25 – 01:30] CREATE OBJECT

> *[Action: click "Objects" in sidebar → Create Object]*

**Narrator:**
"In the sidebar, I click Objects. Here's the Object Library — global to the entire project."

"Click Create Object. Name: 'Rusty Key'."

> *[Action: type examine description]*

"In the Examine Description, I write what the player sees when inspecting the key."

> *[Action: enable Collectible toggle]*

"And here's the most important detail: I enable 'Collectible'. This means the player can add this object to their inventory when we set up the right interaction."

### [01:30 – 02:15] LINK TO BRANCH

> *[Action: go to "Lighthouse Entrance" → Objects tab → Link]*

**Narrator:**
"The object exists in the library, but it needs to appear somewhere in the story. I go to 'Lighthouse Entrance', click the Objects tab, and link the Rusty Key."

"I do the same for the Iron Staircase — not collectible, just part of the scenery."

### [02:15 – 02:50] HOW IT APPEARS IN THE GAME

> *[Screen: Branch preview — 'Things here' panel with objects listed]*

**Narrator:**
"In the game, objects appear in the 'Things here' list. The player can click to examine them, or type verbs directly."

"When they type 'examine key', the system displays the description we wrote — no specific interaction needed. The verbs examine, look, and read work automatically."

### [02:50 – 03:15] TIP: REUSABLE OBJECTS

**Narrator:**
"Since objects are global, you can use the same object in multiple branches. A torch the player carries, for example, can appear in several scenes without recreating it."

### [03:15 – 03:30] CTA

**Narrator:**
"Objects created and linked. Next video: Trackers — how to create a Health system for our lighthouse. See you there."
