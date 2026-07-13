export const DEFAULT_FILTERS = {
  search: '',
  category: 'all',
  status: 'all',
  paymentMethod: 'all',
  dateFrom: '',
  dateTo: ''
}

const STATUS_RANK = {
  draft: 0,
  pending_approval: 1,
  approved: 2,
  rejected: 3,
  paid: 4,
  archived: 5
}

export function applyExpenseFilters(expenses, filters) {
  const { search, category, status, paymentMethod, dateFrom, dateTo } = filters
  const term = search.trim().toLowerCase()

  return expenses.filter((e) => {
    if (term) {
      const haystack = `${e.title} ${e.category} ${e.id}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    if (category !== 'all' && e.category !== category) return false
    if (status !== 'all' && e.status !== status) return false
    if (paymentMethod !== 'all' && e.payment_method !== paymentMethod) return false
    if (dateFrom && e.expense_date < dateFrom) return false
    if (dateTo && e.expense_date > dateTo) return false
    return true
  })
}

export function sortExpenses(expenses, sortBy, sortDir) {
  const dir = sortDir === 'asc' ? 1 : -1
  return [...expenses].sort((a, b) => {
    if (sortBy === 'amount') return (a.amount - b.amount) * dir
    if (sortBy === 'status') return (STATUS_RANK[a.status] - STATUS_RANK[b.status]) * dir
    // default: expense_date
    return (a.expense_date < b.expense_date ? -1 : a.expense_date > b.expense_date ? 1 : 0) * dir
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
