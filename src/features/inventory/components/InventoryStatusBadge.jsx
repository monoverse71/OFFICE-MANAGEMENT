const STYLES = {
  available: 'text-forest border-forest/60',
  in_stock: 'text-forest border-forest/60',
  assigned: 'text-brass border-brass/70',
  maintenance: 'text-amber border-amber/60',
  disposed: 'text-rust border-rust/60',
  out_of_stock: 'text-rust border-rust/60'
}

const LABELS = {
  available: 'Available',
  in_stock: 'In Stock',
  assigned: 'Assigned',
  maintenance: 'Maintenance',
  disposed: 'Disposed',
  out_of_stock: 'Out of Stock'
}

export default function InventoryStatusBadge({ status, className = '' }) {
  const style = STYLES[status] || STYLES.available
  const label = LABELS[status] || status

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-sm border font-mono text-[11px] uppercase tracking-wider whitespace-nowrap -rotate-1 ${style} ${className}`}
    >
      {label}
    </span>
  )
}
