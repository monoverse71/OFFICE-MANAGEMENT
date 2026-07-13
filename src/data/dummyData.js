// Dummy data shaped to mirror the database design's tables.
// In the real build, each of these would come from a Supabase query
// scoped by office_id via RLS.

export const office = {
  id: 'off-001',
  name: 'ClicknCart Trading — Head Office',
  timezone: 'Asia/Dhaka',
  currency: 'BDT'
}

export const currentUser = {
  id: 'usr-001',
  full_name: 'Jihad Rahman',
  role: 'Chairman' // switchable in the UI: Chairman, Vice Chairman, Admin, Employee
}

export const roles = ['Chairman', 'Vice Chairman', 'Admin', 'Employee']

// statuses.module_key = 'expenses'
export const expenseStatuses = {
  draft: { code: 'draft', label: 'Draft' },
  pending_approval: { code: 'pending_approval', label: 'Pending Approval' },
  approved: { code: 'approved', label: 'Approved' },
  rejected: { code: 'rejected', label: 'Rejected' },
  paid: { code: 'paid', label: 'Paid' },
  archived: { code: 'archived', label: 'Archived' }
}

export const expenseCategories = [
  { id: 'cat-1', name: 'Utilities' },
  { id: 'cat-2', name: 'Rent' },
  { id: 'cat-3', name: 'Maintenance' },
  { id: 'cat-4', name: 'Refreshments' },
  { id: 'cat-5', name: 'Travel' },
  { id: 'cat-6', name: 'Courier & Logistics' }
]

export const expenses = [
  { id: 'exp-1001', title: 'Office electricity bill — June', category: 'Utilities', amount: 8450, expense_date: '2026-07-11', payment_method: 'bank', status: 'pending_approval', submitted_by: 'Nasrin Akter' },
  { id: 'exp-1002', title: 'Godown rent — July', category: 'Rent', amount: 45000, expense_date: '2026-07-10', payment_method: 'bank', status: 'approved', submitted_by: 'Jihad Rahman' },
  { id: 'exp-1003', title: 'AC servicing, 2nd floor', category: 'Maintenance', amount: 3200, expense_date: '2026-07-09', payment_method: 'cash', status: 'paid', submitted_by: 'Kamal Hossain' },
  { id: 'exp-1004', title: 'Client meeting refreshments', category: 'Refreshments', amount: 1650, expense_date: '2026-07-09', payment_method: 'mobile_banking', status: 'pending_approval', submitted_by: 'Nasrin Akter' },
  { id: 'exp-1005', title: 'Chattogram supplier visit — fuel & toll', category: 'Travel', amount: 5200, expense_date: '2026-07-08', payment_method: 'cash', status: 'approved', submitted_by: 'Shakil Ahmed' },
  { id: 'exp-1006', title: 'Courier — Sundarban parcel dispatch', category: 'Courier & Logistics', amount: 2100, expense_date: '2026-07-07', payment_method: 'mobile_banking', status: 'rejected', submitted_by: 'Kamal Hossain' },
  { id: 'exp-1007', title: 'Printer toner, 3 units', category: 'Maintenance', amount: 4800, expense_date: '2026-07-06', payment_method: 'card', status: 'paid', submitted_by: 'Nasrin Akter' },
  { id: 'exp-1008', title: 'Internet bill — July', category: 'Utilities', amount: 3000, expense_date: '2026-07-05', payment_method: 'bank', status: 'paid', submitted_by: 'Jihad Rahman' }
]

// approval_requests + approval_actions, flattened for the dashboard view
export const pendingApprovals = [
  { id: 'apr-1', module: 'Expense', record_title: 'Office electricity bill — June', amount: 8450, requested_by: 'Nasrin Akter', requested_at: '2026-07-11', threshold: 5000 },
  { id: 'apr-2', module: 'Expense', record_title: 'Client meeting refreshments', amount: 1650, requested_by: 'Nasrin Akter', requested_at: '2026-07-09', threshold: 5000 },
  { id: 'apr-3', module: 'Purchase', record_title: '2x office chairs — ergonomic', amount: 18500, requested_by: 'Kamal Hossain', requested_at: '2026-07-08', threshold: 15000 }
]

