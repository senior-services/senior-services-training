

## Quiz Question Deletion Rules & Banner Updates

### Changes — `src/components/EditVideoModal.tsx`

**1. Trash icon visibility (lines 1179–1186)**

Conditionally render the delete button: hide it when `hasAssignments && questions.length === 1`.

```tsx
{!(hasAssignments && questions.length === 1) && (
  <Button onClick={() => removeQuestion(questionIndex)} ...>
    <Trash2 ... />
  </Button>
)}
```

No changes needed for unassigned trainings — all questions (including the last) remain deletable as-is.

**2. Versioning banner (lines 1151–1156)**

Update the banner to dynamically change variant and message when assigned with only 1 question remaining:

```tsx
{hasAssignments && quiz && (
  <Banner
    variant={questions.length === 1 ? "warning" : "attention"}
    title="Versioning Notice"
  >
    This training is already assigned. Editing the quiz will create a new version for future employees.
    Completed trainings won't be affected.
    {questions.length === 1 && ' A minimum of one question is required.'}
  </Banner>
)}
```

### Files Changed

| File | Change |
|------|--------|
| `src/components/EditVideoModal.tsx` | Conditional trash icon visibility + dynamic banner variant/message |

### Database Change
**No.**

