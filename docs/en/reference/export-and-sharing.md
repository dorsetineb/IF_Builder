# Reference — Export and Sharing

IF Builder exports fictions as **self-contained files** that work in any browser, without internet, server, or installation.

---

## Export Formats

| Format | Contents | Use |
|--------|----------|-----|
| **`.zip`** | Complete game + data + assets | Play, share, reimport |
| **`.json`** | Project data (no images/audio) | Lightweight backup, version control |

---

## Saving a Project (.zip)

1. Header → **💾 Save** icon (or "Save" button)
2. Type the file name in the dialog box
3. The browser automatically downloads the `.zip`

> ⚠️ **The editor does not auto-save.** Save frequently to avoid losing progress.

### What's inside the .zip?

```
my-project.zip
├── index.html        ← Opens the game in the browser
├── game.json         ← Project data (for reimporting)
├── assets/           ← Images and audio
│   ├── img_scene_1.jpg
│   └── bgm_opening.mp3
└── engine/
    └── game-engine.js ← Game engine (do not edit)
```

---

## Loading a Project (.zip)

To resume editing a saved project:

1. Header → **📂 Load** icon
2. Select the `.zip` file
3. The editor restores **all data**: branches, objects, interactions, settings, assets

> 💡 Loading a `.zip` **replaces** the current project. Save first if needed.

---

## Playing Offline

1. Extract the `.zip` contents to any folder
2. Open `index.html` in any modern browser
3. The game works 100% offline, no installation

**Compatibility:** Chrome, Firefox, Edge, Safari (desktop and mobile)

---

## Sharing with Players

### Via .zip (recommended)
Send the `.zip` via email, Google Drive, WhatsApp, etc.  
The recipient extracts it and opens `index.html`.

### Via IF platforms
The `.zip` can be published on platforms like:
- [itch.io](https://itch.io) — free HTML game hosting
- [IfDB](https://ifdb.org) — interactive fiction directory

### Via editor import
Any IF Builder user can import your `.zip` and view/edit the fiction — great for collaboration and remixes.

---

## Backup and Restore (.json)

### Export Backup

Sidebar → **Settings** → Data Management → **"Export Backup"**

Generates a `.json` file with all project data, **without** embedded images and audio.

### Restore from Backup

Sidebar → **Settings** → Data Management → **"Import File (.json)"**

> ⚠️ Restoring **replaces** all current project data.

---

## Optimization Tips

| Tip | Impact |
|-----|--------|
| Compress images before importing (TinyPNG, Squoosh) | High |
| Use WebP instead of PNG for images | High |
| Keep audio files below 2MB | Medium |
| Avoid images above 1280×720px | Medium |
| Check performance alerts in the Connections Map | Informative |
