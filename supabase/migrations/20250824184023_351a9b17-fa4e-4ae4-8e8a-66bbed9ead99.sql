-- Add John Doe to the employees table so he shows up in the employee management section
INSERT INTO employees (email, full_name) 
VALUES ('john.doe@southsoundseniors.org', 'John Doe')
ON CONFLICT (email) DO NOTHING;