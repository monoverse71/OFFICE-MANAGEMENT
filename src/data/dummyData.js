// Dummy data shaped to mirror the database design's tables.
// In the real build, each of these would come from a Supabase query
// scoped by office_id via RLS.

export const office = {
  id: 'off-001',
  name: 'Apon Niketon Holdings — Head Office',
  timezone: 'Asia/Dhaka',
  currency: 'BDT'
}

export const currentUser = {
  id: 'usr-001',
  full_name: 'Jihad Rahman',
  role: 'Chairman' // switchable in the UI: Chairman, Vice Chairman, Super Admin, Admin
}

export const roles = ['Chairman', 'Vice Chairman', 'Super Admin', 'Admin']

// statuses.module_key = 'expenses'
export const expenseStatuses = {
  draft: { code: 'draft', label: 'Draft' },
  pending_approval: { code: 'pending_approval', label: 'Pending Approval' },
  approved: { code: 'approved', label: 'Approved' },
  rejected: { code: 'rejected', label: 'Rejected' },
  paid: { code: 'paid', label: 'Paid' },
  archived: { code: 'archived', label: 'Archived' }
}

export const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'mobile_banking', label: 'Mobile Banking' },
  { value: 'card', label: 'Card' }
]

export const expenseCategories = [
  { id: 'cat-1', name: 'Utilities' },
  { id: 'cat-2', name: 'Rent' },
  { id: 'cat-3', name: 'Maintenance' },
  { id: 'cat-4', name: 'Refreshments' },
  { id: 'cat-5', name: 'Travel' },
  { id: 'cat-6', name: 'Courier & Logistics' },
  { id: 'cat-7', name: 'Marketing' }
]

