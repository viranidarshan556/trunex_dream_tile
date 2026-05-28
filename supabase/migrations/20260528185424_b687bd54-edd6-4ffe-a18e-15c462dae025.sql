
CREATE OR REPLACE FUNCTION public.set_lead_priority()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.sqft >= 1500 THEN NEW.priority := 'hot';
  ELSIF NEW.sqft >= 600 THEN NEW.priority := 'warm';
  ELSE NEW.priority := 'cold';
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_lead_priority() FROM PUBLIC, anon, authenticated;
