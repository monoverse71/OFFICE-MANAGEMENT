import { useMemo } from 'react'
import { Receipt, Clock3, CheckCircle2, XCircle, CalendarDays } from 'lucide-react'
import StatCard from '../../../components/StatCard.jsx'
import { formatBDT } from '../../../utils.js'

const CURRENT_MONTH = new Date().toISOString().slice(0, 7)

export default function ExpenseStatsCards({ expenses }) {
  const stats = useMemo(() => {
    // Only approved (or paid, which follows approval) expenses are financial
    // records — pending, rejected, and draft requests must never contribute
    // to a currency total. The requested amount is never used here; only the
    // amount actually approved counts.
    const approved = expenses.filter((e) => e.approved_amount != null)
    const pending = expenses.filter((e) => e.status === 'pending_approval')
    const rejected = expenses.filter((e) => e.status === 'rejected')
    const thisMonthApproved = approved.filter((e) => e.expense_date.startsWith(CURRENT_MONTH))

    return {
      total: approved.reduce((sum, e) => sum + e.approved_amount, 0),
      totalCount: expenses.length,
      pendingTotal: pending.reduce((s, e) => s + e.amount, 0),
      pendingCount: pending.length,
      approvedTotal: approved.reduce((s, e) => s + e.approved_amount, 0),
      approvedCount: approved.length,
      rejectedTotal: rejected.reduce((s, e) => s + e.amount, 0),
      rejectedCount: rejected.length,
      monthTotal: thisMonthApproved.reduce((s, e) => s + e.approved_amount, 0),
      monthCount: thisMonthApproved.length
    }
  }, [expenses])

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      <StatCard
        label="Total Expenses"
        value={formatBDT(stats.total)}
        sub={`${stats.totalCount} records`}
        icon={Receipt}
        accent="ink"
      />
      <StatCard
        label="Pending Approval"
        value={formatBDT(stats.pendingTotal)}
        sub={`${stats.pendingCount} awaiting decision`}
        icon={Clock3}
        accent="amber"
      />
      <StatCard
        label="Approved Expenses"
        value={formatBDT(stats.approvedTotal)}
        sub={`${stats.approvedCount} approved / paid`}
        icon={CheckCircle2}
        accent="forest"
      />
      <StatCard
        label="Rejected Expenses"
        value={formatBDT(stats.rejectedTotal)}
        sub={`${stats.rejectedCount} rejected`}
        icon={XCircle}
        accent="rust"
      />
      <StatCard
        label="Monthly Expense"
        value={formatBDT(stats.monthTotal)}
        sub={`${stats.monthCount} entries this month`}
        icon={CalendarDays}
        accent="brass"
      />
    </section>
  )
}
