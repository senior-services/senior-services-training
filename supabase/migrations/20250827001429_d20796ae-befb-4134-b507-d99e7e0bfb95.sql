-- Test the admin creation process with a test email
-- First, let's check what emails are considered admin emails in the function
DO $$
DECLARE
    test_email TEXT := 'test.admin@test.com';
    admin_emails TEXT[] := ARRAY[
        'admin@gmail.com',
        'admin@seniorservices.com', 
        'manager@seniorservices.com'
    ];
BEGIN
    -- Check if our current admin detection logic is working
    IF test_email = ANY(admin_emails) THEN
        RAISE NOTICE 'test.admin@test.com would be assigned admin role';
    ELSE
        RAISE NOTICE 'test.admin@test.com would be assigned employee role';
    END IF;
    
    -- Check if jeri.vibe.test@gmail.com would be admin (it should not be based on the hardcoded list)
    IF 'jeri.vibe.test@gmail.com' = ANY(admin_emails) THEN
        RAISE NOTICE 'jeri.vibe.test@gmail.com is in hardcoded admin list';
    ELSE
        RAISE NOTICE 'jeri.vibe.test@gmail.com is NOT in hardcoded admin list - they become admin via pending_admins system';
    END IF;
END $$;