# Reference — Branch Editor

The **Branch Editor** is IF Builder's central module. It's where you write and configure each scene of your interactive fiction.

---

## Access

Sidebar → **Narrative** → Select a branch from the list

---

## Editor Tabs

| Tab | Content |
|-----|---------|
| **Properties** | Title, description, type, general settings, multimedia |
| **Objects** | Objects present in this branch |
| **Interactions** | Verb rules for this branch |
| **Choices** | Option buttons (IF/Choice mode) |

---

## Properties Tab

### Identification

| Field | Type | Description |
|-------|------|-------------|
| **Title** | Text | Branch name shown in the list and map |
| **Unique ID** | Text (auto) | Auto-generated; not editable |

### Description

The text the player reads upon entering the branch.

**Interactive Text:** Use `<word>` to highlight clickable terms:

```
There is a <wooden door> at the back.
```

Words between `< >` appear highlighted in the game and can be used as verb targets.

### Branch Settings

| Option | Description |
|--------|-------------|
| **Starting Branch** | Sets this as the fiction's starting point |
| **Ending Branch** | Marks as story finale |
| **Conclusion Chapter** | Vignette displayed when ending at this branch |

### Suggestions

Comma-separated words shown as hints to the player in Parser mode:

```
examine, take, open, north
```

### Negative Feedback

Message shown when the player types something unrecognized **in this specific branch**. If empty, uses the global message.

---

## Multimedia Tab

### Background Image

| Attribute | Details |
|-----------|---------|
| **Format** | JPG, PNG, WebP |
| **Suggested resolution (horizontal)** | 1280×720 px |
| **Suggested resolution (vertical)** | 720×1280 px |
| **Storage** | Embedded in .zip (base64) |

**Visual Effects (Overlay):** `none`, `grain`, `rain`, `blur`, `chromatic`, `tv`, `confetti`, `glitch`

### Background Music

| Attribute | Details |
|-----------|---------|
| **Format** | MP3 |
| **Behavior** | Loops upon entering the branch |

---

## Branch Types (vignetteType)

| Type | Description |
|------|-------------|
| `none` | Normal branch (default) |
| `opening` | Game opening screen |
| `transition` | Cinematic transition screen |
| `conclusion` | Game ending screen (victory/defeat) |

Chapter-type branches have additional fields: title, text, content alignment, vertical alignment, text animation, animation speed, show title/description toggles.

---

## Branch Actions

| Button | Function |
|--------|----------|
| 💾 Save | Saves current branch changes |
| ↩ Undo | Reverts unsaved changes |
| 📋 Copy | Duplicates branch with all its settings |
| 🗑️ Delete | Removes branch and all references to it |
| ▶ Test | Opens preview of this branch in isolation |
