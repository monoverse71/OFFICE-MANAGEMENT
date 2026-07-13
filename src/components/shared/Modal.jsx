import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ title, subtitle, onClose, children, width = 'max-w-lg' }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-ink/50 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative w-full ${width} my-8 bg-paper-card border border-hairline rounded-sm shadow-card`}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-hairline">
          <div>
            <h2 className="font-display text-xl text-ink">{title}</h2>
            {subtitle && <p className="text-xs text-ink-muted font-body mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-7 h-7 shrink-0 flex items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-paper transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}
