import Modal from '../../../components/shared/Modal.jsx'
import SealBadge from '../../../components/SealBadge.jsx'
import { formatBDT, formatDate, formatDateTime } from '../../../utils.js'
import { paymentMethods } from '../../../data/dummyData.js'

const PAYMENT_LABELS = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label]))

export default function ExpenseDetailsModal({ expense, onClose }) {
  return (
    <Modal title={expense.title} subtitle={`Record ${expense.id}`} onClose={onClose} width="max-w-lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl">{formatBDT(expense.amount)}</span>
          <SealBadge status={expense.status} />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Category</dt>
            <dd className="font-body mt-0.5">{expense.category}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Expense Date</dt>
            <dd className="font-mono mt-0.5">{formatDate(expense.expense_date)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Payment Method</dt>
            <dd className="font-body mt-0.5">{PAYMENT_LABELS[expense.payment_method] || expense.payment_method}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Submitted By</dt>
            <dd className="font-body mt-0.5">{expense.submitted_by}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Created</dt>
            <dd className="font-mono mt-0.5">{formatDateTime(expense.created_at)}</dd>
          </div>
        </dl>

        {expense.description && (
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Description</p>
            <p className="text-sm font-body text-ink">{expense.description}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
