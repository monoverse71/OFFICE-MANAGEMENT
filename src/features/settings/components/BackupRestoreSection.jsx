import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import SettingsSection from './SettingsSection.jsx'
import StatusMessage from './StatusMessage.jsx'
import { buildBackupPayload, downloadJson, validateBackupPayload, readFileAsText } from '../utils/backup.js'

export default function BackupRestoreSection({ appState, onRestore }) {
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  function handleExport() {
    const payload = buildBackupPayload(appState)
    const stamp = new Date().toISOString().slice(0, 10)
    downloadJson(`office-backup-${stamp}.json`, payload)
    setStatus({ type: 'success', message: 'Backup downloaded successfully.' })
  }

  function triggerImport() {
    fileInputRef.current?.click()
  }

  async function handleFileSelected(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setBusy(true)
    try {
      const text = await readFileAsText(file)
      let parsed
      try {
        parsed = JSON.parse(text)
      } catch {
        setStatus({ type: 'error', message: 'That file is not valid JSON.' })
        return
      }

      const result = validateBackupPayload(parsed)
      if (!result.ok) {
        setStatus({ type: 'error', message: result.message })
        return
      }

      onRestore(result.data)
      setStatus({ type: 'success', message: 'Backup restored successfully. All modules have been updated.' })
    } catch {
      setStatus({ type: 'error', message: 'Could not read that file. Please try again.' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <SettingsSection title="Backup & Restore" description="Download a complete snapshot, or restore from a previous one">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors"
        >
          <Download size={14} /> Export Backup
        </button>
        <button
          type="button"
          onClick={triggerImport}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:border-brass transition-colors disabled:opacity-60"
        >
          <Upload size={14} /> {busy ? 'Importing…' : 'Import Backup'}
        </button>
        <input ref={fileInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleFileSelected} />
      </div>

      <p className="text-xs text-ink-muted font-body mt-3">
        A backup includes Expenses, Approvals, Inventory, Staff, Tasks, Notifications, Company Settings, System
        Settings, and the Item Catalogue. Importing a file fully replaces the current data after it passes validation.
      </p>

      <StatusMessage status={status} />
    </SettingsSection>
  )
}
