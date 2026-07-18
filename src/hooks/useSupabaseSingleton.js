import { useCallback, useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { getOrCreateSingleton, saveSingleton, subscribeToSingleton } from '../services/settingsService.js'

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
    // Ignore — the app keeps working in-memory even if the cache write fails.
  }
}

export function useSupabaseSingleton(table, defaults) {
  const [value, setValueState] = useState(() => readCache(table, defaults))
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'local-only')
  const rowIdRef = useRef(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('local-only')
      return
    }
    let cancelled = false

    getOrCreateSingleton(table, defaults)
      .then((row) => {
        if (cancelled) return
        rowIdRef.current = row.id
        setValueState(row)
        writeCache(table, row)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('offline')
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    const unsubscribe = subscribeToSingleton(table, (payload) => {
      if (payload.eventType === 'DELETE') return
      rowIdRef.current = payload.new.id
      setValueState(payload.new)
      writeCache(table, payload.new)
    })
    return unsubscribe
  }, [table])

  const setValue = useCallback(
    (updater) => {
      setValueState((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater

        if (isSupabaseConfigured && rowIdRef.current) {
          saveSingleton(table, rowIdRef.current, next).catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`[supabase] saving "${table}" failed`, err)
          })
        }

        writeCache(table, next)
        return next
      })
    },
    [table]
  )

  return [value, setValue, status]
}
