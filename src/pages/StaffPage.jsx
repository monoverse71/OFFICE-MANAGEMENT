import { useMemo, useState } from 'react'
import StaffToolbar from '../features/staff/components/StaffToolbar.jsx'
import StaffTable from '../features/staff/components/StaffTable.jsx'
import StaffFormModal from '../features/staff/components/StaffFormModal.jsx'
import StaffDetailsModal from '../features/staff/components/StaffDetailsModal.jsx'
import ConfirmDialog from '../components/shared/ConfirmDialog.jsx'
import { DEFAULT_STAFF_FILTERS, applyStaffFilters, departmentOptions } from '../features/staff/utils/staffFilters.js'

export default function StaffPage({ staff, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) {
  const [filters, setFilters] = useState(DEFAULT_STAFF_FILTERS)
  const [formTarget, setFormTarget] = useState(null) // null | 'new' | employee object
  const [viewTarget, setViewTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const departments = useMemo(() => departmentOptions(staff), [staff])
  const filtered = useMemo(() => applyStaffFilters(staff, filters), [staff, filters])

  function handleFormSubmit(data) {
    if (formTarget && formTarget !== 'new') {
      onUpdateEmployee(formTarget.id, data)
    } else {
      onAddEmployee(data)
    }
  }

  function handleDeleteConfirm() {
    onDeleteEmployee(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <StaffToolbar
        filters={filters}
        onFilterChange={setFilters}
        departments={departments}
        onAddEmployee={() => setFormTarget('new')}
      />

      <StaffTable
        rows={filtered}
        onView={setViewTarget}
        onEdit={setFormTarget}
        onDelete={setDeleteTarget}
      />

      {formTarget && (
        <StaffFormModal
          employee={formTarget === 'new' ? null : formTarget}
          onSubmit={handleFormSubmit}
          onClose={() => setFormTarget(null)}
        />
      )}

      {viewTarget && <StaffDetailsModal employee={viewTarget} onClose={() => setViewTarget(null)} />}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete employee"
          message={`Delete "${deleteTarget.full_name}" from the directory? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
