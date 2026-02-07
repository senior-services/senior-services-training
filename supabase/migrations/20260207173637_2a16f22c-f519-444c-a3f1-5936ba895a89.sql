
-- Delete video progress for jbowers
DELETE FROM public.video_progress
WHERE employee_id IN (SELECT id FROM public.employees WHERE lower(email) = 'jbowers@southsoundseniors.org');

-- Delete video assignments for jbowers
DELETE FROM public.video_assignments
WHERE employee_id IN (SELECT id FROM public.employees WHERE lower(email) = 'jbowers@southsoundseniors.org');

-- Delete quiz responses tied to this employee's quiz attempts
DELETE FROM public.quiz_responses
WHERE quiz_attempt_id IN (
  SELECT qa.id FROM public.quiz_attempts qa
  JOIN public.employees e ON qa.employee_id = e.id
  WHERE lower(e.email) = 'jbowers@southsoundseniors.org'
);

-- Delete quiz attempts for jbowers
DELETE FROM public.quiz_attempts
WHERE employee_id IN (SELECT id FROM public.employees WHERE lower(email) = 'jbowers@southsoundseniors.org');

-- Delete the employee record
DELETE FROM public.employees WHERE lower(email) = 'jbowers@southsoundseniors.org';
