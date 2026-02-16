

## Batch Email Notifications

### Overview

Consolidate per-video notification calls into a single Edge Function call per employee, with training titles rendered as a bullet list in the email.

### Changes

**1. Edge Function (`supabase/functions/send-training-notification/index.ts`)**

- Accept `training_titles` (string array) in addition to the existing `training_title` (string) for backward compatibility
- Normalize to an array internally: `const titles = training_titles || [training_title]`
- Update the HTML body to render titles as a `<ul>` bullet list instead of a single paragraph
- Update the email subject line to say "New Training Assigned" (single) or "X New Trainings Assigned" (plural)
- Validation: require at least one title

**2. API Service (`src/services/api.ts`, lines 864-897)**

- Change `sendNotification` params: replace `training_title: string` with `training_titles: string[]`
- Update the function body to pass `training_titles` in the request body
- Update log messages to reference titles array

**3. AssignVideosModal (`src/components/dashboard/AssignVideosModal.tsx`, lines 391-404)**

- Replace the per-video loop with: collect all assigned video titles into an array, then make one `sendNotification` call with `training_titles`

### HTML Template Change (Edge Function)

The training section currently shows a single title. It will change to:

```text
Before:
  Training
  [Single Title]

After:
  Assigned Training(s)
  - Title 1
  - Title 2
  - Title 3
```

### Files

| File | Action |
|------|--------|
| `supabase/functions/send-training-notification/index.ts` | Edit - accept array, render bullet list |
| `src/services/api.ts` | Edit - change param type to `string[]` |
| `src/components/dashboard/AssignVideosModal.tsx` | Edit - collect titles, single call |

### Review

1. **Top 3 Risks:** (a) Backward compatibility if any other caller still sends `training_title` -- mitigated by accepting both. (b) Very long title lists could stretch the email -- unlikely given typical assignment counts. (c) No risk to assignment flow since notifications remain fire-and-forget.
2. **Top 3 Fixes:** (a) Users no longer receive N separate emails per batch assignment. (b) Single network call instead of N parallel calls improves efficiency. (c) Bullet list gives a clear summary of all assigned trainings.
3. **Database Change:** No.
4. **Verdict:** Go.

