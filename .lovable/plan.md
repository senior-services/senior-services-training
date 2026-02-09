
## Update Tooltip Hover Text Formatting

### What's Changing
Four tooltip text updates across the TrainingCard component to improve consistency in capitalization and punctuation.

**Required courses (not completed):**
1. Due date tooltip: "Due February 9, 2026" becomes "Due: February 9, 2026" (added colon)
2. Quiz tooltip: "Quiz: 5 questions" becomes "Quiz: 5 Questions" (capitalized "Questions")

**Completed courses:**
1. Completed date tooltip: "Completed February 9, 2026" becomes "Completed: February 9, 2026" (added colon)
2. Quiz score tooltip: "Quiz score: 80% (4/5 correct)" becomes "Quiz Score: 80% (4/5 Correct)" (capitalized "Score" and "Correct")

### Technical Details

**File: `src/components/TrainingCard.tsx`** -- 4 single-line text changes:
- Line 316: Add colon after "Completed"
- Line 330: Capitalize "score" to "Score" and "correct" to "Correct"
- Line 350: Add colon after "Due"
- Line 364: Capitalize "question(s)" to "Question(s)"

### Review
- **Top 5 Risks**: None -- text-only tooltip changes.
- **Top 5 Fixes**: (1-4) Update four tooltip strings for consistent formatting.
- **Database Change Required**: No
- **Go/No-Go**: Go
