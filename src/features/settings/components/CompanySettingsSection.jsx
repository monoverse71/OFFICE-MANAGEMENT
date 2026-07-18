import { useState } from 'react'
import { UploadCloud } from 'lucide-react'
import SettingsSection from './SettingsSection.jsx'
import StatusMessage from './StatusMessage.jsx'
import { validateCompanySettings, hasErrors } from '../utils/validateSettings.js'

export default function CompanySettingsSection({ settings, onSave }) {
  const [values, setValues] = useState(settings)
  const [logoPreview, setLogoPreview] = useState(settings.logo)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleLogo(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const validation = validateCompanySettings(values)
    setErrors(validation)
    if (hasErrors(validation)) {
      setStatus(null)
      return
    }
    onSave({ ...values, logo: logoPreview })
    setStatus({ type: 'success', message: 'Company settings saved. Sidebar, browser title, favicon and print documents are updated.' })
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'
  const errorClass = 'text-xs text-rust font-body mt-1'

  return (
    <SettingsSection title="Company Settings" description="Shown across the sidebar, browser tab, and printed documents">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full border-2 border-brass overflow-hidden flex items-center justify-center bg-paper shrink-0">
            {logoPreview ? (
              <img src={logoPreview} alt="Company logo" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-brass text-lg">{(values.name || '?').charAt(0)}</span>
            )}
          </div>
          <label
            htmlFor="company-logo"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-body rounded-sm border border-hairline text-ink-muted hover:border-brass cursor-pointer transition-colors"
          >
            <UploadCloud size={13} /> {logoPreview ? 'Change Logo' : 'Upload Logo'}
            <input id="company-logo" type="file" accept=".png,.jpg,.jpeg,.svg" className="hidden" onChange={handleLogo} />
          </label>
        </div>

        <div>
          <label className={labelClass} htmlFor="company-name">Company Name</label>
          <input id="company-name" type="text" className={inputClass} value={values.name} onChange={(e) => update('name', e.target.value)} />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="company-address">Head Office Address</label>
          <textarea id="company-address" rows={2} className={inputClass} value={values.address} onChange={(e) => update('address', e.target.value)} placeholder="Optional" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="company-phone">Phone Number</label>
            <input id="company-phone" type="text" className={inputClass} value={values.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass} htmlFor="company-email">Email Address</label>
            <input id="company-email" type="email" className={inputClass} value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="Optional" />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="company-website">Website</label>
          <input id="company-website" type="text" className={inputClass} value={values.website} onChange={(e) => update('website', e.target.value)} placeholder="https://example.com — optional" />
          {errors.website && <p className={errorClass}>{errors.website}</p>}
        </div>

        <div>
          <label className={labelClass} htmlFor="company-description">Company Description</label>
          <textarea id="company-description" rows={3} className={inputClass} value={values.description} onChange={(e) => update('description', e.target.value)} placeholder="Optional" />
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors">
            Save Company Settings
          </button>
        </div>

        <StatusMessage status={status} />
      </form>
    </SettingsSection>
  )
}
