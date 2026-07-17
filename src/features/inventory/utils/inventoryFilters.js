export const DEFAULT_INVENTORY_FILTERS = {
  search: '',
  category: 'all',
  type: 'all',
  status: 'all'
}

export function nextInventoryId(items) {
  const nums = items
    .map((it) => parseInt(String(it.id).replace('INV-', ''), 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 2000
  return `INV-${max + 1}`
}

// Assets carry a manually-set status. Consumables never do — their
// availability is simply derived from whether any quantity remains.
export function displayStatus(item) {
  if (item.type === 'asset') return item.status || 'available'
  return item.quantity > 0 ? 'in_stock' : 'out_of_stock'
}

export function applyInventoryFilters(items, filters) {
  const { search, category, type, status } = filters
  const term = search.trim().toLowerCase()

  return items.filter((it) => {
    if (category !== 'all' && it.category !== category) return false
    if (type !== 'all' && it.type !== type) return false
    if (status !== 'all' && displayStatus(it) !== status) return false

    if (term) {
      const haystack = `${it.id} ${it.name} ${it.category} ${it.brand || ''} ${it.model || ''} ${it.location}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }

    return true
  })
}

export function sortInventory(items, sortBy, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1
  return [...items].sort((a, b) => {
    if (sortBy === 'quantity') return (a.quantity - b.quantity) * dir
    if (sortBy === 'name') return a.name.localeCompare(b.name) * dir
    // default: created_at
    return (a.created_at < b.created_at ? -1 : a.created_at > b.created_at ? 1 : 0) * dir
  })
}

export function paginate(items, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  return {
    pageItems: items.slice(start, start + pageSize),
    totalPages,
    safePage,
    totalItems: items.length
  }
}
