export const DEFAULT_APPROVAL_FILTERS = {
  search: '',
  status: 'pending_approval', // 'pending_approval' | 'approved' | 'rejected' | 'all'
  dateFrom: '',
  dateTo: ''
}

// Joins each approval request with its expense record — the request
// itself only stores workflow metadata, never a copy of expense data.
export function enrichRequests(requests, expenses) {
  const byId = new Map(expenses.map((e) => [e.id, e]))
  return requests.map((r) => ({
    ...r,
    expense: byId.get(r.expense_id) || null
  }))
}

export function applyApprovalFilters(enriched, filters) {
  const { search, status, dateFrom, dateTo } = filters
  const term = search.trim().toLowerCase()

  return enriched.filter((r) => {
    if (status !== 'all' && r.status !== status) return false

    if (term) {
      const haystack = `${r.expense_id} ${r.expense?.title || ''} ${r.requested_by}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }

    const requestDate = r.requested_at.slice(0, 10)
    if (dateFrom && requestDate < dateFrom) return false
    if (dateTo && requestDate > dateTo) return false

    return true
  })
}

export function sortByRequestedDate(enriched) {
  return [...enriched].sort((a, b) => (a.requested_at < b.requested_at ? 1 : -1))
}
