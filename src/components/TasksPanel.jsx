import { formatDate } from '../utils.js'

const PRIORITY_STYLES = {
  low: 'bg-ink-muted',
  medium: 'bg-brass',
  high: 'bg-amber',
  urgent: 'bg-rust'
}

export default function TasksPanel({ tasks, onToggle }) {
  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="px-5 py-4 border-b border-hairline">
        <h2 className="font-display text-lg">Today's Tasks</h2>
        <p className="text-xs text-ink-muted font-body">Tap a task to mark it complete</p>
      </div>

      <ul className="divide-y divide-hairline/70">
        {tasks.map((t) => {
          const done = t.status === 'completed'
          const overdue = t.status === 'overdue'
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onToggle(t.id)}
                className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-paper/60 transition-colors"
              >
                <span
                  className={`w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center ${
                    done ? 'bg-forest border-forest' : 'border-ink-muted/50'
                  }`}
                >
                  {done && <span className="w-1.5 h-1.5 bg-paper rounded-[1px]" />}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_STYLES[t.priority]}`} title={t.priority} />
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-body truncate ${done ? 'line-through text-ink-muted' : ''}`}>
                    {t.title}
                  </span>
                  <span className="block text-xs text-ink-muted font-body mt-0.5">{t.assigned_to}</span>
                </span>
                <span className={`font-mono text-xs shrink-0 ${overdue && !done ? 'text-rust' : 'text-ink-muted'}`}>
                  {overdue && !done ? 'Overdue · ' : 'Due '}
                  {formatDate(t.due_date)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
