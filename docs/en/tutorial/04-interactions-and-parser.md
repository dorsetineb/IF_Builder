# Module 04 — Interactions and Parser

**Tutorial: The Lighthouse Key**  
Estimated time: 10–15 minutes

---

## How Interactions work

An **Interaction** is a rule that tells the game:

> "If the player uses verb **[X]** on target **[Y]**, and has **[requirement Z]** in inventory, then **[do this]**."

| Field | What it defines |
|-------|----------------|
| **Verbs** | Words that trigger the action (e.g. `take, grab, collect`) |
| **Target** | Branch object affected (e.g. Rusty Key) |
| **Requirement** | Item needed in inventory (optional) |
| **Outcome** | What happens: go to branch, change text, add to inventory... |

---

## Interaction 1 — Take the Key

**Scenario:** Player types `take key` → key goes to inventory.

| Field | Value |
|-------|-------|
| **Verbs** | `take, grab, collect, pick up` |
| **Target** | Rusty Key |
| **Requirement** | *(none)* |
| **Add to Inventory** | ✅ Enabled |
| **Remove object from branch** | ✅ Enabled |
| **Destination** | *(stay in branch)* |
| **Success message** | You pick up the rusty key. It is heavy and cold. |

---

## Interaction 2 — Climb WITHOUT the Key

**Scenario:** Player types `climb stairs` without the key → gets a blocking message.

| Field | Value |
|-------|-------|
| **Verbs** | `climb, go up, use stairs, ascend` |
| **Target** | Iron Staircase |
| **Requirement** | *(none)* |
| **Destination** | *(stay in branch)* |
| **Success message** | You try to climb, but the door at the top is locked. You need something to open it. |

---

## Interaction 3 — Climb WITH the Key

**Scenario:** Player types `climb stairs` with key in inventory → goes to Dark Corridor.

| Field | Value |
|-------|-------|
| **Verbs** | `climb, go up, use stairs, ascend` |
| **Target** | Iron Staircase |
| **Requirement** | Rusty Key (in inventory) |
| **Consume item** | ❌ No |
| **Destination** | Dark Corridor |
| **Success message** | You use the key to unlock the door and climb the creaking stairs. |

> 💡 IF Builder prioritizes the interaction **with a met requirement** when the player has the item. The no-requirement interaction acts as a fallback.

---

## Parser Command Understanding

The parser accepts natural variations:

| Player types | System understands |
|-------------|-------------------|
| `take key` | verb: take · target: key |
| `grab the rusty key` | verb: grab · target: key |
| `key take` | verb: take · target: key |
| `use key on door` | verb: use · target: key + door |

---

## "Dark Corridor" Interaction — Continue

In the **Dark Corridor** branch, create:

| Field | Value |
|-------|-------|
| **Verbs** | `continue, advance, go, proceed, door` |
| **Target** | *(none — environment action)* |
| **Requirement** | *(none)* |
| **Destination** | Lantern Room |
| **Tracker Effect** | Health: +1 *(configure in Module 05)* |
| **Success message** | You press forward through the corridor. The cold seeps into your bones. |

---

## Negative Feedback

Customize the default "I don't understand" message per branch:

Branch Editor → Properties tab → **"Negative Feedback"** field:

```
That doesn't seem to have any effect. The lighthouse's silence is your only answer.
```

---

## ✅ Module 04 Checklist

- [ ] "Take Key" interaction created (adds to inventory, removes from branch)
- [ ] "Climb without key" interaction created (blocking message)
- [ ] "Climb with key" interaction created (requires Key → goes to Dark Corridor)
- [ ] "Continue" interaction in Dark Corridor → goes to Lantern Room
- [ ] Custom negative feedback set in "Lighthouse Entrance"
- [ ] Preview tested: full flow works

---

## Next step

→ [Module 05 — Trackers](./05-trackers.md)
