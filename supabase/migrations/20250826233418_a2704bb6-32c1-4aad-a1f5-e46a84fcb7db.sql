-- Create pending_admins table for pre-approved admin emails
CREATE TABLE public.pending_admins (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pending_admins
ALTER TABLE public.pending_admins ENABLE ROW LEVEL SECURITY;

-- Create policies for pending_admins
CREATE POLICY "Admins can manage pending admins" 
ON public.pending_admins 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_pending_admins_updated_at
BEFORE UPDATE ON public.pending_admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();