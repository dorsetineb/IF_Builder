# Reference — Vignettes and Chapters

**Vignettes** (also called **Chapters**) are cinematic screens that appear outside the main interaction loop. They enrich the narrative with dramatic opening, transition, and conclusion moments.

---

## Types of Vignette

| Type | When it appears | Typical use |
|------|----------------|-------------|
| **Opening** | Before the first branch | Title screen, prologue, introduction |
| **Transition** | During an interaction (triggered as outcome) | Time passage, flashback, dramatic moment |
| **Conclusion** | When ending at a final branch | Epilogue, credits, victory/defeat screen |

---

## Vignette Properties

### Identification

| Field | Description |
|-------|-------------|
| **Internal Name** | Editor reference (not displayed in game) |
| **Title** | Title displayed on screen (can be hidden) |
| **Text** | Narrative body text |

### Multimedia

| Field | Details |
|-------|---------|
| **Background Image** | JPG/PNG/WebP — fills the entire screen |
| **Music** | MP3 — plays during the vignette |
| **Visual Effect** | `none`, `grain`, `rain`, `blur`, `chromatic`, `tv`, `confetti`, `glitch` |

### Layout

| Field | Options |
|-------|---------|
| **Horizontal alignment** | Left / Right |
| **Vertical alignment** | Center / Bottom |
| **Show Title** | Yes / No |
| **Show Description** | Yes / No |

### Text Animation

| Field | Options |
|-------|---------|
| **Type** | `fade` (gradually appears) / `typewriter` (letter by letter) |
| **Speed** | 1 (very slow) to 5 (fast) |

### Navigation

| Field | Description |
|-------|-------------|
| **Button Text** | Text for the advance button (e.g., "Continue", "Begin") |
| **Next Scene** | Branch the button navigates to |

---

## Connecting Vignettes to the Flow

### Opening Vignette
Set the **"Next Scene"** field to the fiction's starting branch.

### Transition Vignette
Triggered from **Interactions**: In the Interaction Editor, use the **"Chapter"** field instead of "Destination".

### Conclusion Vignette
Connected to a final branch:
- Branch Editor → Properties tab → **"Conclusion Chapter"**

---

## Best Practices

- **Short openings:** 2–4 impactful sentences beat a long paragraph
- **Typewriter for horror/mystery:** The typing animation builds tension effectively
- **Full-screen image:** Use images without embedded text — the vignette text overlays it
- **Transition music:** Change music in conclusion vignettes to create emotional contrast
- **Left alignment:** Long text is more readable aligned to the left
