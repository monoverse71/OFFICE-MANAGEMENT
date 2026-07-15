import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import SealBadge from '../../../components/SealBadge.jsx'
import { formatBDT, formatDate, formatDateTime } from '../../../utils.js'
import { paymentMethods, approvalPaymentMethods } from '../../../data/dummyData.js'
import { Send, CheckCircle2, XCircle, FileText, Check, X } from 'lucide-react'

const PAYMENT_LABELS = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label]))
const today = () => new Date().toISOString().slice(0, 10)

export default function ApprovalDetailsModal({ request, canApprove, onApprove, onReject, onClose }) {
  const expense = request.expense
  const [mode, setMode] = useState(null) // null | 'approve' | 'reject'

  // Approval confirmation form fields
  const [approvedAmount, setApprovedAmount] = useState(expense ? String(expense.amount) : '')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentDate, setPaymentDate] = useState(today())
  const [approvalNote, setApprovalNote] = useState('')
  const [approveErrors, setApproveErrors] = useState({})

  // Rejection form field
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  const isPending = request.status === 'pending_approval'

  function validateApproval() {
    const errors = {}
    const amountNum = Number(approvedAmount)
    if (approvedAmount === '' || Number.isNaN(amountNum) || amountNum <= 0) {
      errors.approvedAmount = 'Enter an approved amount greater than zero.'
    }
    if (!paymentMethod) {
      errors.paymentMethod = 'Select a payment method.'
    }
    if (!paymentDate) {
      errors.paymentDate = 'Select a payment date.'
    }
    return errors
  }

  function submitApprove() {
    const errors = validateApproval()
    setApproveErrors(errors)
    if (Object.keys(errors).length > 0) return

    onApprove(request.id, {
      approvedAmount: Number(approvedAmount),
      paymentMethod,
      paymentDate,
      note: approvalNote.trim()
    })
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

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'
  const errorClass = 'text-xs text-rust font-body mt-1'

  return (
    <Modal title={expense ? expense.title : request.expense_id} subtitle={`Request ${request.id} · Expense ${request.expense_id}`} onClose={onClose} width="max-w-xl">
      <div className="space-y-5">
        {expense ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted font-body">Requested Amount</p>
                <span className="font-display text-2xl">{formatBDT(expense.amount)}</span>
              </div>
              <SealBadge status={request.status} />
            </div>

            {request.approved_amount != null && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-forest/5 border border-forest/20 rounded-sm">
                <span className="text-xs uppercase tracking-wide text-forest font-body">Approved Amount</span>
                <span className="font-display text-lg text-forest">{formatBDT(request.approved_amount)}</span>
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
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Payment Method</dt>
                <dd className="font-body mt-0.5">
                  {expense.payment_method ? (PAYMENT_LABELS[expense.payment_method] || expense.payment_method) : 'Not decided yet'}
                </dd>
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

            {expense.remarks && (
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Remarks</p>
                <p className="text-sm font-body text-ink">{expense.remarks}</p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1.5">Attachment</p>
              <div className="flex items-center gap-2 text-sm text-ink-muted font-body px-3 py-3 border border-dashed border-hairline rounded-sm">
                <FileText size={16} />
                {expense.attachment_file_name || 'No attachment on this request.'}
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
                <label className={labelClass} htmlFor="reason">Rejection reason</label>
                <textarea
                  id="reason"
                  rows={3}
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value)
                    if (reasonError) setReasonError('')
                  }}
                  placeholder="Explain why this expense is being rejected"
                  className={inputClass}
                />
                {reasonError && <p className={errorClass}>{reasonError}</p>}
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
              <div className="space-y-3">
                <p className="text-xs font-body text-ink-muted">
                  Confirm the final amount and how this expense will be paid out.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass} htmlFor="approved_amount">Approved Amount (৳)</label>
                    <input
                      id="approved_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      value={approvedAmount}
                      onChange={(e) => {
                        setApprovedAmount(e.target.value)
                        if (approveErrors.approvedAmount) setApproveErrors((prev) => ({ ...prev, approvedAmount: undefined }))
                      }}
                    />
                    {approveErrors.approvedAmount && <p className={errorClass}>{approveErrors.approvedAmount}</p>}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="payment_date">Payment Date</label>
                    <input
                      id="payment_date"
                      type="date"
                      className={inputClass}
                      value={paymentDate}
                      onChange={(e) => {
                        setPaymentDate(e.target.value)
                        if (approveErrors.paymentDate) setApproveErrors((prev) => ({ ...prev, paymentDate: undefined }))
                      }}
                    />
                    {approveErrors.paymentDate && <p className={errorClass}>{approveErrors.paymentDate}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="payment_method">Payment Method</label>
                  <select
                    id="payment_method"
                    className={inputClass}
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value)
                      if (approveErrors.paymentMethod) setApproveErrors((prev) => ({ ...prev, paymentMethod: undefined }))
                    }}
                  >
                    <option value="">Select payment method</option>
                    {approvalPaymentMethods.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  {approveErrors.paymentMethod && <p className={errorClass}>{approveErrors.paymentMethod}</p>}
                </div>

                <div>
                  <label className={labelClass} htmlFor="approval_note">Approval Note (optional)</label>
                  <textarea
                    id="approval_note"
                    rows={2}
                    className={inputClass}
                    value={approvalNote}
                    onChange={(e) => setApprovalNote(e.target.value)}
                    placeholder="Add a note for the record"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
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
