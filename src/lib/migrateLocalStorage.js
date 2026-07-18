import { supabase, isSupabaseConfigured } from './supabaseClient.js'

const STORAGE_PREFIX = 'oams:'
const MIGRATION_FLAG = 'oams:migratedToSupabase'

function readLegacy(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

async function insertIfAny(table, rows) {
  if (!rows || rows.length === 0) return
  const { error } = await supabase.from(table).insert(rows)
  if (error) throw new Error(`Migrating "${table}" failed: ${error.message}`)
}

/**
 * Copies every existing Local Storage record into Supabase exactly once.
 * Safe to call on every app boot — it no-ops immediately unless there is
 * real migration work left to do.
 *
 * Returns { migrated: boolean, reason?: string, error?: Error }
 */
export async function migrateLocalStorageToSupabase() {
  if (!isSupabaseConfigured) {
    return { migrated: false, reason: 'not-configured' }
  }

  if (window.localStorage.getItem(MIGRATION_FLAG) === 'true') {
    return { migrated: false, reason: 'already-done' }
  }

  // Never overwrite remote data. If Supabase's expenses table already has
  // rows, Supabase is already the source of truth — just mark migration
  // done and move on (this also covers a second browser/device opening the
  // app for the first time after another device already migrated).
  const { count, error: countError } = await supabase
    .from('expenses')
    .select('id', { count: 'exact', head: true })

  if (countError) {
    return { migrated: false, reason: 'error', error: countError }
  }

  if ((count || 0) > 0) {
    window.localStorage.setItem(MIGRATION_FLAG, 'true')
    return { migrated: false, reason: 'remote-already-has-data' }
  }

  const legacyExpenses = readLegacy('expenses', [])
  const legacyApprovals = readLegacy('approvalRequests', [])
  const legacyInventory = readLegacy('inventoryItems', [])
  const legacyStaff = readLegacy('staff', [])
  const legacyTasks = readLegacy('tasks', [])
  const legacyNotifications = readLegacy('notifications', [])
  const legacyActivity = readLegacy('activityLog', [])
  const legacyCatalogue = readLegacy('itemCatalogue', [])
  const legacyCompany = readLegacy('companySettings', null)
  const legacySystem = readLegacy('systemSettings', null)

  const nothingToMigrate =
    legacyExpenses.length === 0 &&
    legacyApprovals.length === 0 &&
    legacyInventory.length === 0 &&
    legacyStaff.length === 0 &&
    legacyTasks.length === 0 &&
    legacyNotifications.length === 0 &&
    legacyActivity.length === 0 &&
    legacyCatalogue.length === 0 &&
    !legacyCompany &&
    !legacySystem

  if (nothingToMigrate) {
    window.localStorage.setItem(MIGRATION_FLAG, 'true')
    return { migrated: false, reason: 'nothing-to-migrate' }
  }

  // Old client-generated ids (e.g. "exp-1720000000-123") are not valid
  // UUIDs, so every row gets a fresh UUID here. Foreign keys are rewritten
  // through these maps as we go, in dependency order.
  const expenseIdMap = new Map()

  try {
    if (legacyExpenses.length) {
      const rows = legacyExpenses.map((e) => {
        const newId = crypto.randomUUID()
        expenseIdMap.set(e.id, newId)
        const { id, ...rest } = e
        return { id: newId, ...rest }
      })
      await insertIfAny('expenses', rows)
    }

    if (legacyApprovals.length) {
      const rows = legacyApprovals.map((a) => {
        const { id, expense_id, ...rest } = a
        return {
          id: crypto.randomUUID(),
          expense_id: expenseIdMap.get(expense_id) || expense_id,
          ...rest
        }
      })
      await insertIfAny('expense_approvals', rows)
    }

    if (legacyInventory.length) {
      for (const item of legacyInventory) {
        const newItemId = crypto.randomUUID()
        const { id, stock_history, ...rest } = item
        await insertIfAny('inventory_items', [{ id: newItemId, code: item.code || item.id, ...rest }])

        if (stock_history && stock_history.length) {
          const historyRows = stock_history.map((h) => {
            const { id: historyId, date, ...hRest } = h
            return { id: crypto.randomUUID(), item_id: newItemId, occurred_at: date, ...hRest }
          })
          await insertIfAny('inventory_stock_history', historyRows)
        }
      }
    }

    if (legacyStaff.length) {
      const rows = legacyStaff.map((s) => {
        const { id, ...rest } = s
        return { id: crypto.randomUUID(), code: s.code || s.id, ...rest }
      })
      await insertIfAny('staff', rows)
    }

    if (legacyTasks.length) {
      const rows = legacyTasks.map(({ id, ...rest }) => ({ id: crypto.randomUUID(), ...rest }))
      await insertIfAny('tasks', rows)
    }

    if (legacyNotifications.length) {
      const rows = legacyNotifications.map(({ id, ...rest }) => ({ id: crypto.randomUUID(), ...rest }))
      await insertIfAny('notifications', rows)
    }

    if (legacyActivity.length) {
      const rows = legacyActivity.map(({ id, ...rest }) => ({ id: crypto.randomUUID(), ...rest }))
      await insertIfAny('activity_logs', rows)
    }

    if (legacyCatalogue.length) {
      const rows = legacyCatalogue.map(({ id, ...rest }) => ({ id: crypto.randomUUID(), ...rest }))
      await insertIfAny('item_catalogue', rows)
    }

    if (legacyCompany) {
      const { id, ...rest } = legacyCompany
      await insertIfAny('company_settings', [rest])
    }

    if (legacySystem) {
      const { id, ...rest } = legacySystem
      await insertIfAny('system_settings', [rest])
    }

    window.localStorage.setItem(MIGRATION_FLAG, 'true')
    return { migrated: true }
  } catch (error) {
    // Deliberately do NOT set the flag — a failed/partial migration should
    // be retried on the next load rather than silently accepted as done.
    return { migrated: false, reason: 'error', error }
  }
}
