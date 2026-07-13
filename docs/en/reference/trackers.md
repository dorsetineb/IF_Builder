# Reference — Trackers

**Trackers** are numeric variables that change in response to player actions. Use them to create health systems, currency, sanity, mission progress, reputation, and much more.

---

## Access

Sidebar → **Trackers**

---

## Tracker Properties

| Field | Type | Description |
|-------|------|-------------|
| **Name** | Text | Displayed in the game interface |
| **Initial Value** | Number | Value when the game starts |
| **Max Value** | Number | Value that triggers the consequence |
| **Bar Color** | Color picker | Visual color of the progress bar |
| **Icon** | Selector | Bar icon (heart, coin, etc.) |
| **Inverted Bar** | Toggle | Reverses the fill direction |
| **Hide Values** | Toggle | Hides the X/Y numbers in the interface |
| **Consequence Branch** | Branch selector | Where the player goes when reaching max |

---

## Normal vs. Inverted Bar

| Configuration | Visual bar | Typical use |
|-------------|-----------|-------------|
| **Normal** | Starts full, decreases | Health dropping, ammo |
| **Inverted** | Starts empty, rises | Fatigue accumulating, progress |

### Example: Health (inverted bar — recommended)

```
Initial Value: 0
Max Value: 3   ← consequence at 3 hits
Inverted Bar: Yes  ← visually appears "full" at the start
Damage: +1 per interaction
```

> ⚠️ IF Builder triggers the consequence when the tracker reaches **Max Value**. To simulate "health running out", use the inverted configuration.

---

## Linking Trackers to Interactions

For a Tracker to change value, link it to an **Interaction**:

1. Branch Editor → Interactions tab
2. Select or create an interaction
3. **"Trackers"** section → **"Add"**
4. Select the Tracker and set the change value

| Value | Effect |
|-------|--------|
| `+10` | Increases the Tracker by 10 |
| `-10` | Decreases the Tracker by 10 |
| `+1` | Increases by 1 (in inverted model = 1 damage hit) |

One interaction can affect **multiple Trackers** simultaneously.

---

## Consequence

When the Tracker reaches **Max Value**, the player is automatically sent to the **Consequence Branch**.

Common uses:
- Health depleted → "Game Over" branch
- Mission complete → "Victory" branch
- Sanity at zero → madness branch
- Maximum debt → jail branch

---

## Visibility in the Interface

To display Trackers during gameplay:

Game Settings → Systems → **"Show Trackers in Interface"** → ✅ Enable

Trackers appear as bars with icon and values (e.g., ❤️ 2/3).

---

## Usage Examples

| System | Tracker | Initial | Max | Consequence |
|--------|---------|---------|-----|-------------|
| Basic health | Health | 0 | 3 | Defeat Branch |
| Economy | Gold | 0 | 100 | Victory (rich) Branch |
| Sanity | Sanity | 100 | — | *(no consequence — visual only)* |
| Progress | Clues found | 0 | 5 | Revelation Branch |
| Reputation | NPC trust | 0 | 10 | Alliance Branch |
