# Module 05 — Trackers

**Tutorial: The Lighthouse Key**  
Estimated time: 6–8 minutes

---

## What are Trackers?

**Trackers** are numeric variables that change as the player interacts with the world:

- 💚 **Health** — goes from 0 to 100; if it hits the limit, the player loses
- 💰 **Money** — rises when collecting coins, falls when spending
- 🧠 **Sanity** — decreases in horror events

| Type | Behavior |
|------|---------|
| Normal | Starts full; decreases as value drops |
| Inverted | Starts empty; rises as value increases (e.g. "Fatigue") |

---

## Step 1 — Access the Tracker Editor

In the sidebar, click **"Trackers"**.

---

## Step 2 — Create the Health Tracker

Click **"New Tracker"** (`+` icon).

| Field | Value |
|-------|-------|
| **Name** | Health |
| **Initial Value** | 0 |
| **Max Value** | 3 |
| **Bar Color** | Red (`#e74c3c`) |
| **Icon** | ❤️ (heart) |
| **Inverted Bar** | ✅ Yes |
| **Hide Values** | ❌ No |

> **Why inverted?** IF Builder triggers the consequence when the tracker reaches **Max Value**. To simulate health that depletes, we use the inverted bar: it starts visually full (value 0) and the consequence fires when it "fills up" (value 3 = 3 hits).

---

## Step 3 — Set the Consequence

In the **"Consequence on reaching max"** section, select the **"Defeat"** branch.

When the tracker reaches 3, the player is automatically sent to the Defeat branch.

---

## Step 4 — Link to the Dark Corridor

1. Select the **"Dark Corridor"** branch
2. Go to Interactions → select the "Continue" interaction
3. In the **"Trackers"** section → click **"Add"**
4. Select **"Health"** → Value: `+1`
5. Save

**Full flow with Tracker:**

```
Player types "continue" in Dark Corridor
   → Health rises by +1 (represents losing 1 HP)
   → If Health = 3 → "Defeat" branch triggered
   → If Health < 3 → goes to "Lantern Room" normally
```

---

## Step 5 — Test in Preview

Test the Dark Corridor preview:
1. Click **"Test Branch"**
2. Type `continue`
3. Watch the Health bar decrease

When the max value is reached, the game should automatically redirect to "Defeat".

---

## ✅ Module 05 Checklist

- [ ] "Health" tracker created with max value 3 and inverted bar
- [ ] "Defeat" branch set as consequence
- [ ] "Continue" interaction in Dark Corridor configured with `Health +1`
- [ ] Preview tested: Health bar changes when typing "continue"

---

## Next step

→ [Module 06 — Vignettes and Chapters](./06-vignettes-chapters.md)
