# Reference — Interactions

**Interactions** are the heart of IF Builder's game system. They define what happens when the player uses a verb — whether by typing (Parser) or clicking (Choice).

---

## Interaction Anatomy

```
TRIGGERS & CONDITIONS
  Verbs:  [take, grab, collect]
  Target: [Rusty Key]
  Req.:   [none]

OUTCOME
  → Add to Inventory: ✅
  → Remove from Branch: ✅
  → Destination: (stay in branch)
  → Message: "You pick up the rusty key..."
```

---

## Trigger Fields

| Field | Type | Description |
|-------|------|-------------|
| **Verbs** | List (comma) | Words that activate the interaction |
| **Target** | Branch object | Object the verb is used on |
| **Requirement** | Inventory object | Item the player needs to have for the interaction to work |
| **Icon** | Lucide selector | Icon shown on the action button (Choice mode) |

---

## Outcome Fields

### Behavior Flags

| Flag | Description |
|------|-------------|
| **Add to Inventory** | The target object goes to the player's inventory |
| **Remove Object from Branch** | The target object disappears from the branch after the action |
| **Consume Requirement Item** | The required item is removed from inventory after use |
| **Show Object Image** | Displays the object's image in a pop-up |

### Destination

| Option | Behavior |
|--------|---------|
| *(Stay in branch)* | Player remains in the current branch |
| Any branch | Player is moved to the selected branch |

### Success Message

Text shown when the interaction executes successfully. Accepts basic HTML: `<strong>`, `<em>`, `<span>`

### Sound Effect

MP3 file upload, played when the interaction is triggered.

---

## Tracker Effects

Each interaction can modify **one or more Trackers**:

| Field | Value |
|-------|-------|
| **Tracker** | Select the tracker to be affected |
| **Value** | Positive number (add) or negative (subtract) |

---

## Transition Settings

Controls the transition animation when **changing branches**:

| Field | Options |
|-------|---------|
| **Transition Type** | `fade`, `slide-left`, `slide-right`, `slide-up`, `slide-down`, `zoom`, `blur`, `none` |
| **Speed** | 1 (slow) to 10 (fast) |

---

## Interaction Priority

When multiple interactions match the same verb+target, the system uses this priority order:

1. **Interaction with met requirement** (player has the item)
2. **Interaction without requirement** (fallback)

This enables intuitive conditional behaviors:

```
Interaction A: climb + staircase  (no requirement) → "locked" message
Interaction B: climb + staircase  (requires key)   → goes to the top room
```

---

## Best Practices

- **Use infinitive and command forms:** `use, open, take, grab` — cover common variations
- **Always create a fallback:** Without a no-requirement interaction, the parser may go silent — frustrating for players
- **Rich feedback messages:** Use the success message to enrich the narrative, not just confirm the action
- **Test all combinations:** Use "Test Branch" to verify verbs work as expected
