import ApprovalsPanel from '../components/ApprovalsPanel.jsx'

export default function ApprovalsPage({ approvals, onDecide, canApprove }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-display text-2xl leading-tight">Approvals</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Requests waiting on Chairman / Vice Chairman sign-off.</p>
      </div>
      <ApprovalsPanel approvals={approvals} onDecide={onDecide} canApprove={canApprove} />
    </div>
  )
}
