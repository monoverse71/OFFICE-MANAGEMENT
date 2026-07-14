import { Receipt, Clock3, PackageX, ListChecks } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import ExpensesTable from '../components/ExpensesTable.jsx'
import ApprovalsPanel from '../components/ApprovalsPanel.jsx'
import TasksPanel from '../components/TasksPanel.jsx'
import NotificationsPanel from '../components/NotificationsPanel.jsx'
import InventoryAlerts from '../components/InventoryAlerts.jsx'
import ActivityFeed from '../components/ActivityFeed.jsx'
import { formatBDT } from '../utils.js'

export default function DashboardPage({
  expenses,
  approvals,
  taskList,
  notifications,
  inventoryAlerts,
  activityFeed,
  monthTotal,
  overdueCount,
  staffCount,
  activeDocuments,
  canApprove,
  onDecide,
  onToggleTask,
  onMarkRead
}) {
  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Expenses this month"
          value={formatBDT(monthTotal)}
          sub={`${expenses.length} entries logged`}
          icon={Receipt}
          accent="ink"
        />
        <StatCard
          label="Pending approvals"
          value={approvals.length}
          sub={canApprove ? 'Awaiting your decision' : 'Awaiting Chairman / VC / Super Admin'}
          icon={Clock3}
          accent="amber"
        />
        <StatCard
          label="Low stock items"
          value={inventoryAlerts.length}
          sub="Below reorder threshold"
          icon={PackageX}
          accent="rust"
        />
        <StatCard
          label="Overdue tasks"
          value={overdueCount}
          sub={`${staffCount} staff · ${activeDocuments} documents on file`}
          icon={ListChecks}
          accent="forest"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 space-y-6">
          <ExpensesTable expenses={expenses} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TasksPanel tasks={taskList} onToggle={onToggleTask} />
            <InventoryAlerts items={inventoryAlerts} />
          </div>
        </div>

        <div className="space-y-6">
          <ApprovalsPanel approvals={approvals} onDecide={onDecide} canApprove={canApprove} />
          <NotificationsPanel notifications={notifications} onMarkRead={onMarkRead} />
          <ActivityFeed logs={activityFeed} />
        </div>
      </section>

      <footer className="pt-4 pb-2 text-center text-xs text-ink-muted font-body">
        Dashboard module — built on dummy data per the approved database design. Other modules to follow.
      </footer>
    </>
  )
}
