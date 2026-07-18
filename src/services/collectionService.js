import { supabase } from '../lib/supabaseClient.js'

/**
 * Thin, table-agnostic data access layer. Every collection in the app
 * (expenses, staff, inventory, ...) is read and written through these same
 * four functions — no component ever imports supabase-js directly, and no
 * query is ever written twice.
 */

export async function listRows(table, { orderBy = 'created_at', ascending = false } = {}) {
  const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending })
  if (error) throw error
  return data || []
}

export async function insertRows(table, rows) {
  if (!rows.length) return []
  const { data, error } = await supabase.from(table).insert(rows).select()
  if (error) throw error
  return data || []
}

export async function updateRow(table, id, patch) {
  const { data, error } = await supabase.from(table).update(patch).eq('id', id).select()
  if (error) throw error
  return data?.[0] || null
}

export async function deleteRows(table, ids) {
  if (!ids.length) return
  const { error } = await supabase.from(table).delete().in('id', ids)
  if (error) throw error
}

export function subscribeToTable(table, onChange) {
  const channel = supabase
    .channel(`realtime:${table}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
