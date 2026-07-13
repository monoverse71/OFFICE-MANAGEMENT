import { useMemo } from 'react'
import { Receipt, Clock3, CheckCircle2, XCircle, CalendarDays } from 'lucide-react'
import StatCard from '../../../components/StatCard.jsx'
import { formatBDT } from '../../../utils.js'

const CURRENT_MONTH = new Date().toISOString().slice(0, 7)

export default function ExpenseStatsCards({ expenses }) {
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0)
    const pending = expenses.filter((e) => e.status === 'pending_approval')
    const approved = expenses.filter((e) => e.status === 'approved' || e.status === 'paid')
    const rejected = expenses.filter((e) => e.status === 'rejected')
    const thisMonth = expenses.filter((e) => e.expense_date.startsWith(CURRENT_MONTH))

    return {
      total,
      totalCount: expenses.length,
      pendingTotal: pending.reduce((s, e) => s + e.amount, 0),
      pendingCount: pending.length,
      approvedTotal: approved.reduce((s, e) => s + e.amount, 0),
      approvedCount: approved.length,
      rejectedTotal: rejected.reduce((s, e) => s + e.amount, 0),
      rejectedCount: rejected.length,
      monthTotal: thisMonth.reduce((s, e) => s + e.amount, 0),
      monthCount: thisMonth.length
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
