import { timeAgo } from '../utils.js'

export default function NotificationsPanel({ notifications, onMarkRead }) {
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
        <h2 className="font-display text-lg">Notifications</h2>
        {unreadCount > 0 && (
          <span className="font-mono text-xs px-2 py-1 rounded-sm bg-rust/10 text-rust border border-rust/30">
            {unreadCount} unread
          </span>
        )}
      </div>

      <ul className="divide-y divide-hairline/70 max-h-[340px] overflow-y-auto">
        {notifications.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              onClick={() => onMarkRead(n.id)}
              className="w-full flex items-start gap-3 px-5 py-3 text-left hover:bg-paper/60 transition-colors"
            >
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.is_read ? 'bg-transparent' : 'bg-brass'}`} />
              <span className="flex-1 min-w-0">
                <span className={`block text-sm font-body ${n.is_read ? 'text-ink-muted' : 'text-ink font-medium'}`}>
                  {n.title}
                </span>
                <span className="block text-xs text-ink-muted font-body mt-0.5 truncate">{n.message}</span>
              </span>
              <span className="font-mono text-[11px] text-ink-muted shrink-0">{timeAgo(n.created_at)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
