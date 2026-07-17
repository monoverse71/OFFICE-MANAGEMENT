import { useMemo } from 'react'
import SettingsSection from './SettingsSection.jsx'
import { APP_NAME, APP_VERSION, APP_BUILD, APP_LAST_UPDATED, APP_DEVELOPER } from '../../../data/appMeta.js'
import { getStorageUsageBytes, formatBytes } from '../utils/storageUsage.js'
import { formatDate } from '../../../utils.js'

export default function AboutSystemSection({ totalRecords }) {
  const storageUsage = useMemo(() => formatBytes(getStorageUsageBytes()), [totalRecords])

  const rows = [
    ['Application Name', APP_NAME],
    ['Application Version', APP_VERSION],
    ['Build Version', APP_BUILD],
    ['Last Updated', formatDate(APP_LAST_UPDATED)],
    ['Current Storage Usage', storageUsage],
    ['Total Records', totalRecords],
    ['Developer', APP_DEVELOPER]
  ]

  return (
    <SettingsSection title="About System" description="Automatically calculated where possible">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b border-hairline/70 pb-2">
            <dt className="text-ink-muted font-body">{label}</dt>
            <dd className="font-mono text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </SettingsSection>
  )
}
