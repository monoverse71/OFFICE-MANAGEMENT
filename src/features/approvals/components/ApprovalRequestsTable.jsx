import { Eye, ClipboardList } from 'lucide-react'
import SealBadge from '../../../components/SealBadge.jsx'
import EmptyState from '../../../components/shared/EmptyState.jsx'
import { formatBDT, formatDate } from '../../../utils.js'

export default function ApprovalRequestsTable({ rows, onReview }) {
  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-muted font-body border-b border-hairline">
              <th className="px-4 py-3 font-medium whitespace-nowrap">Request ID</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Expense ID</th>
              <th className="px-4 py-3 font-medium">Expense Title</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Amount</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Category</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Submitted By</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Submitted Date</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-hairline/70 last:border-0 hover:bg-paper/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{r.id}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{r.expense_id}</td>
                <td className="px-4 py-3 font-body max-w-[220px] truncate">{r.expense ? r.expense.title : 'Expense not found'}</td>
                <td className="px-4 py-3 font-mono text-right whitespace-nowrap">{r.expense ? formatBDT(r.expense.amount) : '—'}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{r.expense ? r.expense.category : '—'}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{r.requested_by}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{formatDate(r.requested_at)}</td>
                <td className="px-4 py-3 text-right"><SealBadge status={r.status} /></td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => onReview(r)}
                    title="Review request"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-body rounded-sm border border-hairline text-ink hover:border-brass transition-colors"
                  >
                    <Eye size={13} /> Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <EmptyState
            icon={ClipboardList}
            title="No approval requests found"
            message="Nothing matches this filter right now. Try another tab or clear your search."
          />
        )}
      </div>
    </div>
  )
}
