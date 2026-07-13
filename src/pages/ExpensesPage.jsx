import ExpensesTable from '../components/ExpensesTable.jsx'

export default function ExpensesPage({ expenses }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-display text-2xl leading-tight">Expenses</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Every expense logged against the office register.</p>
      </div>
      <ExpensesTable expenses={expenses} />
    </div>
  )
}
