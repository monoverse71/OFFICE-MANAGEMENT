import { useMemo, useState } from 'react'
import { Receipt, Clock3, PackageX, ListChecks } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import StatCard from './components/StatCard.jsx'
import ExpensesTable from './components/ExpensesTable.jsx'
import ApprovalsPanel from './components/ApprovalsPanel.jsx'
import TasksPanel from './components/TasksPanel.jsx'
import NotificationsPanel from './components/NotificationsPanel.jsx'
import InventoryAlerts from './components/InventoryAlerts.jsx'
import ActivityFeed from './components/ActivityFeed.jsx'
import {
  office,
  currentUser,
  roles,
  expenses as initialExpenses,
  pendingApprovals as initialApprovals,
  tasks as initialTasks,
  inventoryAlerts,
  notifications as initialNotifications,
  activityFeed,
  staffCount,
  activeDocuments
} from './data/dummyData.js'
import { formatBDT } from './utils.js'

export default function App() {
  const [role, setRole] = useState(currentUser.role)
  const [expenses] = useState(initialExpenses)
  const [approvals, setApprovals] = useState(initialApprovals)
  const [taskList, setTaskList] = useState(initialTasks)
  const [notifications, setNotifications] = useState(initialNotifications)

  const monthTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  )

  const overdueCount = useMemo(
    () => taskList.filter((t) => t.status === 'overdue').length,
    [taskList]
  )

  function handleDecide(id, decision) {
    setApprovals((prev) => prev.filter((a) => a.id !== id))
  }

  function handleToggleTask(id) {
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' }
          : t
      )
    )
  }

  function handleMarkRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const canApprove = role === 'Chairman' || role === 'Vice Chairman'

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar officeName={office.name} />

      <div className="flex-1 min-w-0">
        <Topbar
          userName={currentUser.full_name}
          role={role}
          roles={roles}
          onRoleChange={setRole}
          dateLabel="13 Jul 2026"
        />

        <main className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto space-y-8">
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
              sub={canApprove ? 'Awaiting your decision' : 'Awaiting Chairman / VC'}
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
                <TasksPanel tasks={taskList} onToggle={handleToggleTask} />
                <InventoryAlerts items={inventoryAlerts} />
              </div>
            </div>

            <div className="space-y-6">
              <ApprovalsPanel approvals={approvals} onDecide={handleDecide} canApprove={canApprove} />
              <NotificationsPanel notifications={notifications} onMarkRead={handleMarkRead} />
              <ActivityFeed logs={activityFeed} />
            </div>
          </section>

          <footer className="pt-4 pb-2 text-center text-xs text-ink-muted font-body">
            Dashboard module — built on dummy data per the approved database design. Other modules to follow.
          </footer>
        </main>
      </div>
    </div>
  )
}
