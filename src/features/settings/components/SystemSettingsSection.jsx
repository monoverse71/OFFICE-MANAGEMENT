import { useState } from 'react'
import SettingsSection from './SettingsSection.jsx'
import StatusMessage from './StatusMessage.jsx'
import { currencyOptions, dateFormatOptions, timeFormatOptions, timezoneOptions } from '../../../data/dummyData.js'

export default function SystemSettingsSection({ settings, onSave }) {
  const [values, setValues] = useState(settings)
  const [status, setStatus] = useState(null)

  function update(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(values)
    setStatus({ type: 'success', message: 'System settings saved and applied across the application.' })
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-paper border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'
  const labelClass = 'block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5'

  const selectedDateFormat = dateFormatOptions.find((d) => d.value === values.dateFormat)

  return (
    <SettingsSection title="System Settings" description="Applies immediately across dates, amounts, and times throughout the app">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="currency">Currency</label>
            <select id="currency" className={inputClass} value={values.currency} onChange={(e) => update('currency', e.target.value)}>
              {currencyOptions.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="timeFormat">Time Format</label>
            <select id="timeFormat" className={inputClass} value={values.timeFormat} onChange={(e) => update('timeFormat', e.target.value)}>
              {timeFormatOptions.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="dateFormat">Date Format</label>
          <select id="dateFormat" className={inputClass} value={values.dateFormat} onChange={(e) => update('dateFormat', e.target.value)}>
            {dateFormatOptions.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          {selectedDateFormat && (
            <p className="text-[11px] text-ink-muted font-body mt-1">Example: {selectedDateFormat.example}</p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="timezone">Time Zone</label>
          <select id="timezone" className={inputClass} value={values.timezone} onChange={(e) => update('timezone', e.target.value)}>
            {timezoneOptions.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors">
            Save System Settings
          </button>
        </div>

        <StatusMessage status={status} />
      </form>
    </SettingsSection>
  )
}
