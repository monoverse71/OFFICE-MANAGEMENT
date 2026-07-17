// Dummy data shaped to mirror the database design's tables.
// In the real build, each of these would come from a Supabase query
// scoped by office_id via RLS.

export const office = {
  id: 'off-001',
  name: 'Apon Niketon Holdings — Head Office',
  timezone: 'Asia/Dhaka',
  currency: 'BDT'
}

// Editable in Settings → Company Settings. Seeded from the office record
// above, but stored and persisted separately since it's user-editable.
export const defaultCompanySettings = {
  name: 'Apon Niketon Holdings',
  logo: null, // data URL once uploaded via Settings; falls back to the bundled mark
  address: 'Head Office, Dhaka, Bangladesh',
  phone: '',
  email: '',
  website: '',
  description: ''
}

// Editable in Settings → System Settings.
export const defaultSystemSettings = {
  currency: '৳',
  dateFormat: 'DD MMM YYYY',
  timeFormat: '24',
  timezone: 'Asia/Dhaka'
}

export const currencyOptions = [
  { value: '৳', label: 'BDT — ৳' },
  { value: '$', label: 'USD — $' },
  { value: '€', label: 'EUR — €' },
  { value: '£', label: 'GBP — £' }
]

export const dateFormatOptions = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '17/07/2026' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY', example: '17 Jul 2026' },
  { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY', example: 'July 17, 2026' }
]

export const timeFormatOptions = [
  { value: '12', label: '12 Hour' },
  { value: '24', label: '24 Hour' }
]

export const timezoneOptions = [
  { value: 'Asia/Dhaka', label: 'Asia/Dhaka (GMT+6)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (GMT+5:30)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GMT+4)' },
  { value: 'UTC', label: 'UTC' }
]

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

// item_catalogue — the master item → category mapping that powers the
// smart Expense Title selector. Reusable by future modules (Inventory,
// Purchase, Reports) without any redesign — it's just name + category.
export const itemCatalogue = [
  { id: 'itm-1', name: 'Laptop', category: 'IT & Electronics' },
  { id: 'itm-2', name: 'Desktop', category: 'IT & Electronics' },
  { id: 'itm-3', name: 'Printer', category: 'IT & Electronics' },
  { id: 'itm-4', name: 'Router', category: 'IT & Electronics' },
  { id: 'itm-5', name: 'UPS', category: 'IT & Electronics' },
  { id: 'itm-6', name: 'Monitor', category: 'IT & Electronics' },
  { id: 'itm-7', name: 'Mouse', category: 'IT & Electronics' },
  { id: 'itm-8', name: 'Keyboard', category: 'IT & Electronics' },
  { id: 'itm-9', name: 'CCTV', category: 'IT & Electronics' },
  { id: 'itm-10', name: 'Fan', category: 'IT & Electronics' },
  { id: 'itm-11', name: 'AC', category: 'IT & Electronics' },
  { id: 'itm-12', name: 'Generator', category: 'IT & Electronics' },
  { id: 'itm-13', name: 'Tea', category: 'Office Supplies' },
  { id: 'itm-14', name: 'Coffee', category: 'Office Supplies' },
  { id: 'itm-15', name: 'Sugar', category: 'Office Supplies' },
  { id: 'itm-16', name: 'Tissue', category: 'Office Supplies' },
  { id: 'itm-17', name: 'Paper', category: 'Office Supplies' },
  { id: 'itm-18', name: 'Pen', category: 'Office Supplies' },
  { id: 'itm-19', name: 'File', category: 'Office Supplies' },
  { id: 'itm-20', name: 'Water', category: 'Office Supplies' },
  { id: 'itm-21', name: 'Chair', category: 'Furniture & Fixtures' },
  { id: 'itm-22', name: 'Office Chair', category: 'Furniture & Fixtures' },
  { id: 'itm-23', name: 'Desk', category: 'Furniture & Fixtures' },
  { id: 'itm-24', name: 'Sofa', category: 'Furniture & Fixtures' },
  { id: 'itm-25', name: 'Fuel', category: 'Transport & Logistics' },
  { id: 'itm-26', name: 'Trade License', category: 'Legal & Government' },
  { id: 'itm-27', name: 'Facebook Ads', category: 'Marketing & Branding' }
]

export const expenses = []

// inventory_categories — the Inventory module's own category list. Kept
// entirely separate from expenseCategories: Inventory is never connected
// to Expenses, so it needs its own taxonomy.
export const inventoryCategories = [
  { id: 'inv-cat-1', name: 'Electronics & IT Equipment', examples: ['Laptop', 'Printer', 'Router', 'Monitor'] },
  { id: 'inv-cat-2', name: 'Furniture & Fixtures', examples: ['Chair', 'Desk', 'Cabinet', 'Sofa'] },
  { id: 'inv-cat-3', name: 'Office Supplies', examples: ['Paper', 'Pen', 'File', 'Stapler'] },
  { id: 'inv-cat-4', name: 'Tools & Equipment', examples: ['Drill', 'Ladder', 'Toolbox'] },
  { id: 'inv-cat-5', name: 'Kitchen & Pantry', examples: ['Tea', 'Coffee', 'Sugar', 'Water Jar'] },
  { id: 'inv-cat-6', name: 'Cleaning Supplies', examples: ['Detergent', 'Mop', 'Tissue', 'Broom'] },
  { id: 'inv-cat-7', name: 'Safety & Security', examples: ['Fire Extinguisher', 'CCTV', 'First Aid Kit'] },
  { id: 'inv-cat-8', name: 'Miscellaneous', examples: ['Other', 'Unclassified'] }
]

export const inventoryUnits = [
  { value: 'pcs', label: 'pcs' },
  { value: 'kg', label: 'kg' },
  { value: 'gram', label: 'gram' },
  { value: 'litre', label: 'litre' },
  { value: 'packet', label: 'packet' },
  { value: 'box', label: 'box' },
  { value: 'roll', label: 'roll' }
]

export const assetStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'disposed', label: 'Disposed' }
]

// inventory_items — a completely independent module from Expenses.
// Managed manually; nothing here is ever created from an expense record.
export const inventoryItems = []

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
