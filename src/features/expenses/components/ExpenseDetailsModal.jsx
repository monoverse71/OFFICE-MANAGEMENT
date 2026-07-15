import Modal from '../../../components/shared/Modal.jsx'
import SealBadge from '../../../components/SealBadge.jsx'
import { formatBDT, formatDate, formatDateTime } from '../../../utils.js'
import { paymentMethods } from '../../../data/dummyData.js'
import { FileText, ImageIcon } from 'lucide-react'

const PAYMENT_LABELS = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label]))

function ReceiptPreview({ fileName }) {
  if (!fileName) {
    return (
      <div className="flex items-center gap-2 text-sm text-ink-muted font-body px-3 py-3 border border-dashed border-hairline rounded-sm">
        <FileText size={16} />
        No attachment on this request.
      </div>
    )
  }
  const isImage = /\.(png|jpe?g)$/i.test(fileName)
  return (
    <div className="flex items-center gap-3 px-3 py-3 border border-hairline rounded-sm bg-paper">
      <div className="w-10 h-10 rounded-sm bg-brass/10 border border-brass/30 flex items-center justify-center shrink-0">
        {isImage ? <ImageIcon size={16} className="text-brass" /> : <FileText size={16} className="text-brass" />}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-body truncate">{fileName}</p>
        <p className="text-xs text-ink-muted font-mono">Preview available once file storage is wired up</p>
      </div>
    </div>
  )
}

export default function ExpenseDetailsModal({ expense, onClose }) {
  const isDecided = expense.status === 'approved' || expense.status === 'paid' || expense.status === 'rejected'

  return (
    <Modal title={expense.title} subtitle={`Record ${expense.id}`} onClose={onClose} width="max-w-lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted font-body">Requested Amount</p>
            <span className="font-display text-2xl">{formatBDT(expense.amount)}</span>
          </div>
          <SealBadge status={expense.status} />
        </div>

        {expense.approved_amount != null && (
          <div className="flex items-center justify-between px-3 py-2.5 bg-forest/5 border border-forest/20 rounded-sm">
            <span className="text-xs uppercase tracking-wide text-forest font-body">Approved Amount</span>
            <span className="font-display text-lg text-forest">{formatBDT(expense.approved_amount)}</span>
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Category</dt>
            <dd className="font-body mt-0.5">{expense.category}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Expense Date</dt>
            <dd className="font-mono mt-0.5">{formatDate(expense.expense_date)}</dd>
          </div>
          {expense.quantity != null && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Quantity</dt>
              <dd className="font-body mt-0.5">{expense.quantity}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Payment Method</dt>
            <dd className="font-body mt-0.5">
              {expense.payment_method ? (PAYMENT_LABELS[expense.payment_method] || expense.payment_method) : 'Not decided yet'}
            </dd>
          </div>
          {expense.payment_date && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Payment Date</dt>
              <dd className="font-mono mt-0.5">{formatDate(expense.payment_date)}</dd>
            </div>
          )}
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

        {expense.remarks && (
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Remarks</p>
            <p className="text-sm font-body text-ink">{expense.remarks}</p>
          </div>
        )}

        {isDecided && expense.approval_note && (
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Approval Note</p>
            <p className="text-sm font-body text-ink">{expense.approval_note}</p>
          </div>
        )}

        {expense.status === 'rejected' && expense.rejected_reason && (
          <div>
            <p className="text-xs uppercase tracking-wide text-rust font-body mb-1">Rejection Reason</p>
            <p className="text-sm font-body text-ink">{expense.rejected_reason}</p>
          </div>
        )}

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1.5">Attachment</p>
          <ReceiptPreview fileName={expense.attachment_file_name} />
        </div>
      </div>
    </Modal>
  )
}
