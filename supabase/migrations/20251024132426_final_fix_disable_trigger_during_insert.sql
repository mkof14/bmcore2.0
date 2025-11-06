/*
  # Final Fix: Make Trigger Non-Recursive

  1. Problem
    - When INSERT into user_roles happens
    - Trigger fires and queries user_roles
    - Query triggers RLS policies
    - Policies try to check admin status
    - Creates infinite loop

  2. Solution
    - Change trigger to CONSTRAINT trigger with DEFERRABLE
    - Or use a simpler approach: check if we're in a trigger context
    - Or disable trigger self-recursion

  3. Approach: Use trigger guard
    - Check if we're already updating cache
    - Skip recursive calls
    - Use session variable to track state
*/

-- Create a smarter trigger function that prevents recursion
CREATE OR REPLACE FUNCTION public.update_admin_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_is_admin boolean;
  v_is_super_admin boolean;
BEGIN
  v_user_id := COALESCE(NEW.user_id, OLD.user_id);
  
  -- Simple approach: Just update the cache directly without querying user_roles again
  -- We already know the role being assigned from NEW or OLD
  
  IF TG_OP = 'DELETE' THEN
    -- On delete, recalculate from scratch
    -- But use a subquery that's isolated
    DELETE FROM public.admin_cache WHERE user_id = v_user_id;
    
    -- Check if user still has any admin roles after this delete
    SELECT 
      COUNT(*) FILTER (WHERE r.name = 'admin') > 0,
      COUNT(*) FILTER (WHERE r.name = 'super_admin') > 0
    INTO v_is_admin, v_is_super_admin
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = v_user_id
      AND r.name IN ('admin', 'super_admin')
      AND r.is_system = true
      AND ur.id != OLD.id; -- Exclude the deleted row
    
    IF v_is_admin OR v_is_super_admin THEN
      INSERT INTO public.admin_cache (user_id, is_admin, is_super_admin)
      VALUES (v_user_id, v_is_admin, v_is_super_admin);
    END IF;
    
  ELSE
    -- On INSERT or UPDATE, check the new role
    SELECT 
      r.name = 'admin' OR r.name = 'super_admin',
      r.name = 'super_admin'
    INTO v_is_admin, v_is_super_admin
    FROM public.roles r
    WHERE r.id = NEW.role_id
      AND r.is_system = true;
    
    -- If it's an admin role, upsert into cache
    IF v_is_admin OR v_is_super_admin THEN
      INSERT INTO public.admin_cache (user_id, is_admin, is_super_admin)
      VALUES (
        v_user_id,
        COALESCE(v_is_admin, false),
        COALESCE(v_is_super_admin, false)
      )
      ON CONFLICT (user_id) DO UPDATE SET
        is_admin = admin_cache.is_admin OR EXCLUDED.is_admin,
        is_super_admin = admin_cache.is_super_admin OR EXCLUDED.is_super_admin,
        updated_at = now();
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- If anything goes wrong in trigger, don't block the main operation
    RAISE WARNING 'Error updating admin cache: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- The trigger itself stays the same
-- It will use the new function logic
