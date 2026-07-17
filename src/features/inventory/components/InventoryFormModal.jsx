import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import CategoryCombobox from '../../expenses/components/CategoryCombobox.jsx'
import { validateInventoryItem, hasErrors } from '../utils/validateInventory.js'
import { inventoryUnits, assetStatuses } from '../../../data/dummyData.js'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  name: '',
  category: '',
  type: 'asset',
  brand: '',
  model: '',
  unit: '',
  opening_quantity: '',
  location: '',
  purchase_date: today(),
  notes: ''
}

export default function InventoryFormModal({ item, categories, onSubmit, onClose }) {
  const isEdit = Boolean(item)
  const [values, setValues] = useState(() =>
    isEdit
      ? {
          name: item.name,
          category: item.category,
          type: item.type,
          brand: item.brand || '',
          model: item.model || '',
          unit: item.unit,
          location: item.location,
          purchase_date: item.purchase_date,
          notes: item.notes || '',
          status: item.status || 'available'
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
    // Opening quantity only applies at creation — quantity is never
    // hand-edited afterwards, only through Add/Remove/Adjust Stock.
    const validation = isEdit
      ? validateInventoryItem({ ...values, opening_quantity: '0' })
      : validateInventoryItem(values)
    setErrors(validation)
    if (hasErrors(validation)) return

    const payload = isEdit
      ? { ...values }
      : { ...values, opening_quantity: Number(values.opening_quantity) }
    onSubmit(payload)
    onClose()
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'
  const errorClass = 'text-xs text-rust font-body mt-1'

  return (
    <Modal
      title={isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}
      subtitle={isEdit ? `Record ${item.id}` : 'Manually add a new asset or consumable'}
      onClose={onClose}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className={labelClass} htmlFor="name">Item Name</label>
          <input id="name" type="text" className={inputClass} value={values.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Dell Latitude Laptop" />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CategoryCombobox categories={categories} value={values.category} onChange={(name) => update('category', name)} error={errors.category} />
          </div>
          <div>
            <label className={labelClass} htmlFor="type">Type</label>
            <select id="type" className={inputClass} value={values.type} onChange={(e) => update('type', e.target.value)}>
              <option value="asset">Asset</option>
              <option value="consumable">Consumable</option>
            </select>
            {errors.type && <p className={errorClass}>{errors.type}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="brand">Brand</label>
            <input id="brand" type="text" className={inputClass} value={values.brand} onChange={(e) => update('brand', e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass} htmlFor="model">Model</label>
            <input id="model" type="text" className={inputClass} value={values.model} onChange={(e) => update('model', e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="unit">Unit</label>
            <select id="unit" className={inputClass} value={values.unit} onChange={(e) => update('unit', e.target.value)}>
              <option value="">Select unit</option>
              {inventoryUnits.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
            {errors.unit && <p className={errorClass}>{errors.unit}</p>}
          </div>

          {isEdit ? (
            values.type === 'asset' ? (
              <div>
                <label className={labelClass} htmlFor="status">Asset Status</label>
                <select id="status" className={inputClass} value={values.status} onChange={(e) => update('status', e.target.value)}>
                  {assetStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className={labelClass}>Current Quantity</label>
                <div className={`${inputClass} bg-paper/60 text-ink-muted cursor-not-allowed`}>{item.quantity} {item.unit}</div>
                <p className="text-[11px] text-ink-muted font-body mt-1">Use Add / Remove / Adjust Stock to change this.</p>
              </div>
            )
          ) : (
            <div>
              <label className={labelClass} htmlFor="opening_quantity">Opening Quantity</label>
              <input
                id="opening_quantity"
                type="number"
                min="0"
                step="1"
                className={inputClass}
                value={values.opening_quantity}
                onChange={(e) => update('opening_quantity', e.target.value)}
                placeholder="0"
              />
              {errors.opening_quantity && <p className={errorClass}>{errors.opening_quantity}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="location">Store Location</label>
            <input id="location" type="text" className={inputClass} value={values.location} onChange={(e) => update('location', e.target.value)} placeholder="e.g. Head Office, 2nd Floor" />
            {errors.location && <p className={errorClass}>{errors.location}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="purchase_date">Purchase Date</label>
            <input id="purchase_date" type="date" className={inputClass} value={values.purchase_date} max={today()} onChange={(e) => update('purchase_date', e.target.value)} />
            {errors.purchase_date && <p className={errorClass}>{errors.purchase_date}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="notes">Notes</label>
          <textarea id="notes" rows={2} className={inputClass} value={values.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Optional" />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors">
            {isEdit ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
