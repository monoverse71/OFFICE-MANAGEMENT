import { useMemo } from 'react'
import { Boxes, Laptop, PackageOpen, CheckCircle2 } from 'lucide-react'
import StatCard from '../../../components/StatCard.jsx'
import { displayStatus } from '../utils/inventoryFilters.js'

export default function InventoryStatsCards({ items }) {
  const stats = useMemo(() => {
    const assets = items.filter((it) => it.type === 'asset')
    const consumables = items.filter((it) => it.type === 'consumable')
    const available = items.filter((it) => {
      const status = displayStatus(it)
      return status === 'available' || status === 'in_stock'
    })

    return {
      total: items.length,
      assetCount: assets.length,
      consumableCount: consumables.length,
      availableCount: available.length
    }
  }, [items])

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Inventory Items" value={stats.total} sub="Across all categories" icon={Boxes} accent="ink" />
      <StatCard label="Total Assets" value={stats.assetCount} sub="Trackable equipment" icon={Laptop} accent="brass" />
      <StatCard label="Total Consumables" value={stats.consumableCount} sub="Used-up supplies" icon={PackageOpen} accent="amber" />
      <StatCard label="Available Items" value={stats.availableCount} sub="Ready to use" icon={CheckCircle2} accent="forest" />
    </section>
  )
}
