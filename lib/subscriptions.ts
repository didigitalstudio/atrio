import { createClient } from '@/lib/supabase/server';

export async function getInmoFeatures(): Promise<Record<string, boolean>> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('get_inmo_features');
  return (data as Record<string, boolean>) ?? {};
}
