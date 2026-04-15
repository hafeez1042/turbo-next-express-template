# .ai — Local Story Replica

This directory keeps a minimal local copy of Jira tickets that have been
worked on or planned in this repo. It serves as an offline index so the
`/implement` skill can match feature descriptions to existing tickets
without hitting Jira every time.

---

## Structure

```
.ai/
  stories/          ← one .md file per Jira ticket
  helpers/
    user-story-strcuture.md   ← template for drafting new stories
```

---

## Story file format (`stories/{TICKET-ID}.md`)

```markdown
---
id: PROJ-123
title: Short title of the ticket
status: To Do | In Progress | In Review | Done
type: Story | Bug | Task | Epic
priority: Highest | High | Medium | Low
project: PROJ
synced_at: 2024-01-15T10:30:00Z
---

## Summary
One paragraph description of what this ticket is about.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Notes
Any local notes, decisions, or context added during implementation.
```

---

## Rules

- Files are named exactly `{TICKET-ID}.md` (e.g. `PROJ-123.md`)
- Always sync from Jira before reading — local copy may be stale
- The local copy is a cache, not the source of truth — Jira is
- Do not manually edit `synced_at` — it is set automatically on fetch
- Notes section is the only section that should be edited locally
