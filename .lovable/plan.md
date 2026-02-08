

## Fix: Quiz Score Mismatch Between Review UI and Dashboard/Export

### What's Happening

Billy's quiz attempt was scored by the **old** scoring function, which counted each individual correct response (2 correct responses = score of 2). The quiz review screen recalculates from the raw response data using **per-question** logic (a question only counts as correct if ALL selected options are correct), getting 1 out of 4.

- **Review screen** (recalculated from responses): 25% (1/4)
- **Dashboard and export** (reads stored score): 50% (2/4)

The current scoring function has already been fixed to use per-question logic, so new quiz submissions will be scored correctly. This is a **historical data issue** for attempts that were scored under the old function.

### What Needs to Happen

1. Run a one-time SQL update to recalculate stored scores for all existing quiz attempts using per-question logic
2. No code changes needed -- the review UI and the current scoring function already agree on per-question scoring

### Risk Assessment

**Top 5 Risks/Issues:**
1. Only affects attempts scored before the per-question migration -- limited blast radius
2. Must not break attempts that were already scored correctly under the new function
3. The recalculation uses the same logic as both the review UI and the new RPC, so results will be consistent
4. Scores can only go down or stay the same (never inflated by this fix)
5. No risk to the scoring function itself -- it's already correct for new attempts

**Top 5 Fixes/Improvements:**
1. Single SQL UPDATE to recalculate all stored scores from response data using per-question logic
2. No application code changes required
3. No new migrations needed -- this is a data correction
4. Idempotent -- safe to run multiple times, always produces the same result
5. Affects dashboard display, export, and training card quiz summary consistently

**Database Change Required:** Yes -- a data correction UPDATE (no schema change)

**Go/No-Go Verdict:** Go -- one SQL statement fixes all historical score mismatches.

### Technical Detail

**SQL to run (one-time data correction):**

```text
UPDATE quiz_attempts qa
SET score = correct_counts.correct_count
FROM (
  SELECT
    quiz_attempt_id,
    COUNT(*) FILTER (
      WHERE question_id NOT IN (
        SELECT question_id
        FROM quiz_responses qr2
        WHERE qr2.quiz_attempt_id = quiz_responses.quiz_attempt_id
          AND qr2.is_correct = false
      )
    ) AS correct_count
  FROM (
    SELECT DISTINCT quiz_attempt_id, question_id
    FROM quiz_responses
  ) quiz_responses
  -- Use a lateral join approach instead
  GROUP BY quiz_attempt_id
) correct_counts
WHERE qa.id = correct_counts.quiz_attempt_id
  AND qa.score != correct_counts.correct_count;
```

This recalculates each attempt's score by counting questions where no response is marked incorrect -- the same logic used by the review UI and the updated scoring function. It only updates rows where the score has actually changed.

After running this, the dashboard (50%), export (50%), and review screen (25%) will all show the same corrected value (25% for Billy's Anti-Harassment quiz).

