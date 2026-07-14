import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import SealBadge from '../../../components/SealBadge.jsx'
import { formatBDT, formatDate, formatDateTime } from '../../../utils.js'
import { paymentMethods } from '../../../data/dummyData.js'
import { Send, CheckCircle2, XCircle, FileText, Check, X } from 'lucide-react'

const PAYMENT_LABELS = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label]))

export default function ApprovalDetailsModal({ request, canApprove, onApprove, onReject, onClose }) {
  const expense = request.expense
  const [comment, setComment] = useState('')
  const [reason, setReason] = useState('')
  const [mode, setMode] = useState(null) // null | 'approve' | 'reject'
  const [reasonError, setReasonError] = useState('')

  const isPending = request.status === 'pending_approval'

  function submitApprove() {
    onApprove(request.id, comment.trim())
    onClose()
  }

  function submitReject() {
    if (!reason.trim()) {
      setReasonError('Please explain why this expense is being rejected.')
      return
    }
    onReject(request.id, reason.trim())
    onClose()
  }

  const timeline = [
    {
      icon: Send,
      label: 'Submitted for Approval',
      by: request.requested_by,
      at: request.requested_at,
      tone: 'text-ink-muted'
    }
  ]
  if (request.status === 'approved') {
    timeline.push({
      icon: CheckCircle2,
      label: 'Approved',
      by: request.decided_by,
      at: request.decided_at,
      tone: 'text-forest',
      note: request.comment
    })
  }
  if (request.status === 'rejected') {
    timeline.push({
      icon: XCircle,
      label: 'Rejected',
      by: request.decided_by,
      at: request.decided_at,
      tone: 'text-rust',
      note: request.rejection_reason
    })
  }

  return (
    <Modal title={expense ? expense.title : request.expense_id} subtitle={`Request ${request.id} · Expense ${request.expense_id}`} onClose={onClose} width="max-w-xl">
      <div className="space-y-5">
        {expense ? (
          <>
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl">{formatBDT(expense.amount)}</span>
              <SealBadge status={request.status} />
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
            </dl>

            {expense.description && (
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Description</p>
                <p className="text-sm font-body text-ink">{expense.description}</p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1.5">Receipt</p>
              <div className="flex items-center gap-2 text-sm text-ink-muted font-body px-3 py-3 border border-dashed border-hairline rounded-sm">
                <FileText size={16} />
                No receipt attached — upload will be available once file storage is wired up.
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm font-body text-ink-muted">This request's expense record could not be found.</p>
        )}

        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-2">Timeline</p>
          <ul className="space-y-3">
            {timeline.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <step.icon size={15} className={`${step.tone} mt-0.5 shrink-0`} />
                <div>
                  <p className="text-sm font-body">
                    {step.label} {step.by && <span className="text-ink-muted">— {step.by}</span>}
                  </p>
                  {step.at && <p className="text-xs font-mono text-ink-muted">{formatDateTime(step.at)}</p>}
                  {step.note && <p className="text-xs font-body text-ink-muted mt-0.5">"{step.note}"</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isPending && canApprove && (
          <div className="border-t border-hairline pt-4 space-y-3">
            {mode === 'reject' ? (
              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5" htmlFor="reason">
                  Rejection reason
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value)
                    if (reasonError) setReasonError('')
                  }}
                  placeholder="Explain why this expense is being rejected"
                  className="w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none"
                />
                {reasonError && <p className="text-xs text-rust font-body mt-1">{reasonError}</p>}
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={() => setMode(null)} className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={submitReject} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm bg-rust text-paper hover:bg-rust/90 transition-colors">
                    <X size={14} /> Confirm Rejection
                  </button>
                </div>
              </div>
            ) : mode === 'approve' ? (
              <div>
                <label className="block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5" htmlFor="comment">
                  Comment (optional)
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a note for the record"
                  className="w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={() => setMode(null)} className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={submitApprove} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm bg-forest text-paper hover:bg-forest/90 transition-colors">
                    <Check size={14} /> Confirm Approval
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('reject')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm border border-rust/40 text-rust hover:bg-rust/10 transition-colors"
                >
                  <X size={14} /> Reject
                </button>
                <button
                  type="button"
                  onClick={() => setMode('approve')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm bg-forest text-paper hover:bg-forest/90 transition-colors"
                >
                  <Check size={14} /> Approve
                </button>
              </div>
            )}
          </div>
        )}

        {isPending && !canApprove && (
          <p className="text-xs text-ink-muted font-body border-t border-hairline pt-4">
            Only the Chairman, Vice Chairman, or Super Admin can approve or reject this request.
          </p>
        )}
      </div>
    </Modal>
  )
}
