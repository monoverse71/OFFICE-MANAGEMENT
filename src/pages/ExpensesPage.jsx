import { useMemo, useState } from 'react'
import ExpenseStatsCards from '../features/expenses/components/ExpenseStatsCards.jsx'
import ExpensesToolbar from '../features/expenses/components/ExpensesToolbar.jsx'
import ExpensesTable from '../features/expenses/components/ExpensesTable.jsx'
import ExpenseFormModal from '../features/expenses/components/ExpenseFormModal.jsx'
import ExpenseDetailsModal from '../features/expenses/components/ExpenseDetailsModal.jsx'
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx'
import { applyExpenseFilters, sortExpenses, paginate, DEFAULT_FILTERS } from '../features/expenses/utils/expenseFilters.js'
import { expenseCategories } from '../data/dummyData.js'

const PAGE_SIZE = 10

export default function ExpensesPage({
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onSubmitForApproval,
  catalogue,
  onCreateItem
}) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [sortBy, setSortBy] = useState('expense_date')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)

  const [formTarget, setFormTarget] = useState(null) // null | 'new' | expense object
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filtered = useMemo(() => applyExpenseFilters(expenses, filters), [expenses, filters])
  const sorted = useMemo(() => sortExpenses(filtered, sortBy, sortDir), [filtered, sortBy, sortDir])
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

  function handleFormSubmit(data, action) {
    if (formTarget && formTarget !== 'new') {
      onUpdateExpense(formTarget.id, data)
    } else {
      onAddExpense(data, action === 'submit')
    }
  }

  function handleDeleteConfirm() {
    onDeleteExpense(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <ExpenseStatsCards expenses={expenses} />

      <ExpensesToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={expenseCategories}
        onAddExpense={() => setFormTarget('new')}
      />

      <ExpensesTable
        rows={pageItems}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        page={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        onView={setViewTarget}
        onEdit={setFormTarget}
        onDelete={setDeleteTarget}
        onSubmitForApproval={onSubmitForApproval}
      />

      {formTarget && (
        <ExpenseFormModal
          expense={formTarget === 'new' ? null : formTarget}
          categories={expenseCategories}
          catalogue={catalogue}
          onCreateItem={onCreateItem}
          onSubmit={handleFormSubmit}
          onClose={() => setFormTarget(null)}
        />
      )}

      {viewTarget && <ExpenseDetailsModal expense={viewTarget} onClose={() => setViewTarget(null)} />}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete expense"
          message={`Delete "${deleteTarget.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
