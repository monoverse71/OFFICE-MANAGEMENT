export const DEFAULT_STAFF_FILTERS = {
  search: '',
  department: 'all',
  status: 'all'
}

export const employmentStatuses = [
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On Leave' },
  { value: 'resigned', label: 'Resigned' }
]

export function nextEmployeeId(staffList) {
  const nums = staffList
    .map((s) => parseInt(String(s.id).replace('EMP-', ''), 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 1000
  return `EMP-${max + 1}`
}

export function departmentOptions(staffList) {
  const set = new Set(staffList.map((s) => s.department).filter(Boolean))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
}

export function applyStaffFilters(staffList, filters) {
  const { search, department, status } = filters
  const term = search.trim().toLowerCase()

  return staffList.filter((s) => {
    if (department !== 'all' && s.department !== department) return false
    if (status !== 'all' && s.employment_status !== status) return false

    if (term) {
      const haystack = `${s.id} ${s.full_name} ${s.mobile_number} ${s.email || ''} ${s.department} ${s.designation}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }

    return true
  })
}
