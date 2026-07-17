import { useMemo, useState } from 'react'
import InventoryStatsCards from '../features/inventory/components/InventoryStatsCards.jsx'
import InventoryToolbar from '../features/inventory/components/InventoryToolbar.jsx'
import InventoryTable from '../features/inventory/components/InventoryTable.jsx'
import InventoryFormModal from '../features/inventory/components/InventoryFormModal.jsx'
import StockActionModal from '../features/inventory/components/StockActionModal.jsx'
import StockHistoryModal from '../features/inventory/components/StockHistoryModal.jsx'
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx'
import {
  DEFAULT_INVENTORY_FILTERS,
  applyInventoryFilters,
  sortInventory,
  paginate
} from '../features/inventory/utils/inventoryFilters.js'
import { inventoryCategories } from '../data/dummyData.js'

const PAGE_SIZE = 10

export default function InventoryPage({ items, onAddItem, onUpdateItem, onDeleteItem, onStockAction }) {
  const [filters, setFilters] = useState(DEFAULT_INVENTORY_FILTERS)
  const [sortBy, setSortBy] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const [formTarget, setFormTarget] = useState(null) // null | 'new' | item object
  const [stockTarget, setStockTarget] = useState(null) // { item, mode }
  const [historyTarget, setHistoryTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => applyInventoryFilters(items, filters), [items, filters])
  const sorted = useMemo(() => sortInventory(filtered, sortBy, sortDir), [filtered, sortBy, sortDir])
  const { pageItems, totalPages, safePage, totalItems } = useMemo(
    () => paginate(sorted, page, PAGE_SIZE),
    [sorted, page]
  )

  function handleFilterChange(next) {
    setFilters(next)
    setPage(1)
  }

  function handleSort(key, dir) {
    setSortBy(key)
    setSortDir(dir)
    setPage(1)
  }

  function handleFormSubmit(data) {
    if (formTarget && formTarget !== 'new') {
      onUpdateItem(formTarget.id, data)
    } else {
      onAddItem(data)
    }
  }

  function handleDeleteConfirm() {
    onDeleteItem(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <InventoryStatsCards items={items} />

      <InventoryToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={inventoryCategories}
        onAddItem={() => setFormTarget('new')}
      />

      <InventoryTable
        rows={pageItems}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        page={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onAddStock={(item) => setStockTarget({ item, mode: 'add' })}
        onRemoveStock={(item) => setStockTarget({ item, mode: 'remove' })}
        onAdjustStock={(item) => setStockTarget({ item, mode: 'adjust' })}
        onViewHistory={setHistoryTarget}
        onEdit={setFormTarget}
        onDelete={setDeleteTarget}
      />

      {formTarget && (
        <InventoryFormModal
          item={formTarget === 'new' ? null : formTarget}
          categories={inventoryCategories}
          onSubmit={handleFormSubmit}
          onClose={() => setFormTarget(null)}
        />
      )}

      {stockTarget && (
        <StockActionModal
          item={stockTarget.item}
          mode={stockTarget.mode}
          onConfirm={onStockAction}
          onClose={() => setStockTarget(null)}
        />
      )}

      {historyTarget && <StockHistoryModal item={historyTarget} onClose={() => setHistoryTarget(null)} />}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete inventory item"
          message={`Delete "${deleteTarget.name}"? Its stock history will be permanently removed too.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
