const STYLES = {
  active: 'text-forest border-forest/60',
  on_leave: 'text-amber border-amber/60',
  resigned: 'text-rust border-rust/60'
}

const LABELS = {
  active: 'Active',
  on_leave: 'On Leave',
  resigned: 'Resigned'
}

export default function EmploymentStatusBadge({ status, className = '' }) {
  const style = STYLES[status] || STYLES.active
  const label = LABELS[status] || status

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-sm border font-mono text-[11px] uppercase tracking-wider whitespace-nowrap -rotate-1 ${style} ${className}`}
    >
      {label}
    </span>
  )
}
