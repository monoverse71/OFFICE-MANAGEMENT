import { timeAgo } from '../utils.js'

const ACTION_DOT = {
  create: 'bg-brass',
  update: 'bg-ink-muted',
  approve: 'bg-forest',
  reject: 'bg-rust',
  login: 'bg-ink-muted'
}

export default function ActivityFeed({ logs }) {
  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="px-5 py-4 border-b border-hairline">
        <h2 className="font-display text-lg">Activity Log</h2>
        <p className="text-xs text-ink-muted font-body">Company-wide audit trail, most recent first</p>
      </div>

      <ol className="px-5 py-4 space-y-4">
        {logs.map((log, i) => (
          <li key={log.id} className="relative pl-5">
            {i !== logs.length - 1 && (
              <span className="absolute left-[5px] top-3 bottom-[-16px] w-px bg-hairline" />
            )}
            <span className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${ACTION_DOT[log.action] || 'bg-ink-muted'}`} />
            <p className="text-sm font-body">
              <span className="font-medium">{log.actor}</span>{' '}
              <span className="text-ink-muted">{log.detail}</span>
            </p>
            <p className="text-[11px] font-mono text-ink-muted mt-0.5">{timeAgo(log.occurred_at)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
