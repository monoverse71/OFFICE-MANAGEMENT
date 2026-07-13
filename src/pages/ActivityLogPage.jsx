import ActivityFeed from '../components/ActivityFeed.jsx'

export default function ActivityLogPage({ logs }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-display text-2xl leading-tight">Activity Log</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Company-wide audit trail, most recent first.</p>
      </div>
      <ActivityFeed logs={logs} />
    </div>
  )
}
