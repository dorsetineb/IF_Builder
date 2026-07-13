# Video Script #06 — Trackers

**Title:** Creating a Consequence System with Trackers  
**Estimated duration:** 4–5 minutes  
**Series:** IF Builder Tutorials

---

## 🎙️ Script

### [00:00 – 00:30] WHAT ARE TRACKERS

> *[Screen: Game interface with Health bar visible]*

**Narrator:**
"Trackers are numeric variables that change as the player acts. Health, money, sanity, reputation — anything that needs a meter."

"When a Tracker reaches a limit value, the game sends the player to a specific branch — could be defeat, victory, or any narrative consequence."

### [00:30 – 01:30] CREATE TRACKER

> *[Action: click "Trackers" in sidebar → New Tracker]*

**Narrator:**
"In the sidebar, I click Trackers. Create a new one."

"Name: Health. Initial Value: 0. Max Value: 3. Red color, heart icon."

### [01:30 – 02:15] INVERTED BAR AND CONSEQUENCE

> *[Action: enable Inverted Bar]*

**Narrator:**
"Here's an important logic. IF Builder triggers the consequence when the Tracker hits Max Value."

"To simulate health that depletes, I enable Inverted Bar. Visually, the bar starts full — but mathematically the value is zero. Each hit adds 1, and at 3 the player loses."

> *[Action: select Consequence Branch = "Defeat"]*

"In the Consequence field, I select the Defeat branch."

### [02:15 – 03:00] LINK TO INTERACTION

> *[Action: go to Dark Corridor → Continue interaction → Trackers → Add]*

**Narrator:**
"Now I connect the Tracker to an action. I go to the Dark Corridor, in the 'Continue' interaction."

"In the Trackers section, I add an effect: Health +1. Every time the player advances through the corridor, Health increases by 1 — which in our inverted model represents losing 1 HP."

### [03:00 – 03:45] TEST

> *[Action: open Dark Corridor preview]*

**Narrator:**
"Let me test. Type 'continue' — Health bar decreases. Again... again..."

> *[Screen: Max reached → automatic transition to Defeat branch]*

"And when it hit the limit — the game automatically sent me to the Defeat branch. No additional setup."

### [03:45 – 04:10] CTA

**Narrator:**
"Trackers are simple to set up but very powerful. With them, you create real consequences for player choices."

"Next video: cinematic Vignettes. See you there."
