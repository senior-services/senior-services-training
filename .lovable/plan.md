

## Update Quiz Results Section

Replace the large quiz completion banner with a compact inline badge next to a renamed title.

### What Changes

**Before:**
- Full-width colored banner card showing score (QuizScoreSummary component)
- Title shows quiz name (e.g., "Fire Safety")
- Description text below title

**After:**
- No banner at all after completion
- Title reads **"Quiz questions (9)"** (with question count)
- After completion, a soft success badge appears to the right: **"100% (1/1 correct)"**
- Description line removed (descriptions were already cleared in previous migration)

### Principal Engineer Review

**Top 5 Risks/Issues:**
1. QuizScoreSummary component becomes unused -- dead code if not cleaned up
2. Score badge color should follow existing soft-variant conventions (already established in project)
3. Accessibility: the score badge needs proper ARIA context since it replaces a role="status" element
4. Minor: percentage edge case if totalQuestions is 0 (already guarded in QuizScoreSummary, need to replicate)
5. No risk to employee data or quiz logic -- purely visual change

**Top 5 Fixes/Improvements:**
1. Add `role="status"` and `aria-label` to the score badge for accessibility parity
2. Use existing `soft-success` / `soft-destructive` badge variants based on score threshold
3. Remove the QuizScoreSummary import and component file (or leave for potential reuse -- recommend removing)
4. Guard against zero-question edge case in percentage calculation
5. Keep layout simple: flexbox row with title + badge, no extra wrappers

**Database Change Required:** No

**Go/No-Go Verdict:** Go -- minimal, clean visual change with no logic or data impact.

### Technical Details

**`src/components/quiz/QuizModal.tsx`:**
- Remove lines 184-192 (QuizScoreSummary block)
- Replace lines 194-199 (title/description block) with:
  - `h2` text: "Quiz questions ({quiz.questions.length})"
  - When `isSubmitted && quizResults`: render an inline Badge with soft-success styling showing "{percentage}% ({correct}/{total} correct)"
  - Score color: green (soft-success) for >= 70%, red (soft-destructive) for < 70%
- Remove `QuizScoreSummary` import (line 13)

**`src/components/quiz/QuizScoreSummary.tsx`:**
- Delete file (no longer referenced anywhere after this change)
