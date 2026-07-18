import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { listRows, insertRows, updateRow, deleteRows, subscribeToTable } from '../services/collectionService.js'

const STORAGE_PREFIX = 'oams:'

function readCache(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeCache(key, value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage can fail (quota, private mode) — the app keeps working
    // in-memory even if the offline cache silently fails to write.
  }
}

function mergeRealtimeChange(prev, payload) {
  if (payload.eventType === 'DELETE') {
    return prev.filter((row) => row.id !== payload.old.id)
  }
  const incoming = payload.new
  const exists = prev.some((row) => row.id === incoming.id)
  if (exists) {
    return prev.map((row) => (row.id === incoming.id ? incoming : row))
  }
  return [incoming, ...prev]
}

/**
 * table:    the Supabase table name (also doubles as the local cache key)
 * seedData: used only when Supabase isn't configured and there's no cache yet
 *
 * Returns [data, setData, status] where status is one of
 * 'loading' | 'ready' | 'offline' | 'local-only'.
 */
export function useSupabaseCollection(table, seedData, options = {}) {
  const [data, setDataState] = useState(() => readCache(table, seedData))
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'local-only')
  const cacheRef = useRef(data)
  cacheRef.current = data

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('local-only')
      return
    }
    let cancelled = false

    listRows(table, options)
      .then((rows) => {
        if (cancelled) return
        setDataState(rows)
        writeCache(table, rows)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        // Supabase unreachable — keep showing the last known local copy
        // instead of an empty screen, and tell the caller we're offline.
        setDataState(cacheRef.current)
        setStatus('offline')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    const unsubscribe = subscribeToTable(table, (payload) => {
      setDataState((prev) => {
        const next = mergeRealtimeChange(prev, payload)
        writeCache(table, next)
        return next
      })
    })
    return unsubscribe
  }, [table])

  const setData = useCallback(
    (updater) => {
      setDataState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater

        if (!isSupabaseConfigured) {
          writeCache(table, next)
          return next
        }

        // Diff by id so every existing handler — which already writes
        // immutable inserts/updates/deletes into this array — translates
        // automatically into the right Supabase calls with no changes to
        // any handler itself.
        const prevById = new Map(prev.map((r) => [r.id, r]))
        const nextById = new Map(next.map((r) => [r.id, r]))

        const toInsert = []
        const toUpdate = []
        for (const [id, row] of nextById) {
          const prevRow = prevById.get(id)
          if (!prevRow) toInsert.push(row)
          else if (JSON.stringify(prevRow) !== JSON.stringify(row)) toUpdate.push(row)
        }
        const toDeleteIds = [...prevById.keys()].filter((id) => !nextById.has(id))

        if (toInsert.length) {
          insertRows(table, toInsert).catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`[supabase] insert into "${table}" failed`, err)
          })
        }
        for (const row of toUpdate) {
          updateRow(table, row.id, row).catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`[supabase] update on "${table}" failed`, err)
          })
        }
        if (toDeleteIds.length) {
          deleteRows(table, toDeleteIds).catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`[supabase] delete on "${table}" failed`, err)
          })
        }

        writeCache(table, next)
        return next
      })
    },
    [table]
  )

  return [data, setData, status]
}
