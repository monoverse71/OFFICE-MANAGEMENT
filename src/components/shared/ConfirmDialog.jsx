import Modal from './Modal.jsx'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  danger = true,
  onConfirm,
  onCancel
}) {
  return (
    <Modal title={title} onClose={onCancel} width="max-w-sm">
      <div className="flex gap-3">
        <AlertTriangle size={20} className={danger ? 'text-rust shrink-0' : 'text-amber shrink-0'} />
        <p className="text-sm font-body text-ink-muted">{message}</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`px-4 py-2 text-sm font-body rounded-sm text-paper transition-colors ${
            danger ? 'bg-rust hover:bg-rust/90' : 'bg-ink hover:bg-ink-2'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
