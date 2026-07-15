import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import { validateExpense, hasErrors } from '../utils/validateExpense.js'
import { Send, UploadCloud, FileText } from 'lucide-react'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  title: '',
  description: '',
  category: '',
  amount: '',
  quantity: '',
  expense_date: today(),
  remarks: ''
}

export default function ExpenseFormModal({ expense, categories, onSubmit, onClose }) {
  const isEdit = Boolean(expense)
  const [values, setValues] = useState(() =>
    isEdit
      ? {
          title: expense.title,
          description: expense.description || '',
          category: expense.category,
          amount: expense.amount,
          quantity: expense.quantity ?? '',
          expense_date: expense.expense_date,
          remarks: expense.remarks || ''
        }
      : emptyForm
  )
  const [attachmentName, setAttachmentName] = useState(expense?.attachment_file_name || null)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleAttachment(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAttachmentName(file.name)
  }

  function submit(action) {
    const validation = validateExpense(values)
    setErrors(validation)
    if (hasErrors(validation)) return

    onSubmit(
      {
        ...values,
        amount: Number(values.amount),
        quantity: values.quantity === '' ? null : Number(values.quantity),
        attachment_file_name: attachmentName
      },
      action
    )
    onClose()
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    // Enter key / default form submit on the create form means "submit for approval"
    submit(isEdit ? 'save' : 'submit')
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'
  const errorClass = 'text-xs text-rust font-body mt-1'

  return (
    <Modal
      title={isEdit ? 'Edit Expense' : 'Add Expense'}
      subtitle={isEdit ? `Record ${expense.id}` : 'Log a new expense request for approval'}
      onClose={onClose}
      width="max-w-xl"
    >
      <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="title">Expense Title</label>
          <input
            id="title"
            type="text"
            className={inputClass}
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="e.g. Office electricity bill — August"
          />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={2}
            className={inputClass}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="What this expense is for"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="category">Category</label>
            <select id="category" className={inputClass} value={values.category} onChange={(e) => update('category', e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className={errorClass}>{errors.category}</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="quantity">Quantity (if applicable)</label>
            <input
              id="quantity"
              type="number"
              min="0"
              step="1"
              className={inputClass}
              value={values.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="amount">Requested Amount (৳)</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              value={values.amount}
              onChange={(e) => update('amount', e.target.value)}
              placeholder="0.00"
            />
            {errors.amount && <p className={errorClass}>{errors.amount}</p>}
            <p className="text-[11px] text-ink-muted font-body mt-1">
              The final approved amount and payment method are set by management during approval.
            </p>
          </div>

          <div>
            <label className={labelClass} htmlFor="expense_date">Expense Date</label>
            <input
              id="expense_date"
              type="date"
              className={inputClass}
              value={values.expense_date}
              max={today()}
              onChange={(e) => update('expense_date', e.target.value)}
            />
            {errors.expense_date && <p className={errorClass}>{errors.expense_date}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Attachment (optional)</label>
          <label
            htmlFor="attachment"
            className="flex items-center gap-3 px-3 py-3 border border-dashed border-hairline rounded-sm cursor-pointer hover:border-brass transition-colors"
          >
            {attachmentName ? <FileText size={16} className="text-brass shrink-0" /> : <UploadCloud size={16} className="text-ink-muted shrink-0" />}
            <span className="text-sm font-body text-ink-muted truncate">
              {attachmentName || 'PDF, PNG or JPEG — click to attach a bill or receipt'}
            </span>
            <input id="attachment" type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleAttachment} />
          </label>
        </div>

        <div>
          <label className={labelClass} htmlFor="remarks">Remarks</label>
          <textarea
            id="remarks"
            rows={2}
            className={inputClass}
            value={values.remarks}
            onChange={(e) => update('remarks', e.target.value)}
            placeholder="Optional remarks for the approver"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors">
            Cancel
          </button>
          {isEdit ? (
            <button type="submit" className="px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors">
              Save Changes
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => submit('draft')}
                className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors"
              >
                Save as Draft
              </button>
              <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors">
                <Send size={14} /> Submit for Approval
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  )
}