export const expenses = [
  { id: 'exp-1001', title: 'Office electricity bill — June', description: 'Monthly electricity bill for the head office floor.', category: 'Utilities', amount: 8450, expense_date: '2026-07-11', payment_method: 'bank', status: 'pending_approval', submitted_by: 'Nasrin Akter', created_at: '2026-07-11T09:10:00' },
  { id: 'exp-1002', title: 'Godown rent — July', description: 'Monthly rent for the Mirpur godown.', category: 'Rent', amount: 45000, expense_date: '2026-07-10', payment_method: 'bank', status: 'approved', submitted_by: 'Jihad Rahman', created_at: '2026-07-10T08:00:00' },
  { id: 'exp-1003', title: 'AC servicing, 2nd floor', description: 'Annual AC gas refill and filter cleaning.', category: 'Maintenance', amount: 3200, expense_date: '2026-07-09', payment_method: 'cash', status: 'paid', submitted_by: 'Kamal Hossain', created_at: '2026-07-09T11:30:00' },
  { id: 'exp-1004', title: 'Client meeting refreshments', description: 'Snacks and tea for the supplier meeting.', category: 'Refreshments', amount: 1650, expense_date: '2026-07-09', payment_method: 'mobile_banking', status: 'pending_approval', submitted_by: 'Nasrin Akter', created_at: '2026-07-09T15:20:00' },
  { id: 'exp-1005', title: 'Chattogram supplier visit — fuel & toll', description: 'Round trip to the Chattogram supplier warehouse.', category: 'Travel', amount: 5200, expense_date: '2026-07-08', payment_method: 'cash', status: 'approved', submitted_by: 'Shakil Ahmed', created_at: '2026-07-08T18:00:00' },
  { id: 'exp-1006', title: 'Courier — Sundarban parcel dispatch', description: 'Bulk parcel dispatch for pending orders.', category: 'Courier & Logistics', amount: 2100, expense_date: '2026-07-07', payment_method: 'mobile_banking', status: 'rejected', submitted_by: 'Kamal Hossain', created_at: '2026-07-07T10:15:00' },
  { id: 'exp-1007', title: 'Printer toner, 3 units', description: 'Toner restock for the front office printer.', category: 'Maintenance', amount: 4800, expense_date: '2026-07-06', payment_method: 'card', status: 'paid', submitted_by: 'Nasrin Akter', created_at: '2026-07-06T09:45:00' },
  { id: 'exp-1008', title: 'Internet bill — July', description: 'ISP subscription for the office.', category: 'Utilities', amount: 3000, expense_date: '2026-07-05', payment_method: 'bank', status: 'paid', submitted_by: 'Jihad Rahman', created_at: '2026-07-05T08:30:00' },
  { id: 'exp-1009', title: 'Staff lunch — Eid preparation', description: 'Team lunch before the shipment deadline.', category: 'Refreshments', amount: 6200, expense_date: '2026-07-03', payment_method: 'cash', status: 'approved', submitted_by: 'Kamal Hossain', created_at: '2026-07-03T13:00:00' },
  { id: 'exp-1010', title: 'Facebook page boost — Eid campaign', description: 'Ad boost for the ClicknCart Eid collection.', category: 'Marketing', amount: 4000, expense_date: '2026-07-02', payment_method: 'card', status: 'paid', submitted_by: 'Shakil Ahmed', created_at: '2026-07-02T12:00:00' },
  { id: 'exp-1011', title: 'Warehouse shelf repair', description: 'Carpenter charge for broken shelving.', category: 'Maintenance', amount: 2750, expense_date: '2026-06-29', payment_method: 'cash', status: 'paid', submitted_by: 'Kamal Hossain', created_at: '2026-06-29T16:00:00' },
  { id: 'exp-1012', title: 'Dhaka–Gazipur delivery van fuel', description: 'Fuel for the delivery run to Gazipur customers.', category: 'Travel', amount: 3100, expense_date: '2026-06-27', payment_method: 'cash', status: 'approved', submitted_by: 'Shakil Ahmed', created_at: '2026-06-27T17:20:00' },
  { id: 'exp-1013', title: 'Courier — Chattogram batch', description: 'Weekly courier batch to Chattogram customers.', category: 'Courier & Logistics', amount: 3450, expense_date: '2026-06-25', payment_method: 'mobile_banking', status: 'paid', submitted_by: 'Kamal Hossain', created_at: '2026-06-25T12:10:00' },
  { id: 'exp-1014', title: 'Office rent — June', description: 'Monthly rent for the head office.', category: 'Rent', amount: 45000, expense_date: '2026-06-10', payment_method: 'bank', status: 'paid', submitted_by: 'Jihad Rahman', created_at: '2026-06-10T08:00:00' },
  { id: 'exp-1015', title: 'Electricity bill — May', description: 'Monthly electricity settlement.', category: 'Utilities', amount: 7900, expense_date: '2026-06-08', payment_method: 'bank', status: 'paid', submitted_by: 'Nasrin Akter', created_at: '2026-06-08T08:40:00' },
  { id: 'exp-1016', title: 'New office chair — reception', description: 'Replacement chair for the reception desk.', category: 'Maintenance', amount: 6500, expense_date: '2026-06-05', payment_method: 'card', status: 'rejected', submitted_by: 'Kamal Hossain', created_at: '2026-06-05T10:00:00' },
  { id: 'exp-1017', title: 'Instagram promotion — Ramadan', description: 'Cross-posted ad promotion.', category: 'Marketing', amount: 3500, expense_date: '2026-06-02', payment_method: 'card', status: 'paid', submitted_by: 'Shakil Ahmed', created_at: '2026-06-02T14:00:00' },
  { id: 'exp-1018', title: 'Tea & snacks — board meeting', description: 'Refreshments for the monthly board meeting.', category: 'Refreshments', amount: 1200, expense_date: '2026-05-28', payment_method: 'cash', status: 'paid', submitted_by: 'Nasrin Akter', created_at: '2026-05-28T11:00:00' },
  { id: 'exp-1019', title: 'Generator fuel — load shedding week', description: 'Diesel for backup generator during outages.', category: 'Utilities', amount: 4200, expense_date: '2026-05-22', payment_method: 'cash', status: 'paid', submitted_by: 'Kamal Hossain', created_at: '2026-05-22T19:00:00' },
  { id: 'exp-1020', title: 'Courier — Sylhet batch', description: 'Weekly courier batch to Sylhet customers.', category: 'Courier & Logistics', amount: 2900, expense_date: '2026-05-18', payment_method: 'mobile_banking', status: 'paid', submitted_by: 'Kamal Hossain', created_at: '2026-05-18T12:30:00' },
  { id: 'exp-1021', title: 'Trade license renewal fee', description: 'Annual trade license government fee.', category: 'Rent', amount: 12000, expense_date: '2026-05-15', payment_method: 'bank', status: 'archived', submitted_by: 'Jihad Rahman', created_at: '2026-05-15T09:00:00' },
  { id: 'exp-1022', title: 'Draft — new signage estimate', description: 'Awaiting quote confirmation before submission.', category: 'Maintenance', amount: 9000, expense_date: '2026-05-12', payment_method: 'cash', status: 'draft', submitted_by: 'Kamal Hossain', created_at: '2026-05-12T10:20:00' },
  { id: 'exp-1023', title: 'Eid card printing', description: 'Printed greeting cards for key clients.', category: 'Marketing', amount: 1800, expense_date: '2026-05-09', payment_method: 'card', status: 'paid', submitted_by: 'Shakil Ahmed', created_at: '2026-05-09T13:40:00' },
  { id: 'exp-1024', title: 'Courier — Rajshahi batch', description: 'Weekly courier batch to Rajshahi customers.', category: 'Courier & Logistics', amount: 2600, expense_date: '2026-05-04', payment_method: 'mobile_banking', status: 'paid', submitted_by: 'Kamal Hossain', created_at: '2026-05-04T12:00:00' }
]

