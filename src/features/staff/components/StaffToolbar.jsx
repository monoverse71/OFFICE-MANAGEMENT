import { Search, Plus } from 'lucide-react'
import { employmentStatuses } from '../utils/staffFilters.js'

export default function StaffToolbar({ filters, onFilterChange, departments, onAddEmployee }) {
  function set(field, value) {
    onFilterChange({ ...filters, [field]: value })
  }

  const inputClass =
    'px-2.5 py-1.5 text-sm bg-paper-card border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card px-5 py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl leading-tight">Staff Directory</p>
          <p className="text-xs text-ink-muted font-body mt-0.5">Everyone on record across the office</p>
        </div>
        <button
          type="button"
          onClick={onAddEmployee}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-body uppercase tracking-wide rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors"
        >
          <Plus size={14} /> Add Employee
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search by ID, name, mobile, email, department or designation…"
            className={`w-full pl-8 ${inputClass}`}
          />
        </label>

        <select value={filters.department} onChange={(e) => set('department', e.target.value)} className={inputClass}>
          <option value="all">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select value={filters.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
          <option value="all">All statuses</option>
          {employmentStatuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
