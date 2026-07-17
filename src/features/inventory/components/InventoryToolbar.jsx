import { Search, Plus } from 'lucide-react'
import { assetStatuses } from '../../../data/dummyData.js'

export default function InventoryToolbar({ filters, onFilterChange, categories, onAddItem }) {
  function set(field, value) {
    onFilterChange({ ...filters, [field]: value })
  }

  const inputClass =
    'px-2.5 py-1.5 text-sm bg-paper-card border border-hairline rounded-sm font-body text-ink focus:border-brass focus:outline-none'

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card px-5 py-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl leading-tight">Inventory</p>
          <p className="text-xs text-ink-muted font-body mt-0.5">Assets and consumables tracked manually, independent of Expenses</p>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-body uppercase tracking-wide rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search by ID, name, brand, model or location…"
            className={`w-full pl-8 ${inputClass}`}
          />
        </label>

        <select value={filters.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select value={filters.type} onChange={(e) => set('type', e.target.value)} className={inputClass}>
          <option value="all">All types</option>
          <option value="asset">Asset</option>
          <option value="consumable">Consumable</option>
        </select>

        <select value={filters.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
          <option value="all">All statuses</option>
          {assetStatuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>
    </div>
  )
}
