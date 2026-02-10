

## Update Button Labels in Quiz Cancel Confirmation

Simple copy update to four button labels in `src/components/VideoPlayerFullscreen.tsx`.

### Changes

| Path | Current | Updated |
|------|---------|---------|
| "Exit training?" dialog - cancel button | "Continue Quiz" | "Return to Quiz" |
| "Exit training?" dialog - action button | "Exit Quiz" | "Exit Training" |
| "Discard unsaved progress?" dialog - cancel button | "Keep editing" | "Continue Editing" |
| "Discard unsaved progress?" dialog - action button | "Discard & Exit" | "Discard & Exit Training" |

### Technical Detail

In `src/components/VideoPlayerFullscreen.tsx`, update the two conditional button labels (around lines 657-663):

```tsx
<AlertDialogCancel>
  {hasQuizChanges ? 'Continue Editing' : 'Return to Quiz'}
</AlertDialogCancel>
<AlertDialogAction onClick={handleConfirmedCancel}>
  {hasQuizChanges ? 'Discard & Exit Training' : 'Exit Training'}
</AlertDialogAction>
```

- **Database Change Required**: No
- **Go/No-Go**: Go

