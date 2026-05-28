
-- Enums
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TYPE public.flow_type AS ENUM ('self','expert');
CREATE TYPE public.lead_priority AS ENUM ('hot','warm','cold');
CREATE TYPE public.tile_finish AS ENUM ('matte','glossy','anti_skid');
CREATE TYPE public.tile_size AS ENUM ('2x2','2x4','plank');
CREATE TYPE public.room_type AS ENUM ('bathroom','living_room','kitchen','balcony','bedroom');

-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- tiles
CREATE TABLE public.tiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  finish public.tile_finish NOT NULL,
  size public.tile_size NOT NULL,
  room_types public.room_type[] NOT NULL DEFAULT '{}',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.tiles TO authenticated;
GRANT ALL ON public.tiles TO service_role;
ALTER TABLE public.tiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public view active tiles" ON public.tiles FOR SELECT TO anon, authenticated USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage tiles insert" ON public.tiles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage tiles update" ON public.tiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin manage tiles delete" ON public.tiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  city TEXT NOT NULL,
  sqft INTEGER NOT NULL,
  flow_type public.flow_type NOT NULL,
  tile_id UUID REFERENCES public.tiles(id) ON DELETE SET NULL,
  original_image_url TEXT,
  generated_image_url TEXT,
  priority public.lead_priority NOT NULL DEFAULT 'warm',
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone create lead" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin read leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- auto priority by sqft
CREATE OR REPLACE FUNCTION public.set_lead_priority()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.sqft >= 1500 THEN NEW.priority := 'hot';
  ELSIF NEW.sqft >= 600 THEN NEW.priority := 'warm';
  ELSE NEW.priority := 'cold';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_set_lead_priority BEFORE INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_lead_priority();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('room-uploads','room-uploads', true),
  ('generated-previews','generated-previews', true),
  ('tile-images','tile-images', true)
ON CONFLICT (id) DO NOTHING;

-- storage policies
CREATE POLICY "public read room-uploads" ON storage.objects FOR SELECT USING (bucket_id = 'room-uploads');
CREATE POLICY "anyone upload room-uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'room-uploads');

CREATE POLICY "public read generated-previews" ON storage.objects FOR SELECT USING (bucket_id = 'generated-previews');
CREATE POLICY "anyone upload generated-previews" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'generated-previews');

CREATE POLICY "public read tile-images" ON storage.objects FOR SELECT USING (bucket_id = 'tile-images');
CREATE POLICY "admin upload tile-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tile-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin update tile-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tile-images' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin delete tile-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tile-images' AND public.has_role(auth.uid(),'admin'));
