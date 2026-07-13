import TasksPanel from '../components/TasksPanel.jsx'

export default function TasksPage({ tasks, onToggle }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-display text-2xl leading-tight">Tasks</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Everything assigned across the office this week.</p>
      </div>
      <TasksPanel tasks={tasks} onToggle={onToggle} />
    </div>
  )
}
