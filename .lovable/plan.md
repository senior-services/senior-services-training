

## Update Training Card Badges on Employee Dashboard

### What's Changing

Redesigning the badge/metadata row above training card titles to show richer information -- due dates with hover tooltips, quiz question counts for required courses, and quiz scores for completed courses.

### New Design

**Required Courses** (above title):
- `[Due in 10 days]` `[chat-icon 5 questions]` -- two badges side by side
- Due date badge: hover shows "Due February 19, 2026" (prefixed with "Due")
- Quiz badge: only shown if the video has a quiz; shows question count with MessageSquare icon

**Completed Courses** (above title):
- `[Completed Aug 27]` `[chat-icon 100%]` -- two badges side by side
- Completion date badge: hover shows "Completed August 27, 2025" (prefixed with "Completed")
- Quiz badge: only shown if quiz was taken; hover shows "Quiz score: 100% (5/5 correct)"
- Remove the existing quiz results line that currently sits below the description

### Technical Details

**1. Extend TrainingVideo interface** (`src/components/TrainingCard.tsx`)
- Add `quizQuestionCount?: number` to pass question count for required courses

**2. Fetch quiz question counts** (`src/pages/EmployeeDashboard.tsx`)
- Extend the existing quizzes query to also fetch question counts via a join: `select("video_id, created_at, quiz_questions(count)")`
- Change `videoIdsWithQuizzes` from `Map<string, string>` to `Map<string, { createdAt: string, questionCount: number }>`
- Pass `quizQuestionCount` through `transformToTrainingVideo`

**3. Update TrainingCard badge rendering** (`src/components/TrainingCard.tsx`)
- Wrap due date badges in `Tooltip` with content: "Due [full date with year]" (e.g., "Due February 19, 2026")
- Wrap completion date text in `Tooltip` with content: "Completed [full date with year]" (e.g., "Completed August 27, 2025")
- Add quiz info badge next to date badges:
  - Required: `[MessageSquare icon] N questions` (soft-tertiary variant)
  - Completed: `[MessageSquare icon] N%` with tooltip showing "Quiz score: N% (X/Y correct)"
- Remove existing quiz results section below description
- Import Tooltip components from UI library

### Review

- **Top 5 Risks**: (1) Quiz question count query adds minor DB overhead -- mitigated by combining with existing query. (2) Touch devices may not trigger hover tooltips -- acceptable as supplementary info. (3) Changing videoIdsWithQuizzes type requires updating all references. (4) No risk to quiz grading or progress logic. (5) Minimal complexity.
- **Top 5 Fixes**: (1) Add "Due ..." tooltips to date badges. (2) Add "Completed ..." tooltips to completion dates. (3) Add quiz question/score badges. (4) Remove old quiz results display. (5) Fetch question counts from DB.
- **Database Change Required**: No
- **Go/No-Go**: Go

