# Module 07 — Exporting

**Tutorial: The Lighthouse Key**  
Estimated time: 5 minutes

---

## Step 1 — Full Test Before Exporting

1. In the header, click **"Preview"** (triangle/play icon)
2. The game will open with the **Opening Vignette**
3. Test all paths:
   - ✅ Victory path: take key → climb → corridor → lantern room → conclusion
   - ✅ Defeat path: cross the corridor 3 times → max tracker → defeat
   - ✅ Blocked path: try to climb without key → error message

---

## Step 2 — Save the Project (.zip)

1. In the header, click the **"Save"** button (💾 floppy disk icon)
2. A dialog box will ask for the file name
3. Type: `the-lighthouse-key`
4. Click **"Save"**

The browser will download a **`the-lighthouse-key.zip`** file.

> ⚠️ **Important:** The editor **does not auto-save**. If you close the tab without saving, you'll **lose all progress**.

---

## What's inside the .zip?

```
the-lighthouse-key.zip
├── index.html        ← The complete game (opens directly in browser)
├── game.json         ← All project data (for reimporting into editor)
├── assets/
│   ├── lighthouse-image.jpg
│   └── opening-track.mp3
└── engine/
    └── game-engine.js
```

| File | Use |
|------|-----|
| `index.html` | Open to **play** offline |
| `game.json` | Import into editor to **resume editing** |
| `assets/` | Project images and sounds |
| `engine/` | Game engine (do not edit manually) |

---

## Step 3 — Play Offline

1. Extract the `.zip` contents to any folder
2. Open `index.html` in any browser
3. The game works **100% offline**, no internet required

> 💡 You can send the `.zip` to anyone — they extract it and open `index.html`. That simple.

---

## Step 4 — Resume Editing

To continue editing the project later:

1. Open IF Builder at [ifbuildr.com](http://www.ifbuildr.com)
2. In the header, click **"Load"** (folder/upload icon)
3. Select the `.zip` file you saved
4. The editor restores **the entire project**

> 💡 You can also share the `.zip` with another IF Builder user — they can import it, see how you built the fiction, and even remix it!

---

## JSON Backup (Optional)

For a lighter backup (without embedded images/audio):

- Go to **Settings** in the sidebar
- **"Data Management"** section
- Click **"Export Backup"** — generates a `.json` file

Restore it in Settings → **"Import File (.json)"**.

---

## ✅ Module 07 Checklist

- [ ] Full preview tested (all paths)
- [ ] Project saved as `the-lighthouse-key.zip`
- [ ] `.zip` extracted and `index.html` opened offline successfully
- [ ] Game reimported into editor from `.zip` (round-trip test)

---

## Next step

→ [Module 08 — Complete Project Overview](./08-complete-project-example.md)
