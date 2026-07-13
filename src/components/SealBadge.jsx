const STYLES = {
  draft: 'text-ink-muted border-ink-muted/50',
  pending_approval: 'text-amber border-amber/60',
  approved: 'text-forest border-forest/60',
  paid: 'text-brass border-brass/70',
  rejected: 'text-rust border-rust/60',
  archived: 'text-ink-muted border-ink-muted/40'
}

const LABELS = {
  draft: 'Draft',
  pending_approval: 'Pending',
  approved: 'Approved',
  paid: 'Paid',
  rejected: 'Rejected',
  archived: 'Archived'
}

/**
 * A rubber-stamp style status marker — the register's way of marking
 * a record's fate, echoing how a physical office would stamp a file.
 */
export default function SealBadge({ status, className = '' }) {
  const style = STYLES[status] || STYLES.draft
  const label = LABELS[status] || status

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-sm border font-mono text-[11px] uppercase tracking-wider whitespace-nowrap -rotate-1 ${style} ${className}`}
    >
      {label}
    </span>
  )
}
