import { supabase } from '../lib/supabaseClient.js'

/**
 * Company Settings and System Settings are each a single row. This reads
 * the first (and only) row, creating it from the given defaults if the
 * table is empty yet, and upserts on save.
 */
export async function getOrCreateSingleton(table, defaults) {
  const { data, error } = await supabase.from(table).select('*').limit(1)
  if (error) throw error

  if (data && data.length > 0) return data[0]

  const { data: created, error: insertError } = await supabase
    .from(table)
    .insert([defaults])
    .select()
  if (insertError) throw insertError
  return created[0]
}

export async function saveSingleton(table, id, patch) {
  const { data, error } = await supabase.from(table).update(patch).eq('id', id).select()
  if (error) throw error
  return data?.[0] || null
}

export function subscribeToSingleton(table, onChange) {
  const channel = supabase
    .channel(`realtime:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
