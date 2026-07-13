import { useMemo, useState } from 'react'
import SealBadge from './SealBadge.jsx'
import { formatBDT, formatDate } from '../utils.js'

export default function ExpensesTable({ expenses }) {
  const [statusFilter, setStatusFilter] = useState('all')

  const statuses = ['all', 'pending_approval', 'approved', 'paid', 'rejected']

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return expenses
    return expenses.filter((e) => e.status === statusFilter)
  }, [expenses, statusFilter])

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-hairline">
        <div>
          <h2 className="font-display text-lg">Recent Expenses</h2>
          <p className="text-xs text-ink-muted font-body">Latest entries from the expense register</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide rounded-sm border transition-colors ${
                statusFilter === s
                  ? 'bg-ink text-paper border-ink'
                  : 'border-hairline text-ink-muted hover:border-ink/40'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-muted font-body border-b border-hairline">
              <th className="px-5 py-2.5 font-medium">Title</th>
              <th className="px-3 py-2.5 font-medium">Category</th>
              <th className="px-3 py-2.5 font-medium">Submitted by</th>
              <th className="px-3 py-2.5 font-medium">Date</th>
              <th className="px-3 py-2.5 font-medium text-right">Amount</th>
              <th className="px-5 py-2.5 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp) => (
              <tr key={exp.id} className="border-b border-hairline/70 last:border-0 hover:bg-paper/60 transition-colors">
                <td className="px-5 py-3 font-body">{exp.title}</td>
                <td className="px-3 py-3 font-body text-ink-muted">{exp.category}</td>
                <td className="px-3 py-3 font-body text-ink-muted">{exp.submitted_by}</td>
                <td className="px-3 py-3 font-mono text-xs text-ink-muted">{formatDate(exp.expense_date)}</td>
                <td className="px-3 py-3 font-mono text-right">{formatBDT(exp.amount)}</td>
                <td className="px-5 py-3 text-right">
                  <SealBadge status={exp.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-ink-muted font-body text-sm">
                  No expenses match this status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
