import { Check, X } from 'lucide-react'
import { formatBDT, formatDate } from '../utils.js'

export default function ApprovalsPanel({ approvals, onDecide, canApprove = true }) {
  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg">Awaiting Approval</h2>
          <p className="text-xs text-ink-muted font-body">Requires Chairman / Vice Chairman / Super Admin sign-off</p>
        </div>
        <span className="font-mono text-xs px-2 py-1 rounded-sm bg-amber/10 text-amber border border-amber/30">
          {approvals.length} open
        </span>
      </div>

      <ul className="divide-y divide-hairline/70">
        {approvals.map((a) => (
          <li key={a.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-body text-sm truncate">{a.record_title}</p>
              <p className="text-xs text-ink-muted font-body mt-0.5">
                {a.module} · {a.requested_by} · {formatDate(a.requested_at)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-mono text-sm">{formatBDT(a.amount)}</span>
              <button
                type="button"
                disabled={!canApprove}
                onClick={() => onDecide(a.id, 'approved')}
                title={canApprove ? 'Approve' : 'Only Chairman / Vice Chairman / Super Admin can decide'}
                className="w-7 h-7 flex items-center justify-center rounded-sm border border-forest/40 text-forest enabled:hover:bg-forest/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Check size={14} strokeWidth={2.25} />
              </button>
              <button
                type="button"
                disabled={!canApprove}
                onClick={() => onDecide(a.id, 'rejected')}
                title={canApprove ? 'Reject' : 'Only Chairman / Vice Chairman / Super Admin can decide'}
                className="w-7 h-7 flex items-center justify-center rounded-sm border border-rust/40 text-rust enabled:hover:bg-rust/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <X size={14} strokeWidth={2.25} />
              </button>
            </div>
          </li>
        ))}
        {approvals.length === 0 && (
          <li className="px-5 py-8 text-center text-ink-muted font-body text-sm">
            The register is clear — nothing waiting on you.
          </li>
        )}
      </ul>
    </div>
  )
}
