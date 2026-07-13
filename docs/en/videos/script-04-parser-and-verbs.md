# Video Script #04 — Parser and Verbs

**Title:** How Verbs and the Parser Work  
**Estimated duration:** 4–5 minutes  
**Series:** IF Builder Tutorials

---

## 🎙️ Script

### [00:00 – 00:30] WHAT IS THE PARSER

> *[Screen: Game preview with text input field highlighted]*

**Narrator:**
"The Parser is the system that interprets what the player types. When they write 'take key', IF Builder identifies the verb — take — and the target — key — and executes the corresponding action."

"You, as the author, define which verbs do what. This is done in Interactions."

### [00:30 – 01:30] CREATE INTERACTION — TAKE KEY

> *[Action: open Branch Editor "Lighthouse Entrance" → Interactions tab → Create Interaction]*

**Narrator:**
"I go to the 'Lighthouse Entrance' branch, click the Interactions tab, and create a new one."

"In the Verbs field, I write all the words the player might use: 'take, grab, collect, pick up'."

> *[Action: select Target = Rusty Key, enable Add to Inventory and Remove from Branch]*

"The target is the Rusty Key. I enable 'Add to Inventory' and 'Remove from Branch' — so the key disappears from the scene after being collected."

### [01:30 – 02:30] INTERACTION WITH REQUIREMENT

> *[Action: create new interaction — Climb staircase with key]*

**Narrator:**
"Now the interesting part. I want the player to only be able to climb the stairs if they have the key."

"New interaction. Verbs: 'climb, go up'. Target: Iron Staircase. In the Requirement field, I select Rusty Key. Destination: Dark Corridor."

"The system prioritizes the interaction with a met requirement — and uses the no-requirement one as a fallback."

### [02:30 – 03:15] NEGATIVE FEEDBACK

> *[Action: create fallback "climb" interaction without requirement]*

**Narrator:**
"But what happens if the player tries to climb without the key? I create a second 'climb' interaction without any requirement, that keeps the player in the branch and shows an explanatory message."

### [03:15 – 03:50] TEST IN PREVIEW

> *[Action: click "Test Branch"]*

**Narrator:**
"Let me test. First without the key: type 'climb' — blocking message. Now 'take key' — goes to inventory. Type 'climb' again — and it worked. The system recognized I had the key."

### [03:50 – 04:10] CTA

**Narrator:**
"That's how IF Builder's core works — verbs, targets, requirements, outcomes. Next video: Trackers and consequences. See you there."
