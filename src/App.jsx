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
import { formatBDT } from './utils.js'
import {
  office,
  currentUser,
  roles,
  expenses as initialExpenses,
  approvalRequests as initialApprovalRequests,
  tasks as initialTasks,
  inventoryAlerts,
  notifications as initialNotifications,
  activityFeed as initialActivityFeed,
  staffCount,
  activeDocuments
} from './data/dummyData.js'

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export default function App() {
  const [role, setRole] = useState(currentUser.role)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [approvalRequests, setApprovalRequests] = useState(initialApprovalRequests)
  const [taskList, setTaskList] = useState(initialTasks)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activityLog, setActivityLog] = useState(initialActivityFeed)

  const canApprove = role === 'Chairman' || role === 'Vice Chairman'

  const monthTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses]
  )

  const overdueCount = useMemo(
    () => taskList.filter((t) => t.status === 'overdue').length,
    [taskList]
  )

  const pendingApprovalRequests = useMemo(
    () => approvalRequests.filter((r) => r.status === 'pending_approval'),
    [approvalRequests]
  )

  // Shaped to match the Dashboard's existing ApprovalsPanel widget contract
  // exactly, so that widget needs no changes at all.
  const dashboardApprovals = useMemo(
    () =>
      pendingApprovalRequests.map((r) => {
        const expense = expenses.find((e) => e.id === r.expense_id)
        return {
          id: r.id,
          module: 'Expense',
          record_title: expense ? expense.title : r.expense_id,
          amount: expense ? expense.amount : 0,
          requested_by: r.requested_by,
          requested_at: r.requested_at
        }
      }),
    [pendingApprovalRequests, expenses]
  )

  function pushActivity(actor, action, detail) {
    setActivityLog((prev) => [{ id: makeId('log'), actor, action, detail, occurred_at: new Date().toISOString() }, ...prev])
  }

  function pushNotification(title, message) {
    setNotifications((prev) => [
      { id: makeId('ntf'), title, message, is_read: false, created_at: new Date().toISOString() },
      ...prev
    ])
  }

  function handleAddExpense(data) {
    const record = {
      id: makeId('exp'),
      status: 'draft',
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

  // Expense Created -> Draft. This is the workflow entry point: a draft
  // expense becomes Pending Approval and an approval request is created.
  function handleSubmitForApproval(expenseId) {
    const expense = expenses.find((e) => e.id === expenseId)
    if (!expense || expense.status !== 'draft') return

    const now = new Date().toISOString()
    const request = {
      id: makeId('apr'),
      expense_id: expenseId,
      status: 'pending_approval',
      requested_by: expense.submitted_by,
      requested_at: now,
      decided_by: null,
      decided_at: null,
      comment: null,
      rejection_reason: null
    }

    setExpenses((prev) => prev.map((e) => (e.id === expenseId ? { ...e, status: 'pending_approval' } : e)))
    setApprovalRequests((prev) => [request, ...prev])
    pushActivity(expense.submitted_by, 'submit', `Submitted "${expense.title}" for approval`)
    pushNotification(
      'New Approval Request',
      `${expense.submitted_by} submitted "${expense.title}" — ${formatBDT(expense.amount)}`
    )
  }

  function handleApproveRequest(requestId, comment) {
    const request = approvalRequests.find((r) => r.id === requestId)
    if (!request) return
    const expense = expenses.find((e) => e.id === request.expense_id)
    const now = new Date().toISOString()

    setApprovalRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'approved', decided_by: currentUser.full_name, decided_at: now, comment: comment || null }
          : r
      )
    )
    setExpenses((prev) => prev.map((e) => (e.id === request.expense_id ? { ...e, status: 'approved' } : e)))
    pushActivity(currentUser.full_name, 'approve', `Approved expense "${expense ? expense.title : request.expense_id}"`)
    pushNotification(
      'Expense Approved',
      `${currentUser.full_name} approved "${expense ? expense.title : request.expense_id}"${expense ? ' — ' + formatBDT(expense.amount) : ''}`
    )
  }

  function handleRejectRequest(requestId, reason) {
    const request = approvalRequests.find((r) => r.id === requestId)
    if (!request) return
    const expense = expenses.find((e) => e.id === request.expense_id)
    const now = new Date().toISOString()
    const finalReason = reason && reason.trim() ? reason.trim() : 'No reason provided'

    setApprovalRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'rejected', decided_by: currentUser.full_name, decided_at: now, rejection_reason: finalReason }
          : r
      )
    )
    setExpenses((prev) =>
      prev.map((e) => (e.id === request.expense_id ? { ...e, status: 'rejected', rejected_reason: finalReason } : e))
    )
    pushActivity(currentUser.full_name, 'reject', `Rejected expense "${expense ? expense.title : request.expense_id}" — ${finalReason}`)
    pushNotification(
      'Expense Rejected',
      `${currentUser.full_name} rejected "${expense ? expense.title : request.expense_id}" — ${finalReason}`
    )
  }

  // Quick actions from the Dashboard widget don't collect a comment/reason.
  function handleDashboardDecide(requestId, decision) {
    if (decision === 'approved') {
      handleApproveRequest(requestId)
    } else {
      handleRejectRequest(requestId, 'Rejected from the Dashboard quick action')
    }
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
              approvals={dashboardApprovals}
              taskList={taskList}
              notifications={notifications}
              inventoryAlerts={inventoryAlerts}
              activityFeed={activityLog}
              monthTotal={monthTotal}
              overdueCount={overdueCount}
              staffCount={staffCount}
              activeDocuments={activeDocuments}
              canApprove={canApprove}
              onDecide={handleDashboardDecide}
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
              onSubmitForApproval={handleSubmitForApproval}
            />
          }
        />

        <Route
          path="approvals"
          element={
            <ApprovalsPage
              requests={approvalRequests}
              expenses={expenses}
              canApprove={canApprove}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          }
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

        <Route path="activity-log" element={<ActivityLogPage logs={activityLog} />} />

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
