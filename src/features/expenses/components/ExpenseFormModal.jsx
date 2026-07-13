import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import { paymentMethods } from '../../../data/dummyData.js'
import { validateExpense, hasErrors } from '../utils/validateExpense.js'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  title: '',
  description: '',
  category: '',
  amount: '',
  payment_method: '',
  expense_date: today()
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
          payment_method: expense.payment_method,
          expense_date: expense.expense_date
        }
      : emptyForm
  )
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validateExpense(values)
    setErrors(validation)
    if (hasErrors(validation)) return

    onSubmit({ ...values, amount: Number(values.amount) })
    onClose()
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'
  const errorClass = 'text-xs text-rust font-body mt-1'

  return (
    <Modal
      title={isEdit ? 'Edit Expense' : 'Add Expense'}
      subtitle={isEdit ? `Record ${expense.id}` : 'Log a new expense for approval'}
      onClose={onClose}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="title">Title</label>
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
            rows={3}
            className={inputClass}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Optional notes about this expense"
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
            <label className={labelClass} htmlFor="amount">Amount (৳)</label>
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
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="payment_method">Payment Method</label>
            <select id="payment_method" className={inputClass} value={values.payment_method} onChange={(e) => update('payment_method', e.target.value)}>
              <option value="">Select method</option>
              {paymentMethods.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            {errors.payment_method && <p className={errorClass}>{errors.payment_method}</p>}
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

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors">
            {isEdit ? 'Save Changes' : 'Submit Expense'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
