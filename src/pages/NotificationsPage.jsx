import NotificationsPanel from '../components/NotificationsPanel.jsx'

export default function NotificationsPage({ notifications, onMarkRead }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-display text-2xl leading-tight">Notifications</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Alerts and updates from across the system.</p>
      </div>
      <NotificationsPanel notifications={notifications} onMarkRead={onMarkRead} />
    </div>
  )
}
