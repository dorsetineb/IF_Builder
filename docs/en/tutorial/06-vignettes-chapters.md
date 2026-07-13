# Module 06 — Vignettes and Chapters

**Tutorial: The Lighthouse Key**  
Estimated time: 8–10 minutes

---

## What are Vignettes?

**Vignettes** are cinematic screens that appear outside the main interaction loop:

| Type | When it appears |
|------|----------------|
| **Opening** | Before the first branch — game title screen |
| **Transition** | During an interaction — dramatic moment |
| **Conclusion** | At the end — victory/defeat screen |

---

## Step 1 — Create the Opening Vignette

In the narrative list, click **"Create Chapter or Branch"** → **"Create Chapter"**.

**Type:** Select **"Opening"**

| Field | Value |
|-------|-------|
| **Internal Name** | Opening - The Lighthouse |
| **Title** | The Lighthouse Key |
| **Text** | *See below* |
| **Background Image** | Stormy lighthouse (dark, dramatic image) |
| **Music** | Ambient track — wind and ocean |
| **Button Text** | Enter the Lighthouse |

**Opening text:**

```
Somewhere on the coast, there's a lighthouse nobody visits.

They say whoever climbs to the top never comes back the same.

Tonight, you had no choice.
```

---

## Step 2 — Configure the Opening Layout

| Setting | Value |
|---------|-------|
| **Horizontal alignment** | Left |
| **Vertical alignment** | Center |
| **Text animation** | Typewriter |
| **Speed** | 3 |
| **Visual effect** | Rain |
| **Show Title** | ✅ Yes |
| **Show Description** | ✅ Yes |

---

## Step 3 — Connect the Opening to the First Branch

In the Opening vignette editor, find the **"Go To"** field and select **"Lighthouse Entrance"**.

---

## Step 4 — Create the Conclusion Vignette

Create a new Chapter.

**Type:** Select **"Conclusion"**

| Field | Value |
|-------|-------|
| **Internal Name** | Conclusion - Victory |
| **Title** | You Reached the Top |
| **Text** | *See below* |
| **Image** | Ocean view from a lighthouse (relief, dawn) |
| **Music** | Soft, hopeful soundtrack |
| **Button Text** | View Credits / Restart |

**Conclusion text:**

```
The lantern spins above your head, sending signals beyond the horizon.

You don't know what that key was guarding. But now the lighthouse is working again.

Far away, through the storm, a ship changes course.
```

---

## Step 5 — Connect the Conclusion to "Lantern Room"

1. Go to the **"Lantern Room"** branch
2. Properties tab → **"Conclusion Chapter"**
3. Select the Conclusion vignette

---

## Step 6 — Create the Defeat Vignette (optional)

| Field | Value |
|-------|-------|
| **Title** | Lost in the Shadows |
| **Text** | The cold won. The darkness won. And you never made it to the top. |
| **Image** | Darkness with a distant point of light |

Connect to the **"Defeat"** branch.

---

## ✅ Module 06 Checklist

- [ ] Opening vignette created (type "Opening") and connected to "Lighthouse Entrance"
- [ ] Typewriter animation configured in the opening
- [ ] Conclusion vignette created and connected to "Lantern Room"
- [ ] Defeat vignette created (optional) and connected to "Defeat" branch
- [ ] Full game preview tested from start to finish

---

## Next step

→ [Module 07 — Exporting](./07-exporting.md)
