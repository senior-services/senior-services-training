-- Remove admin DELETE permissions on completion tables.
-- Replace FOR ALL policies with explicit SELECT, INSERT, UPDATE (no DELETE).

-- video_progress
DROP POLICY "Admins can manage all video progress" ON public.video_progress;

CREATE POLICY "Admins can view all video progress"
ON public.video_progress
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert video progress"
ON public.video_progress
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update video progress"
ON public.video_progress
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));


-- quiz_attempts
DROP POLICY "Admins can manage all quiz attempts" ON public.quiz_attempts;

CREATE POLICY "Admins can view all quiz attempts"
ON public.quiz_attempts
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quiz attempts"
ON public.quiz_attempts
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quiz attempts"
ON public.quiz_attempts
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));


-- quiz_responses
DROP POLICY "Admins can manage all quiz responses" ON public.quiz_responses;

CREATE POLICY "Admins can view all quiz responses"
ON public.quiz_responses
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert quiz responses"
ON public.quiz_responses
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update quiz responses"
ON public.quiz_responses
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
