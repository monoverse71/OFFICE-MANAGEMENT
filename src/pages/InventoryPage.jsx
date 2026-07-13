import InventoryAlerts from '../components/InventoryAlerts.jsx'

export default function InventoryPage({ items }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-display text-2xl leading-tight">Inventory</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Stock levels across office and warehouse assets.</p>
      </div>
      <InventoryAlerts items={items} />
    </div>
  )
}
