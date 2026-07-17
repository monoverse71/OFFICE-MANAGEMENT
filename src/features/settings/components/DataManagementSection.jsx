import { useState } from 'react'
import { RotateCcw, Receipt, Boxes, Bell, ListChecks } from 'lucide-react'
import SettingsSection from './SettingsSection.jsx'
import StatusMessage from './StatusMessage.jsx'
import ConfirmDialog from '../../../components/shared/ConfirmDialog.jsx'

const ACTIONS = [
  {
    key: 'resetDemo',
    label: 'Reset Demo Data',
    icon: RotateCcw,
    tone: 'border-hairline text-ink hover:border-brass',
    message: 'This resets the entire application — every module — back to its original empty state. This cannot be undone.'
  },
  {
    key: 'clearExpenses',
    label: 'Clear Expenses',
    icon: Receipt,
    tone: 'border-rust/40 text-rust hover:bg-rust/10',
    message: 'This permanently deletes every expense record. This cannot be undone.'
  },
  {
    key: 'clearInventory',
    label: 'Clear Inventory',
    icon: Boxes,
    tone: 'border-rust/40 text-rust hover:bg-rust/10',
    message: 'This permanently deletes every inventory item and its stock history. This cannot be undone.'
  },
  {
    key: 'clearNotifications',
    label: 'Clear Notifications',
    icon: Bell,
    tone: 'border-rust/40 text-rust hover:bg-rust/10',
    message: 'This permanently deletes every notification. This cannot be undone.'
  },
  {
    key: 'clearTasks',
    label: 'Clear Tasks',
    icon: ListChecks,
    tone: 'border-rust/40 text-rust hover:bg-rust/10',
    message: 'This permanently deletes every task. This cannot be undone.'
  }
]

export default function DataManagementSection({ onAction }) {
  const [pending, setPending] = useState(null)
  const [status, setStatus] = useState(null)

  function confirm() {
    onAction(pending.key)
    setStatus({ type: 'success', message: `"${pending.label}" completed. The Dashboard has been updated.` })
    setPending(null)
  }

  return (
    <SettingsSection title="Data Management" description="Destructive actions — each requires confirmation">
      <div className="flex flex-wrap gap-3">
        {ACTIONS.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => setPending(action)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-body rounded-sm border transition-colors ${action.tone}`}
          >
            <action.icon size={14} /> {action.label}
          </button>
        ))}
      </div>

      <StatusMessage status={status} />

      {pending && (
        <ConfirmDialog
          title={pending.label}
          message={pending.message}
          confirmLabel={pending.label}
          onConfirm={confirm}
          onCancel={() => setPending(null)}
        />
      )}
    </SettingsSection>
  )
}
