# Reference — Global Verbs

**Global Verbs** are commands that work in **any branch** of the fiction, regardless of context. Use them to create always-available commands like `help`, `inventory`, or `status`.

---

## Access

Sidebar → **Global Verbs**

---

## Global Verbs vs. Interactions

| | Global Verbs | Interactions |
|-|-------------|-------------|
| **Scope** | Any branch | Only the configured branch |
| **Target** | None | Branch object |
| **Requirement** | Not supported | Supported |
| **Navigation** | Does not navigate | Can navigate |
| **Typical use** | System commands | Narrative actions |

---

## System Reserved Verbs

The following verbs are already active by default and **don't need configuration**:

| Verb(s) | Behavior |
|---------|---------|
| `examine`, `look`, `see`, `read` | Displays the named object's description |
| `inventory`, `bag`, `pocket` | Opens the inventory panel |
| `help`, `?` | Displays the default help message |

---

## Creating a Global Verb

1. Access the **Global Verbs** module
2. Click **"Create Verb"**
3. Fill in the fields:

| Field | Type | Description |
|-------|------|-------------|
| **Verbs** | List (comma) | Words that activate the command |
| **Icon** | Lucide selector | Icon shown (Choice mode) |
| **Description / Response** | Textarea | Text shown to the player |

### Example: Status verb

```
Verbs: status, stats, about
Response: You are a lone explorer. Your goal: reach the top of the lighthouse.
```

### Example: Custom Help verb

```
Verbs: help, ?
Response: Use verbs like EXAMINE, TAKE, OPEN, USE, NORTH, SOUTH...
```

---

## Best Practices

- **Create a `help` verb** with instructions on how to play — especially in Parser mode where players can get lost
- **Be concise** in responses — players consult global verbs quickly
- **Include variations:** `north, n, go north` cover more ways to type
- **Don't overuse:** Global verbs carry no branch context — use for system commands, not narrative
