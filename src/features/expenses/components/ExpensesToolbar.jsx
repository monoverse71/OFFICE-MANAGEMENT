import { Search, Plus, Download } from 'lucide-react'
import { expenseStatuses, paymentMethods } from '../../../data/dummyData.js'

export default function ExpensesToolbar({ filters, onFilterChange, categories, onAddExpense }) {
  function set(field, value) {
    onFilterChange({ ...filters, [field]: value })
  }

  const inputClass =
    'px-2.5 py-1.5 text-sm bg-paper-card border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card px-5 py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl leading-tight">Expenses</p>
          <p className="text-xs text-ink-muted font-body mt-0.5">Search, filter and manage every expense on record</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title="Export will be available once reporting is wired up"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-body uppercase tracking-wide rounded-sm border border-hairline text-ink-muted cursor-not-allowed opacity-60"
          >
            <Download size={14} /> Export
          </button>
          <button
            type="button"
            onClick={onAddExpense}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-body uppercase tracking-wide rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors"
          >
            <Plus size={14} /> Add Expense
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search by title, category or expense ID…"
            className={`w-full pl-8 ${inputClass}`}
          />
        </label>

        <select value={filters.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select value={filters.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
          <option value="all">All statuses</option>
          {Object.values(expenseStatuses).map((s) => (
            <option key={s.code} value={s.code}>{s.label}</option>
          ))}
        </select>

        <select value={filters.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={inputClass}>
          <option value="all">All payment methods</option>
          {paymentMethods.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
          className={inputClass}
          aria-label="From date"
        />
        <span className="text-ink-muted text-xs">to</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
          className={inputClass}
          aria-label="To date"
        />
      </div>
    </div>
  )
}
