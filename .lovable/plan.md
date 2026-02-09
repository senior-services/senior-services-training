
## Update Admin Quiz Column: Checkmark to Quiz Icon with Question Count

### What's Changing

In the admin Trainings tab, the Quiz column currently shows a checkmark icon (and optionally a version badge). This will be updated to show a MessageSquare (chat) icon followed by the question count number, styled as plain body text instead of a badge.

For example: `[chat-icon] 5` instead of a checkmark. Version badges (v2, v3) will remain alongside.

### Technical Details

**1. Extend `getQuizVersionInfo` return type** (`src/services/quizService.ts`)
- Add `questionCount` to the returned object
- The count is already queried (line 297-300) but not returned -- just include it in the return value

**2. Update VideoTable state and rendering** (`src/components/dashboard/VideoTable.tsx`)
- Extend the `videoQuizzes` map type to include `questionCount: number`
- Store the question count from `getQuizVersionInfo`
- Replace the checkmark SVG with a `MessageSquare` icon from lucide-react
- Display the question count as plain text (body text style, not a Badge)
- Keep the version badge (v2, v3) when applicable

The quiz cell will render roughly as:
```
[MessageSquare icon] 5  [v2 badge if applicable]
```

### Review

- **Top 5 Risks**: (1) Changing `getQuizVersionInfo` return type affects all callers -- only VideoTable uses it, safe. (2) None other -- minimal change.
- **Top 5 Fixes**: (1) Return questionCount from existing query. (2) Replace checkmark with MessageSquare icon + count. (3) Use body text style instead of badge.
- **Database Change Required**: No
- **Go/No-Go**: Go
