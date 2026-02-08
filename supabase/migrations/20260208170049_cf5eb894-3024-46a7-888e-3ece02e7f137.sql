
CREATE OR REPLACE FUNCTION public.submit_quiz_attempt(p_employee_email text, p_quiz_id uuid, p_responses jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_employee_id UUID;
  v_quiz_attempt_id UUID;
  v_response JSONB;
  v_question_id UUID;
  v_selected_option_id UUID;
  v_text_answer TEXT;
  v_is_correct BOOLEAN;
  v_correct_count INTEGER := 0;
  v_total_questions INTEGER := 0;
BEGIN
  -- Get employee ID
  SELECT id INTO v_employee_id
  FROM employees
  WHERE lower(email) = lower(p_employee_email)
  LIMIT 1;
  
  IF v_employee_id IS NULL THEN
    RAISE EXCEPTION 'Employee not found with email: %', p_employee_email;
  END IF;
  
  -- Get total questions count
  SELECT COUNT(*) INTO v_total_questions
  FROM quiz_questions
  WHERE quiz_id = p_quiz_id;
  
  -- Create quiz attempt
  INSERT INTO quiz_attempts (employee_id, quiz_id, total_questions)
  VALUES (v_employee_id, p_quiz_id, v_total_questions)
  RETURNING id INTO v_quiz_attempt_id;
  
  -- Process each response and insert individually
  FOR v_response IN SELECT * FROM jsonb_array_elements(p_responses)
  LOOP
    v_question_id := (v_response->>'question_id')::UUID;
    v_selected_option_id := NULLIF(v_response->>'selected_option_id', '')::UUID;
    v_text_answer := v_response->>'text_answer';
    v_is_correct := false;
    
    -- Check if individual option is correct
    IF v_selected_option_id IS NOT NULL THEN
      SELECT is_correct INTO v_is_correct
      FROM quiz_question_options
      WHERE id = v_selected_option_id;
    ELSE
      v_is_correct := false;
    END IF;
    
    -- Insert response
    INSERT INTO quiz_responses (
      quiz_attempt_id, 
      question_id, 
      selected_option_id, 
      text_answer, 
      is_correct
    )
    VALUES (
      v_quiz_attempt_id, 
      v_question_id, 
      v_selected_option_id, 
      v_text_answer, 
      v_is_correct
    );
  END LOOP;
  
  -- Score per-question: a question is correct only if ALL its responses are correct
  SELECT COUNT(DISTINCT question_id) INTO v_correct_count
  FROM quiz_responses
  WHERE quiz_attempt_id = v_quiz_attempt_id
    AND question_id NOT IN (
      SELECT question_id FROM quiz_responses
      WHERE quiz_attempt_id = v_quiz_attempt_id AND is_correct = false
    );
  
  -- Update quiz attempt with score
  UPDATE quiz_attempts 
  SET score = v_correct_count
  WHERE id = v_quiz_attempt_id;
  
  -- Mark video as completed
  INSERT INTO video_progress (employee_id, video_id, progress_percent, completed_at)
  SELECT v_employee_id, q.video_id, 100, now()
  FROM quizzes q
  WHERE q.id = p_quiz_id
  ON CONFLICT (employee_id, video_id) 
  DO UPDATE SET 
    progress_percent = 100,
    completed_at = now(),
    updated_at = now();
  
  RETURN v_quiz_attempt_id;
END;
$function$;
