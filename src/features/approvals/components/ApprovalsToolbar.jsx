import { Search } from 'lucide-react'

const TABS = [
  { value: 'pending_approval', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'all', label: 'All' }
]

export default function ApprovalsToolbar({ filters, onFilterChange, counts }) {
  function set(field, value) {
    onFilterChange({ ...filters, [field]: value })
  }

  const inputClass =
    'px-2.5 py-1.5 text-sm bg-paper-card border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card px-5 py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl leading-tight">Approvals</p>
          <p className="text-xs text-ink-muted font-body mt-0.5">Requests waiting on Chairman / Vice Chairman / Super Admin sign-off</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => set('status', tab.value)}
              className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide rounded-sm border transition-colors ${
                filters.status === tab.value
                  ? 'bg-ink text-paper border-ink'
                  : 'border-hairline text-ink-muted hover:border-ink/40'
              }`}
            >
              {tab.label}
              {typeof counts[tab.value] === 'number' && (
                <span className="ml-1.5 opacity-70">{counts[tab.value]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search by expense ID, title or employee…"
            className={`w-full pl-8 ${inputClass}`}
          />
        </label>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
          className={inputClass}
          aria-label="Requested from date"
        />
        <span className="text-ink-muted text-xs">to</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
          className={inputClass}
          aria-label="Requested to date"
        />
      </div>
    </div>
  )
}
