-- Create employees table for managing individual employees and generic assignments
CREATE TABLE public.employees (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    domain TEXT,
    is_generic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create video assignments table to track which videos are assigned to employees
CREATE TABLE public.video_assignments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    assigned_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(video_id, employee_id)
);

-- Enable Row Level Security
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Admins can manage all employees" 
ON public.employees 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees can view their own record" 
ON public.employees 
FOR SELECT 
USING (auth.jwt()->>'email' = email);

-- RLS Policies for video_assignments table
CREATE POLICY "Admins can manage all video assignments" 
ON public.video_assignments 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Employees can view their assignments" 
ON public.video_assignments 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.employees e 
        WHERE e.id = employee_id 
        AND e.email = auth.jwt()->>'email'
    )
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_video_assignments_updated_at
    BEFORE UPDATE ON public.video_assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to extract domain from email
CREATE OR REPLACE FUNCTION public.extract_domain_from_email(email_address TEXT)
RETURNS TEXT
LANGUAGE SQL
IMMUTABLE
AS $$
    SELECT split_part(email_address, '@', 2);
$$;

-- Create function to automatically set domain when inserting/updating employees
CREATE OR REPLACE FUNCTION public.set_employee_domain()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.email IS NOT NULL THEN
        NEW.domain = public.extract_domain_from_email(NEW.email);
    END IF;
    RETURN NEW;
END;
$$;

-- Create trigger to automatically set domain
CREATE TRIGGER set_employee_domain_trigger
    BEFORE INSERT OR UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION public.set_employee_domain();

-- Insert a generic employee record for white-label assignments
INSERT INTO public.employees (email, full_name, is_generic, domain)
VALUES (NULL, 'All Domain Users', true, 'generic');

-- Create view for employee video assignments with video details
CREATE OR REPLACE VIEW public.employee_assignments_with_videos AS
SELECT 
    va.id as assignment_id,
    va.employee_id,
    va.video_id,
    va.assigned_by,
    va.created_at as assigned_at,
    e.email as employee_email,
    e.full_name as employee_name,
    e.domain as employee_domain,
    e.is_generic as is_generic_assignment,
    v.title as video_title,
    v.description as video_description,
    v.video_url,
    v.thumbnail_url,
    v.type as video_type
FROM public.video_assignments va
JOIN public.employees e ON va.employee_id = e.id
JOIN public.videos v ON va.video_id = v.id;