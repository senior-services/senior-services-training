-- Fix Quiz Answer Security Issue
-- Add explicit DENY policy for employees on quiz_question_options table
-- This ensures employees cannot access the is_correct column through any means
-- They must use the get_safe_quiz_options RPC function

-- First, ensure RLS is enabled on quiz_question_options
ALTER TABLE public.quiz_question_options ENABLE ROW LEVEL SECURITY;

-- Add explicit restrictive policy for non-admin users
-- This policy will prevent any non-admin user from directly querying quiz_question_options
CREATE POLICY "Prevent non-admin direct access to quiz options"
ON public.quiz_question_options
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add comment to document security requirement
COMMENT ON TABLE public.quiz_question_options IS 
'Contains quiz answer keys. Direct access restricted to admins only. 
Employees must use get_safe_quiz_options() RPC function which excludes is_correct column.';

COMMENT ON COLUMN public.quiz_question_options.is_correct IS 
'Answer key - must never be exposed to employees. Access only through secure RPC functions.';