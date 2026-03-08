-- Replace ON DELETE CASCADE with ON DELETE RESTRICT on completion/compliance tables
-- to prevent accidental deletion of training records when parent records are deleted.

-- video_progress: employee_id -> employees(id)
ALTER TABLE public.video_progress
  DROP CONSTRAINT video_progress_employee_id_fkey,
  ADD CONSTRAINT video_progress_employee_id_fkey
    FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;

-- video_progress: video_id -> videos(id)
ALTER TABLE public.video_progress
  DROP CONSTRAINT video_progress_video_id_fkey,
  ADD CONSTRAINT video_progress_video_id_fkey
    FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE RESTRICT;

-- quiz_attempts: employee_id -> employees(id)
ALTER TABLE public.quiz_attempts
  DROP CONSTRAINT fk_quiz_attempts_employee,
  ADD CONSTRAINT fk_quiz_attempts_employee
    FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON DELETE RESTRICT;

-- quiz_attempts: quiz_id -> quizzes(id)
ALTER TABLE public.quiz_attempts
  DROP CONSTRAINT fk_quiz_attempts_quiz,
  ADD CONSTRAINT fk_quiz_attempts_quiz
    FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE RESTRICT;

-- quiz_responses: quiz_attempt_id -> quiz_attempts(id)
ALTER TABLE public.quiz_responses
  DROP CONSTRAINT fk_quiz_responses_attempt,
  ADD CONSTRAINT fk_quiz_responses_attempt
    FOREIGN KEY (quiz_attempt_id) REFERENCES public.quiz_attempts(id) ON DELETE RESTRICT;

-- quiz_responses: question_id -> quiz_questions(id)
ALTER TABLE public.quiz_responses
  DROP CONSTRAINT fk_quiz_responses_question,
  ADD CONSTRAINT fk_quiz_responses_question
    FOREIGN KEY (question_id) REFERENCES public.quiz_questions(id) ON DELETE RESTRICT;

-- quiz_responses: selected_option_id -> quiz_question_options(id)
ALTER TABLE public.quiz_responses
  DROP CONSTRAINT fk_quiz_responses_option,
  ADD CONSTRAINT fk_quiz_responses_option
    FOREIGN KEY (selected_option_id) REFERENCES public.quiz_question_options(id) ON DELETE RESTRICT;
