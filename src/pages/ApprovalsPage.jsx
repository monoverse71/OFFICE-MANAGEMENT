import { useMemo, useState } from 'react'
import ApprovalsToolbar from '../features/approvals/components/ApprovalsToolbar.jsx'
import ApprovalRequestsTable from '../features/approvals/components/ApprovalRequestsTable.jsx'
import ApprovalDetailsModal from '../features/approvals/components/ApprovalDetailsModal.jsx'
import {
  DEFAULT_APPROVAL_FILTERS,
  enrichRequests,
  applyApprovalFilters,
  sortByRequestedDate
} from '../features/approvals/utils/approvalFilters.js'

export default function ApprovalsPage({ requests, expenses, canApprove, onApprove, onReject, companySettings }) {
  const [filters, setFilters] = useState(DEFAULT_APPROVAL_FILTERS)
  const [reviewing, setReviewing] = useState(null)

  const enriched = useMemo(() => enrichRequests(requests, expenses), [requests, expenses])

  const counts = useMemo(
    () => ({
      pending_approval: enriched.filter((r) => r.status === 'pending_approval').length,
      approved: enriched.filter((r) => r.status === 'approved').length,
      rejected: enriched.filter((r) => r.status === 'rejected').length,
      all: enriched.length
    }),
    [enriched]
  )

  const filtered = useMemo(() => applyApprovalFilters(enriched, filters), [enriched, filters])
  const sorted = useMemo(() => sortByRequestedDate(filtered), [filtered])

  // Keep the reviewed request in sync with live data while the modal is open
  // (e.g. right after approving, so the modal reflects the new status).
  const activeRequest = reviewing ? enriched.find((r) => r.id === reviewing.id) || null : null

  return (
    <div className="space-y-6">
      <ApprovalsToolbar filters={filters} onFilterChange={setFilters} counts={counts} />

      <ApprovalRequestsTable rows={sorted} onReview={setReviewing} />

      {activeRequest && (
        <ApprovalDetailsModal
          request={activeRequest}
          canApprove={canApprove}
          companySettings={companySettings}
          onApprove={onApprove}
          onReject={onReject}
          onClose={() => setReviewing(null)}
        />
      )}
    </div>
  )
}
