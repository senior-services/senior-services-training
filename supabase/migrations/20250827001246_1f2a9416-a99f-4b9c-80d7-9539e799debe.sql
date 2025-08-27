-- Manually fix jeri.vibe.test@gmail.com role
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get the user_id for jeri.vibe.test@gmail.com
    SELECT user_id INTO target_user_id
    FROM profiles 
    WHERE email = 'jeri.vibe.test@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Remove employee role
        DELETE FROM user_roles 
        WHERE user_id = target_user_id AND role = 'employee';
        
        -- Add admin role (with conflict handling)
        INSERT INTO user_roles (user_id, role)
        VALUES (target_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        -- Remove from pending_admins
        DELETE FROM pending_admins 
        WHERE email = 'jeri.vibe.test@gmail.com';
        
        RAISE NOTICE 'Successfully converted jeri.vibe.test@gmail.com to admin role';
    ELSE
        RAISE NOTICE 'User jeri.vibe.test@gmail.com not found';
    END IF;
END $$;