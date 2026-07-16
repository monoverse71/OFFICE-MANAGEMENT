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
import StaffPage from './pages/StaffPage.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'
import { formatBDT } from './utils.js'
import { nextEmployeeId } from './features/staff/utils/staffFilters.js'
import { usePersistentState } from './hooks/usePersistentState.js'
import {
  office,
  currentUser,
  roles,
  expenses as initialExpenses,
  approvalRequests as initialApprovalRequests,
  tasks as initialTasks,
  inventoryAlerts as initialInventoryAlerts,
  notifications as initialNotifications,
  activityFeed as initialActivityFeed,
  staff as initialStaff,
  itemCatalogue as initialItemCatalogue,
  activeDocuments
} from './data/dummyData.js'

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export default function App() {
  const [role, setRole] = useState(currentUser.role)
  const [expenses, setExpenses] = usePersistentState('expenses', initialExpenses)
  const [approvalRequests, setApprovalRequests] = usePersistentState('approvalRequests', initialApprovalRequests)
  const [taskList, setTaskList] = usePersistentState('tasks', initialTasks)
  const [notifications, setNotifications] = usePersistentState('notifications', initialNotifications)
  const [activityLog, setActivityLog] = usePersistentState('activityLog', initialActivityFeed)
  const [staffList, setStaffList] = usePersistentState('staff', initialStaff)
  const [inventoryAlerts] = usePersistentState('inventory', initialInventoryAlerts)
  const [itemCatalogue, setItemCatalogue] = usePersistentState('itemCatalogue', initialItemCatalogue)

  const canApprove = role === 'Chairman' || role === 'Vice Chairman' || role === 'Super Admin'

  // Only expenses that have cleared approval count toward the Dashboard's
  // financial KPIs — a pending or rejected request must never move this
  // number. Once approved, the *approved* amount is what's counted (the
  // requested amount is preserved separately and never used here).
  const monthTotal = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.approved_amount != null ? e.approved_amount : 0), 0),
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

  // Saves a new item → category mapping to the master catalogue so the
  // same item auto-assigns its category every time it's selected again.
  // Reusable later by Inventory, Purchase, and Reports — same shape.
  function handleCreateCatalogueItem(name, category) {
    const trimmed = name.trim()
    if (!trimmed || !category) return
    setItemCatalogue((prev) => {
      if (prev.some((it) => it.name.toLowerCase() === trimmed.toLowerCase())) return prev
      return [...prev, { id: makeId('itm'), name: trimmed, category }]
    })
  }

  function handleAddExpense(data, submitForApproval) {
    const id = makeId('exp')
    const now = new Date().toISOString()
    const record = {
      id,
      status: submitForApproval ? 'pending_approval' : 'draft',
      submitted_by: currentUser.full_name,
      created_at: now,
      ...data
    }
    setExpenses((prev) => [record, ...prev])

    if (submitForApproval) {
      const request = {
        id: makeId('apr'),
        expense_id: id,
        status: 'pending_approval',
        requested_by: record.submitted_by,
        requested_at: now,
        decided_by: null,
        decided_at: null,
        comment: null,
        rejection_reason: null
      }
      setApprovalRequests((prev) => [request, ...prev])
      pushActivity(record.submitted_by, 'submit', `Submitted "${record.title}" for approval`)
      pushNotification(
        'New Approval Request',
        `${record.submitted_by} submitted "${record.title}" — ${formatBDT(record.amount)}`
      )
    }
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

  function handleApproveRequest(requestId, decision) {
    const request = approvalRequests.find((r) => r.id === requestId)
    if (!request) return
    const expense = expenses.find((e) => e.id === request.expense_id)
    const now = new Date().toISOString()

    const approvedAmount = decision?.approvedAmount ?? (expense ? expense.amount : 0)
    const paymentMethod = decision?.paymentMethod ?? null
    const paymentDate = decision?.paymentDate ?? now.slice(0, 10)
    const note = decision?.note ? decision.note.trim() : null

    setApprovalRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'approved',
              decided_by: currentUser.full_name,
              decided_at: now,
              comment: note,
              approved_amount: approvedAmount,
              payment_method: paymentMethod,
              payment_date: paymentDate
            }
          : r
      )
    )
    // The requested amount (expense.amount) is never touched — approved_amount
    // is stored separately so both values survive for reporting/history.
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === request.expense_id
          ? {
              ...e,
              status: 'approved',
              approved_amount: approvedAmount,
              payment_method: paymentMethod,
              payment_date: paymentDate,
              approval_note: note,
              approved_by: currentUser.full_name,
              approved_at: now
            }
          : e
      )
    )
    pushActivity(
      currentUser.full_name,
      'approve',
      `Approved expense "${expense ? expense.title : request.expense_id}" — ${formatBDT(approvedAmount)}`
    )
    pushNotification(
      'Expense Approved',
      `${currentUser.full_name} approved "${expense ? expense.title : request.expense_id}" — ${formatBDT(approvedAmount)}`
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

  // Quick actions from the Dashboard widget approve at the full requested
  // amount via Cash, dated today — a fast path; the Approvals page itself
  // still requires the full confirmation form before a decision can be made.
  function handleDashboardDecide(requestId, decision) {
    if (decision === 'approved') {
      const request = approvalRequests.find((r) => r.id === requestId)
      const expense = request ? expenses.find((e) => e.id === request.expense_id) : null
      handleApproveRequest(requestId, {
        approvedAmount: expense ? expense.amount : 0,
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().slice(0, 10),
        note: 'Quick-approved from the Dashboard'
      })
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

  function handleAddStaff(data) {
    const record = {
      id: nextEmployeeId(staffList),
      created_at: new Date().toISOString(),
      ...data
    }
    setStaffList((prev) => [record, ...prev])
    pushActivity(currentUser.full_name, 'create', `Added "${record.full_name}" to the Staff Directory`)
  }

  function handleUpdateStaff(id, data) {
    setStaffList((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
  }

  function handleDeleteStaff(id) {
    const employee = staffList.find((s) => s.id === id)
    setStaffList((prev) => prev.filter((s) => s.id !== id))
    if (employee) {
      pushActivity(currentUser.full_name, 'delete', `Removed "${employee.full_name}" from the Staff Directory`)
    }
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
            dateLabel={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
              staffCount={staffList.length}
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
              catalogue={itemCatalogue}
              onCreateItem={handleCreateCatalogueItem}
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
            <StaffPage
              staff={staffList}
              onAddEmployee={handleAddStaff}
              onUpdateEmployee={handleUpdateStaff}
              onDeleteEmployee={handleDeleteStaff}
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
