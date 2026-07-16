import { useEffect, useState } from 'react'

const STORAGE_PREFIX = 'oams:'

function readFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    // Corrupted value or storage unavailable — fall back to the seed value
    // rather than crashing the app.
    return fallback
  }
}

/**
 * Same call signature as React.useState: [value, setValue].
 * The only difference is the value survives a browser refresh.
 *
 * This is intentionally storage-agnostic in spirit — everything the app
 * reads/writes goes through this one hook, so swapping the implementation
 * for a Supabase-backed version later (same signature, network calls
 * instead of localStorage) won't require touching any component that
 * calls it.
 */
export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => readFromStorage(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(state))
    } catch {
      // Storage can fail (quota exceeded, private browsing, etc.) — the
      // app keeps working in-memory even if persistence silently fails.
    }
  }, [key, state])

  return [state, setState]
}
