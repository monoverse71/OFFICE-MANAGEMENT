import { useCallback, useEffect, useState } from 'react'
import { isSupabaseConfigured } from '../lib/supabaseClient.js'
import { listRows, insertRows, updateRow, deleteRows, subscribeToTable } from '../services/collectionService.js'

const STORAGE_PREFIX = 'oams:'
const CACHE_KEY = 'inventoryItems'

function readCache(fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + CACHE_KEY)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeCache(value) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + CACHE_KEY, JSON.stringify(value))
  } catch {
    // Ignore — in-memory state still works even if the cache write fails.
  }
}

function stitch(itemRows, historyRows) {
  const historyByItem = new Map()
  for (const h of historyRows) {
    const list = historyByItem.get(h.item_id) || []
    list.push({ ...h, date: h.occurred_at })
    historyByItem.set(h.item_id, list)
  }
  return itemRows.map((item) => ({ ...item, stock_history: historyByItem.get(item.id) || [] }))
}

async function persistInventoryDiff(prev, next) {
  const prevById = new Map(prev.map((r) => [r.id, r]))
  const nextById = new Map(next.map((r) => [r.id, r]))

  const toInsertItems = []
  const toUpdateItems = []
  for (const [id, item] of nextById) {
    const { stock_history, ...itemFields } = item
    const prevItem = prevById.get(id)
    if (!prevItem) {
      toInsertItems.push(itemFields)
    } else {
      const { stock_history: prevHistory, ...prevFields } = prevItem
      if (JSON.stringify(prevFields) !== JSON.stringify(itemFields)) {
        toUpdateItems.push(itemFields)
      }
    }
  }
  const toDeleteIds = [...prevById.keys()].filter((id) => !nextById.has(id))

  if (toInsertItems.length) {
    await insertRows('inventory_items', toInsertItems).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[supabase] insert into "inventory_items" failed', err)
    })
  }
  for (const item of toUpdateItems) {
    updateRow('inventory_items', item.id, item).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[supabase] update on "inventory_items" failed', err)
    })
  }
  if (toDeleteIds.length) {
    deleteRows('inventory_items', toDeleteIds).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[supabase] delete on "inventory_items" failed', err)
    })
  }

  // New stock-history entries: any entry in next not present (by id) in prev.
  const newHistoryRows = []
  for (const [id, item] of nextById) {
    const prevItem = prevById.get(id)
    const prevHistoryIds = new Set((prevItem?.stock_history || []).map((h) => h.id))
    for (const h of item.stock_history || []) {
      if (!prevHistoryIds.has(h.id)) {
        const { date, ...hRest } = h
        newHistoryRows.push({ ...hRest, item_id: id, occurred_at: date })
      }
    }
  }
  if (newHistoryRows.length) {
    await insertRows('inventory_stock_history', newHistoryRows).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[supabase] insert into "inventory_stock_history" failed', err)
    })
  }
}

export function useSupabaseInventory(seedItems) {
  const [items, setItemsState] = useState(() => readCache(seedItems))
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'local-only')

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setStatus('local-only')
      return undefined
    }
    let cancelled = false

    Promise.all([
      listRows('inventory_items', {}),
      listRows('inventory_stock_history', { orderBy: 'occurred_at', ascending: false })
    ])
      .then(([itemRows, historyRows]) => {
        if (cancelled) return
        const stitched = stitch(itemRows, historyRows)
        setItemsState(stitched)
        writeCache(stitched)
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('offline')
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Realtime: re-fetch-and-stitch on any change to either table. Simpler
  // and safer than trying to patch the embedded array event-by-event, and
  // inventory changes are infrequent enough that this is cheap.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    async function refresh() {
      try {
        const [itemRows, historyRows] = await Promise.all([
          listRows('inventory_items', {}),
          listRows('inventory_stock_history', { orderBy: 'occurred_at', ascending: false })
        ])
        const stitched = stitch(itemRows, historyRows)
        setItemsState(stitched)
        writeCache(stitched)
      } catch {
        // Leave the current in-memory state as-is if a background refresh fails.
      }
    }

    const unsubItems = subscribeToTable('inventory_items', refresh)
    const unsubHistory = subscribeToTable('inventory_stock_history', refresh)
    return () => {
      unsubItems()
      unsubHistory()
    }
  }, [])

  const setItems = useCallback((updater) => {
    setItemsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (isSupabaseConfigured) {
        persistInventoryDiff(prev, next)
      }
      writeCache(next)
      return next
    })
  }, [])

  return [items, setItems, status]
}
