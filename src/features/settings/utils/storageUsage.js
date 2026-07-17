const STORAGE_PREFIX = 'oams:'

export function getStorageUsageBytes() {
  let total = 0
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const value = window.localStorage.getItem(key) || ''
        total += key.length + value.length
      }
    }
  } catch {
    return 0
  }
  return total
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
