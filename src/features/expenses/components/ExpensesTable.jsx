import { ChevronUp, ChevronDown, Eye, Pencil, Trash2, Receipt, ChevronLeft, ChevronRight } from 'lucide-react'
import SealBadge from '../../../components/SealBadge.jsx'
import EmptyState from '../../../components/shared/EmptyState.jsx'
import { formatBDT, formatDate } from '../../../utils.js'
import { paymentMethods } from '../../../data/dummyData.js'

const PAYMENT_LABELS = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label]))

const COLUMNS = [
  { key: 'id', label: 'Expense ID', sortable: false },
  { key: 'title', label: 'Title', sortable: false },
  { key: 'category', label: 'Category', sortable: false },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' },
  { key: 'payment_method', label: 'Payment Method', sortable: false },
  { key: 'expense_date', label: 'Expense Date', sortable: true },
  { key: 'submitted_by', label: 'Submitted By', sortable: false },
  { key: 'status', label: 'Approval Status', sortable: true, align: 'right' },
  { key: 'created_at', label: 'Created', sortable: false }
]

export default function ExpensesTable({
  rows,
  sortBy,
  sortDir,
  onSort,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onView,
  onEdit,
  onDelete
}) {
  function headerClick(col) {
    if (!col.sortable) return
    if (sortBy === col.key) {
      onSort(col.key, sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      onSort(col.key, 'asc')
    }
  }

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-muted font-body border-b border-hairline">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => headerClick(col)}
                  className={`px-4 py-3 font-medium select-none whitespace-nowrap ${col.align === 'right' ? 'text-right' : ''} ${
                    col.sortable ? 'cursor-pointer hover:text-ink' : ''
                  }`}
                >
                  <span className={`inline-flex items-center gap-1 ${col.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    {col.label}
                    {col.sortable && sortBy === col.key && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((exp) => (
              <tr key={exp.id} className="border-b border-hairline/70 last:border-0 hover:bg-paper/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{exp.id}</td>
                <td className="px-4 py-3 font-body max-w-[200px] truncate">{exp.title}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{exp.category}</td>
                <td className="px-4 py-3 font-mono text-right whitespace-nowrap">{formatBDT(exp.amount)}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{PAYMENT_LABELS[exp.payment_method] || exp.payment_method}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{formatDate(exp.expense_date)}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{exp.submitted_by}</td>
                <td className="px-4 py-3 text-right"><SealBadge status={exp.status} /></td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{formatDate(exp.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onView(exp)} title="View details" className="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-paper transition-colors">
                      <Eye size={14} />
                    </button>
                    <button type="button" onClick={() => onEdit(exp)} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:text-brass hover:bg-brass/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => onDelete(exp)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:text-rust hover:bg-rust/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <EmptyState
            icon={Receipt}
            title="No expenses found"
            message="Try adjusting your search or filters, or log a new expense to get started."
          />
        )}
      </div>

      {rows.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-hairline">
          <p className="text-xs text-ink-muted font-body">
            Showing page {page} of {totalPages} · {totalItems} total records
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-sm border border-hairline text-ink disabled:opacity-30 hover:border-brass transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono text-xs text-ink px-2">{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-sm border border-hairline text-ink disabled:opacity-30 hover:border-brass transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
