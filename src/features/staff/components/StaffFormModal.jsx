import { useState } from 'react'
import Modal from '../../../components/shared/Modal.jsx'
import { validateStaff, hasErrors } from '../utils/validateStaff.js'
import { employmentStatuses } from '../utils/staffFilters.js'
import Avatar from './Avatar.jsx'
import { UploadCloud } from 'lucide-react'

const today = () => new Date().toISOString().slice(0, 10)

const emptyForm = {
  full_name: '',
  mobile_number: '',
  email: '',
  designation: '',
  department: '',
  joining_date: today(),
  employment_status: 'active',
  address: '',
  emergency_contact: '',
  notes: ''
}

export default function StaffFormModal({ employee, onSubmit, onClose }) {
  const isEdit = Boolean(employee)
  const [values, setValues] = useState(() =>
    isEdit
      ? {
          full_name: employee.full_name,
          mobile_number: employee.mobile_number,
          email: employee.email || '',
          designation: employee.designation,
          department: employee.department,
          joining_date: employee.joining_date,
          employment_status: employee.employment_status,
          address: employee.address || '',
          emergency_contact: employee.emergency_contact || '',
          notes: employee.notes || ''
        }
      : emptyForm
  )
  const [photoUrl, setPhotoUrl] = useState(employee?.photo_url || null)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoUrl(reader.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validateStaff(values)
    setErrors(validation)
    if (hasErrors(validation)) return

    onSubmit({ ...values, photo_url: photoUrl })
    onClose()
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'
  const errorClass = 'text-xs text-rust font-body mt-1'

  return (
    <Modal
      title={isEdit ? 'Edit Employee' : 'Add Employee'}
      subtitle={isEdit ? `Record ${employee.code || employee.id}` : 'Add a new employee to the directory'}
      onClose={onClose}
      width="max-w-xl"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar name={values.full_name} photoUrl={photoUrl} size={48} />
          <label
            htmlFor="photo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body rounded-sm border border-hairline text-ink-muted hover:border-brass cursor-pointer transition-colors"
          >
            <UploadCloud size={13} /> {photoUrl ? 'Change Photo' : 'Upload Photo (optional)'}
            <input id="photo" type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="full_name">Full Name</label>
            <input id="full_name" type="text" className={inputClass} value={values.full_name} onChange={(e) => update('full_name', e.target.value)} placeholder="e.g. Nasrin Akter" />
            {errors.full_name && <p className={errorClass}>{errors.full_name}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="mobile_number">Mobile Number</label>
            <input id="mobile_number" type="text" className={inputClass} value={values.mobile_number} onChange={(e) => update('mobile_number', e.target.value)} placeholder="e.g. 01712-345678" />
            {errors.mobile_number && <p className={errorClass}>{errors.mobile_number}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="email">Email</label>
            <input id="email" type="email" className={inputClass} value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="Optional" />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="employment_status">Employment Status</label>
            <select id="employment_status" className={inputClass} value={values.employment_status} onChange={(e) => update('employment_status', e.target.value)}>
              {employmentStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="designation">Designation</label>
            <input id="designation" type="text" className={inputClass} value={values.designation} onChange={(e) => update('designation', e.target.value)} placeholder="e.g. Office Manager" />
            {errors.designation && <p className={errorClass}>{errors.designation}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="department">Department</label>
            <input id="department" type="text" className={inputClass} value={values.department} onChange={(e) => update('department', e.target.value)} placeholder="e.g. Administration" />
            {errors.department && <p className={errorClass}>{errors.department}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="joining_date">Joining Date</label>
          <input id="joining_date" type="date" className={inputClass} value={values.joining_date} onChange={(e) => update('joining_date', e.target.value)} />
          {errors.joining_date && <p className={errorClass}>{errors.joining_date}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="address">Address</label>
          <textarea id="address" rows={2} className={inputClass} value={values.address} onChange={(e) => update('address', e.target.value)} placeholder="Optional" />
        </div>

        <div>
          <label className={labelClass} htmlFor="emergency_contact">Emergency Contact</label>
          <input id="emergency_contact" type="text" className={inputClass} value={values.emergency_contact} onChange={(e) => update('emergency_contact', e.target.value)} placeholder="Optional — name and number" />
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
            {isEdit ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
