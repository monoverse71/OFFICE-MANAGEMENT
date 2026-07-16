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
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'mobile_banking', label: 'Mobile Banking' },
  { value: 'card', label: 'Card' }
]

// Payment method is now chosen by the approver at approval time, not by
// whoever submits the expense request — this is the exact set they choose from.
export const approvalPaymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'bkash', label: 'bKash' },
  { value: 'nagad', label: 'Nagad' },
  { value: 'rocket', label: 'Rocket' },
  { value: 'cheque', label: 'Cheque' }
]

// Examples are guidance only for the category picker's helper text and
// search matching — they are never stored on an expense record.
export const expenseCategories = [
  { id: 'cat-1', name: 'Office Operations', examples: ['Rent', 'Utility Bills', 'Internet', 'Office Rent'] },
  { id: 'cat-2', name: 'Office Supplies', examples: ['Paper', 'Pen', 'File', 'Tea', 'Coffee', 'Water'] },
  { id: 'cat-3', name: 'IT & Electronics', examples: ['Laptop', 'Desktop', 'Printer', 'Router', 'CCTV', 'UPS'] },
  { id: 'cat-4', name: 'Furniture & Fixtures', examples: ['Chair', 'Table', 'Cabinet', 'Shelf', 'Sofa'] },
  { id: 'cat-5', name: 'Maintenance & Repair', examples: ['AC Servicing', 'Plumbing', 'Electrical Repair', 'Painting'] },
  { id: 'cat-6', name: 'Transport & Logistics', examples: ['Fuel', 'Courier', 'Delivery Van', 'Toll', 'Parking'] },
  { id: 'cat-7', name: 'Marketing & Branding', examples: ['Facebook Ads', 'Business Cards', 'Banner', 'Signage'] },
  { id: 'cat-8', name: 'Legal & Government', examples: ['Trade License', 'VAT', 'Notary', 'Government Fees'] },
  { id: 'cat-9', name: 'HR & Administration', examples: ['Recruitment', 'Training', 'Staff Welfare', 'ID Cards'] },
  { id: 'cat-10', name: 'Financial Charges', examples: ['Bank Charges', 'Loan Interest', 'Transaction Fees'] },
  { id: 'cat-11', name: 'Hospitality & Entertainment', examples: ['Client Lunch', 'Refreshments', 'Gifts', 'Events'] },
  { id: 'cat-12', name: 'Miscellaneous', examples: ['Other', 'Unclassified', 'Emergency Purchase'] }
]

export const expenses = []

// approval_requests — one row per submission, linked to its expense.
// status: 'pending_approval' | 'approved' | 'rejected'
// Historical decided rows stay in this array permanently — that's the approval history.
export const approvalRequests = []

// tasks
export const tasks = []

// inventory_items — flagged where quantity <= low_stock_threshold
export const inventoryAlerts = []

// notifications
export const notifications = []

// activity_logs — most recent first
export const activityFeed = []

// staff_directory — real employee records, created and managed entirely
// through the Staff Directory module. No seeded/demo employees.
export const staff = []

export const activeDocuments = 0
