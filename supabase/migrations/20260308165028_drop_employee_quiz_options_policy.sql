-- Drop the overly permissive employee SELECT policy on quiz_question_options.
-- Employees should only access quiz options via the get_safe_quiz_options() RPC,
-- which excludes the is_correct column (answer key).

DROP POLICY IF EXISTS "Employees can view quiz question options" ON public.quiz_question_options;
