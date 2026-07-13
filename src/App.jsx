import { useMemo, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import ApprovalsPage from './pages/ApprovalsPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import ActivityLogPage from './pages/ActivityLogPage.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
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

export default function App() {
  const [role, setRole] = useState(currentUser.role)
  const [expenses, setExpenses] = useState(initialExpenses)
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

  function handleAddExpense(data) {
    const record = {
      id: `exp-${Date.now()}`,
      status: 'pending_approval',
      submitted_by: currentUser.full_name,
      created_at: new Date().toISOString(),
      ...data
    }
    setExpenses((prev) => [record, ...prev])
  }

  function handleUpdateExpense(id, data) {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
  }

  function handleDeleteExpense(id) {
    setExpenses((prev) => prev.filter((e) => e.id !== id))
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
    <Routes>
      <Route
        element={
          <Layout
            officeName={office.name}
            userName={currentUser.full_name}
            role={role}
            roles={roles}
            onRoleChange={setRole}
            dateLabel="13 Jul 2026"
          />
        }
      >
        <Route
          index
          element={
            <DashboardPage
              expenses={expenses}
              approvals={approvals}
              taskList={taskList}
              notifications={notifications}
              inventoryAlerts={inventoryAlerts}
              activityFeed={activityFeed}
              monthTotal={monthTotal}
              overdueCount={overdueCount}
              staffCount={staffCount}
              activeDocuments={activeDocuments}
              canApprove={canApprove}
              onDecide={handleDecide}
              onToggleTask={handleToggleTask}
              onMarkRead={handleMarkRead}
            />
          }
        />

        <Route
          path="expenses"
          element={
            <ExpensesPage
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          }
        />

        <Route
          path="approvals"
          element={<ApprovalsPage approvals={approvals} onDecide={handleDecide} canApprove={canApprove} />}
        />

        <Route path="inventory" element={<InventoryPage items={inventoryAlerts} />} />

        <Route
          path="staff"
          element={
            <PlaceholderPage
              title="Staff Directory"
              message="Staff records, roles and contact details will live here."
            />
          }
        />

        <Route path="tasks" element={<TasksPage tasks={taskList} onToggle={handleToggleTask} />} />

        <Route
          path="notifications"
          element={<NotificationsPage notifications={notifications} onMarkRead={handleMarkRead} />}
        />

        <Route path="activity-log" element={<ActivityLogPage logs={activityFeed} />} />

        <Route
          path="documents"
          element={
            <PlaceholderPage
              title="Documents"
              message="Contracts, licenses and office paperwork will be filed here."
            />
          }
        />

        <Route
          path="settings"
          element={
            <PlaceholderPage
              title="Settings"
              message="Office profile, roles and permissions will be configured here."
            />
          }
        />

        <Route
          path="*"
          element={<PlaceholderPage title="Page not found" message="That page doesn't exist yet." />}
        />
      </Route>
    </Routes>
  )
}
