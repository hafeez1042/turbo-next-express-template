# .ai — AI Development Context

```
.ai/
  stories.md                    ← single index of all Jira tickets touched here
  helpers/
    user-story-strcuture.md     ← template for drafting new stories
```

## stories.md format

A markdown table — one row per ticket. Updated automatically by `/implement`.

| Column | Source |
|--------|--------|
| ID | Jira ticket key |
| Title | Jira summary |
| Status | Jira status |
| Type | Story / Bug / Task |
| Priority | Jira priority |
| Synced | ISO date of last fetch |

When `/implement` needs full ticket details it always fetches live from Jira.
`stories.md` is just an index — not a cache of full content.
