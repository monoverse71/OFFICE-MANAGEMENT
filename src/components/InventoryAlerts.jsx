import { PackageX } from 'lucide-react'

export default function InventoryAlerts({ items }) {
  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="px-5 py-4 border-b border-hairline flex items-center gap-2">
        <PackageX size={16} className="text-rust" strokeWidth={1.75} />
        <div>
          <h2 className="font-display text-lg">Low Stock</h2>
          <p className="text-xs text-ink-muted font-body">Quantity at or below reorder threshold</p>
        </div>
      </div>

      <ul className="divide-y divide-hairline/70">
        {items.map((item) => (
          <li key={item.id} className="px-5 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-body truncate">{item.name}</p>
              <p className="text-xs text-ink-muted font-mono mt-0.5">{item.asset_code} · {item.category}</p>
            </div>
            <span
              className={`font-mono text-xs px-2 py-1 rounded-sm border shrink-0 ${
                item.quantity === 0
                  ? 'text-rust border-rust/40 bg-rust/5'
                  : 'text-amber border-amber/40 bg-amber/5'
              }`}
            >
              {item.quantity} / {item.threshold} left
            </span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-5 py-8 text-center text-ink-muted font-body text-sm">Stock levels look healthy.</li>
        )}
      </ul>
    </div>
  )
}