// tasks
export const tasks = [
  { id: 'tsk-1', title: 'Reconcile July utility bills', assigned_to: 'Nasrin Akter', priority: 'high', due_date: '2026-07-14', status: 'in_progress' },
  { id: 'tsk-2', title: 'Renew trade license', assigned_to: 'Jihad Rahman', priority: 'urgent', due_date: '2026-07-15', status: 'todo' },
  { id: 'tsk-3', title: 'Vendor call — packaging supplier', assigned_to: 'Shakil Ahmed', priority: 'medium', due_date: '2026-07-13', status: 'todo' },
  { id: 'tsk-4', title: 'Staff attendance sheet — June close', assigned_to: 'Kamal Hossain', priority: 'low', due_date: '2026-07-20', status: 'todo' },
  { id: 'tsk-5', title: 'Submit VAT return draft', assigned_to: 'Jihad Rahman', priority: 'urgent', due_date: '2026-07-12', status: 'overdue' }
]

// inventory_items — flagged where quantity <= low_stock_threshold
export const inventoryAlerts = [
  { id: 'inv-1', name: 'A4 printing paper (ream)', category: 'Stationery', quantity: 2, threshold: 5, asset_code: 'STA-0042' },
  { id: 'inv-2', name: 'Toner cartridge — HP 26A', category: 'Electronics', quantity: 0, threshold: 2, asset_code: 'ELE-0117' },
  { id: 'inv-3', name: 'Packing tape rolls', category: 'Stationery', quantity: 4, threshold: 10, asset_code: 'STA-0088' }
]

// notifications
export const notifications = [
  { id: 'ntf-1', title: 'Expense awaiting your approval', message: 'Nasrin Akter submitted "Office electricity bill — June" — ৳8,450', is_read: false, created_at: '2026-07-11T09:20:00' },
  { id: 'ntf-2', title: 'Low stock alert', message: 'Toner cartridge — HP 26A is out of stock', is_read: false, created_at: '2026-07-11T07:05:00' },
  { id: 'ntf-3', title: 'Task overdue', message: '"Submit VAT return draft" was due yesterday', is_read: false, created_at: '2026-07-13T06:00:00' },
  { id: 'ntf-4', title: 'Document expiring soon', message: 'Office rental agreement expires in 18 days', is_read: true, created_at: '2026-07-10T11:40:00' },
  { id: 'ntf-5', title: 'Purchase approved', message: 'Vice Chairman approved "2x office chairs"', is_read: true, created_at: '2026-07-09T15:10:00' }
]

// activity_logs — most recent first
export const activityFeed = [
  { id: 'log-1', actor: 'Jihad Rahman', action: 'approve', detail: 'Approved expense "Godown rent — July"', occurred_at: '2026-07-10T18:02:00' },
  { id: 'log-2', actor: 'Nasrin Akter', action: 'create', detail: 'Submitted expense "Client meeting refreshments"', occurred_at: '2026-07-09T14:33:00' },
  { id: 'log-3', actor: 'Kamal Hossain', action: 'update', detail: 'Updated inventory item "Toner cartridge — HP 26A"', occurred_at: '2026-07-09T10:15:00' },
  { id: 'log-4', actor: 'Shakil Ahmed', action: 'create', detail: 'Logged travel expense for Chattogram visit', occurred_at: '2026-07-08T17:47:00' },
  { id: 'log-5', actor: 'System', action: 'login', detail: 'Jihad Rahman logged in', occurred_at: '2026-07-13T08:01:00' }
]

export const staffCount = 12
export const activeDocuments = 34
