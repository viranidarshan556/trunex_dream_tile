import { supabase } from "@/integrations/supabase/client";

export async function uploadRoomImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("room-uploads")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from("room-uploads").getPublicUrl(path);
  return data.publicUrl;
}
