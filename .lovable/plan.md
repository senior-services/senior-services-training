
## Fix: Quiz Scoring Bug for Multiple-Choice Questions

### What's Happening

When Billy submitted his quiz, one of the 4 questions was a multiple-choice question where he selected 2 options (one correct, one incorrect). The system counted each individual option selection separately instead of grading the question as a whole. This results in a misleading score of "50% (2/4)" on the training card.

The scoring should work per-question, not per-option-selected.

### What Should Happen

Each question should be worth exactly 1 point, regardless of how many options are selected. For multiple-choice questions, the question should be marked correct only if ALL selected options are correct AND no incorrect options are selected.

### The Fix

Update the database function (`submit_quiz_attempt`) that calculates the score. Instead of counting each correct response individually, group responses by question and determine if each question was answered correctly as a whole.

No frontend code changes are needed -- the issue is entirely in the server-side scoring logic.

### Risk Assessment

**Top 5 Risks/Issues:**
1. Existing quiz attempts already stored in the database will retain their old (incorrect) scores -- a data migration may be needed for historical accuracy
2. The fix must handle edge cases: a multiple-choice question where the employee selects all correct options but also an incorrect one should count as wrong
3. Single-answer and true/false questions (which send only one response per question) should continue to work identically
4. The `quiz_responses` table still stores individual option selections, which is correct -- only the aggregate score calculation changes
5. Must verify the correct options display in the results view still works (it uses `quiz_responses` rows, not the score)

**Top 5 Fixes/Improvements:**
1. Replace the per-response scoring loop in `submit_quiz_attempt` with per-question scoring: group responses by `question_id`, then check if all responses for that question are correct
2. No frontend changes needed
3. No new tables or columns needed
4. Optionally fix Billy's existing attempt score with a one-time data correction query
5. The `total_questions` count remains unchanged (it's already correct)

**Database Change Required:** Yes -- update the `submit_quiz_attempt` RPC function to score per-question instead of per-response.

**Go/No-Go Verdict:** Go -- the scoring logic has a clear bug that produces incorrect results for any multiple-choice question with multiple selections.

### Technical Detail

**Database migration** -- replace the scoring section of `submit_quiz_attempt`:

Current logic (simplified):
```text
FOR each response:
  check if selected option is_correct
  IF correct: v_correct_count += 1
score = v_correct_count    (counts individual correct options)
```

New logic:
```text
FOR each response:
  insert response with is_correct flag (unchanged)

-- After all responses inserted, count correctly-answered QUESTIONS
SELECT COUNT(DISTINCT question_id) INTO v_correct_count
FROM quiz_responses
WHERE quiz_attempt_id = v_quiz_attempt_id
  AND question_id NOT IN (
    SELECT question_id FROM quiz_responses
    WHERE quiz_attempt_id = v_quiz_attempt_id AND is_correct = false
  );

score = v_correct_count    (counts questions where ALL responses were correct)
```

This means:
- A question with only correct selections = 1 point
- A question with any incorrect selection = 0 points
- Single-answer/true-false questions (1 response each) behave the same as before

**Optional data fix** for Billy's existing attempt:
```text
UPDATE quiz_attempts SET score = [corrected value] WHERE id = '06c120fc-...';
```
