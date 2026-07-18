import Modal from '../../../components/shared/Modal.jsx'
import EmptyState from '../../../components/shared/EmptyState.jsx'
import { formatDateTime } from '../../../utils.js'
import { History } from 'lucide-react'

const ACTION_LABELS = {
  initial: 'Opening Stock',
  add: 'Stock Added',
  remove: 'Stock Removed',
  adjust: 'Stock Adjusted'
}

const ACTION_TONE = {
  initial: 'text-ink-muted',
  add: 'text-forest',
  remove: 'text-rust',
  adjust: 'text-brass'
}

export default function StockHistoryModal({ item, onClose }) {
  const history = item.stock_history || []

  return (
    <Modal title="Stock History" subtitle={`${item.name} · ${item.code || item.id}`} onClose={onClose} width="max-w-xl">
      {history.length === 0 ? (
        <EmptyState icon={History} title="No stock movements yet" message="Add, remove, or adjust stock to start building this item's history." />
      ) : (
        <ul className="divide-y divide-hairline/70 border border-hairline rounded-sm max-h-[60vh] overflow-y-auto">
          {history.map((h) => (
            <li key={h.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className={`text-sm font-body font-medium ${ACTION_TONE[h.action] || 'text-ink'}`}>
                  {ACTION_LABELS[h.action] || h.action}
                </span>
                <span className="text-xs font-mono text-ink-muted">{formatDateTime(h.date)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs font-body text-ink-muted">
                {h.added_quantity != null && <span>Added: <span className="font-mono text-ink">{h.added_quantity}</span></span>}
                {h.removed_quantity != null && <span>Removed: <span className="font-mono text-ink">{h.removed_quantity}</span></span>}
                <span>Previous: <span className="font-mono text-ink">{h.previous_quantity}</span></span>
                <span>Current: <span className="font-mono text-ink">{h.current_quantity}</span></span>
              </div>
              {h.notes && <p className="text-xs font-body text-ink mt-1.5">{h.notes}</p>}
              <p className="text-[11px] font-mono text-ink-muted mt-1">Performed by {h.performed_by}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