// approval_requests — one row per submission, linked to its expense.
// status: 'pending_approval' | 'approved' | 'rejected'
// Historical decided rows stay in this array permanently — that's the approval history.
export const approvalRequests = [
  {
    id: 'apr-1001',
    expense_id: 'exp-1001',
    status: 'pending_approval',
    requested_by: 'Nasrin Akter',
    requested_at: '2026-07-11T09:15:00',
    decided_by: null,
    decided_at: null,
    comment: null,
    rejection_reason: null
  },
  {
    id: 'apr-1004',
    expense_id: 'exp-1004',
    status: 'pending_approval',
    requested_by: 'Nasrin Akter',
    requested_at: '2026-07-09T15:25:00',
    decided_by: null,
    decided_at: null,
    comment: null,
    rejection_reason: null
  },
  {
    id: 'apr-1002',
    expense_id: 'exp-1002',
    status: 'approved',
    requested_by: 'Jihad Rahman',
    requested_at: '2026-07-10T08:05:00',
    decided_by: 'Jihad Rahman',
    decided_at: '2026-07-10T18:02:00',
    comment: 'Approved as budgeted.',
    rejection_reason: null
  },
  {
    id: 'apr-1006',
    expense_id: 'exp-1006',
    status: 'rejected',
    requested_by: 'Kamal Hossain',
    requested_at: '2026-07-07T10:20:00',
    decided_by: 'Jihad Rahman',
    decided_at: '2026-07-07T12:00:00',
    comment: null,
    rejection_reason: 'Duplicate of exp-1002 courier batch — already settled.'
  },
  {
    id: 'apr-1016',
    expense_id: 'exp-1016',
    status: 'rejected',
    requested_by: 'Kamal Hossain',
    requested_at: '2026-06-05T10:05:00',
    decided_by: 'Jihad Rahman',
    decided_at: '2026-06-05T11:00:00',
    comment: null,
    rejection_reason: 'Please route through the Purchases module instead of Expenses.'
  }
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
