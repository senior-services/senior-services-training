-- Update the check constraint on quiz_questions table to include 'single_answer' question type
ALTER TABLE quiz_questions 
DROP CONSTRAINT IF EXISTS quiz_questions_question_type_check;

ALTER TABLE quiz_questions 
ADD CONSTRAINT quiz_questions_question_type_check 
CHECK (question_type IN ('multiple_choice', 'true_false', 'single_answer'));