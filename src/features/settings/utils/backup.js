import { APP_VERSION } from '../../../data/appMeta.js'

const ARRAY_KEYS = [
  'expenses',
  'approvalRequests',
  'inventoryItems',
  'staff',
  'tasks',
  'notifications',
  'itemCatalogue'
]

const OBJECT_KEYS = ['companySettings', 'systemSettings']

export function buildBackupPayload(state) {
  return {
    meta: {
      exportedAt: new Date().toISOString(),
      appVersion: APP_VERSION
    },
    data: {
      expenses: state.expenses,
      approvalRequests: state.approvalRequests,
      inventoryItems: state.inventoryItems,
      staff: state.staff,
      tasks: state.tasks,
      notifications: state.notifications,
      companySettings: state.companySettings,
      systemSettings: state.systemSettings,
      itemCatalogue: state.itemCatalogue
    }
  }
}

export function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Validates the shape of an imported backup file before any state is
 * touched. Returns { ok: true, data } or { ok: false, message }.
 */
export function validateBackupPayload(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, message: 'This file is not a valid backup (not a JSON object).' }
  }
  const data = parsed.data
  if (!data || typeof data !== 'object') {
    return { ok: false, message: 'This file is missing its "data" section — it doesn\u2019t look like a backup from this system.' }
  }

  for (const key of ARRAY_KEYS) {
    if (!Array.isArray(data[key])) {
      return { ok: false, message: `Backup file is missing or has an invalid "${key}" section.` }
    }
  }
  for (const key of OBJECT_KEYS) {
    if (!data[key] || typeof data[key] !== 'object' || Array.isArray(data[key])) {
      return { ok: false, message: `Backup file is missing or has an invalid "${key}" section.` }
    }
  }

  return { ok: true, data }
}

export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
