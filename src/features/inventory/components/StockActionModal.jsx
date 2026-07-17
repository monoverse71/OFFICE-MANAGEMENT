import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import { validateStockAction, hasErrors } from '../utils/validateInventory.js'

const CONFIG = {
  add: {
    title: 'Add Stock',
    label: 'Quantity to Add',
    confirmLabel: 'Add Stock',
    confirmClass: 'bg-forest hover:bg-forest/90'
  },
  remove: {
    title: 'Remove Stock',
    label: 'Quantity to Remove',
    confirmLabel: 'Remove Stock',
    confirmClass: 'bg-rust hover:bg-rust/90'
  },
  adjust: {
    title: 'Adjust Stock',
    label: 'New Quantity',
    confirmLabel: 'Save Adjustment',
    confirmClass: 'bg-brass hover:bg-brass/90'
  }
}

export default function StockActionModal({ item, mode, onConfirm, onClose }) {
  const config = CONFIG[mode]
  const [value, setValue] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validateStockAction(mode, value, item.quantity)
    setErrors(validation)
    if (hasErrors(validation)) return

    onConfirm(item.id, mode, Number(value), notes.trim())
    onClose()
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'

  return (
    <Modal title={config.title} subtitle={`${item.name} · ${item.id}`} onClose={onClose} width="max-w-sm">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex items-center justify-between px-3 py-2.5 bg-paper border border-hairline rounded-sm text-sm">
          <span className="text-ink-muted font-body">Current Quantity</span>
          <span className="font-mono">{item.quantity} {item.unit}</span>
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-value">{config.label}</label>
          <input
            id="stock-value"
            type="number"
            min="0"
            step="1"
            className={inputClass}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (errors.value) setErrors({})
            }}
            placeholder="0"
            autoFocus
          />
          {errors.value && <p className="text-xs text-rust font-body mt-1">{errors.value}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="stock-notes">Notes</label>
          <textarea
            id="stock-notes"
            rows={2}
            className={inputClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional — reason for this stock movement"
          />
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors">
            Cancel
          </button>
          <button type="submit" className={`px-4 py-2 text-sm font-body rounded-sm text-paper transition-colors ${config.confirmClass}`}>
            {config.confirmLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}
