# Reference — Object Library

The **Object Library** is where you create and manage all objects in your interactive fiction. Objects are **global**: created once and reusable across multiple branches.

---

## Access

Sidebar → **Objects**

---

## Object Properties

| Field | Type | Description |
|-------|------|-------------|
| **Object Name** | Text | Identifier used by the player and the parser |
| **Unique ID** | Text (auto) | Auto-generated; not editable |
| **Examine Description** | Textarea | Shown when player uses `examine`, `look`, or `read` |
| **Image** | Upload | Object photo/illustration (appears in the details pop-up) |
| **Collectible** | Toggle | Whether it can be added to the inventory |
| **Icon** | Selector | Lucide icon displayed in the game object list |

---

## Reserved Verbs for Objects

The following verbs work **automatically** on any object without additional configuration:

| Verb(s) | Result |
|---------|--------|
| `examine`, `look`, `see` | Displays the object's "Examine Description" |
| `read` | Displays the "Examine Description" (useful for documents/signs) |

These verbs **don't need to be created as Interactions** — the system recognizes them natively.

---

## Linking Objects to Branches

An object must be **linked** to the branch where it appears:

1. Select a branch in the narrative
2. **"Objects"** tab in the Branch Editor
3. Click **"Link Object"**
4. Search for and select the desired object

**Unlink:** The "Unlink" button removes the object from the branch, but **does not delete** it from the global library.

---

## Global vs. Branch Objects

| Aspect | Details |
|--------|---------|
| **Creation** | Always in the Global Library |
| **Use** | Linked to one or more branches |
| **Editing** | Editing in the library updates all branches |
| **Branch removal** | "Unlink" — object remains in the library |
| **Global removal** | "Delete Object" — removes from all branches and interactions |

---

## Best Practices

- **Name objects clearly:** Use names the player would naturally type (`key`, `sword`, `letter`)
- **Write good descriptions:** The examine description enriches the narrative — use it to give details and clues
- **Small images:** Embedded objects increase `.zip` size — prefer images under 200KB
- **Reusable objects:** The same object can appear in multiple branches (e.g., a torch the player carries)
