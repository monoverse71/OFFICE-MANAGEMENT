import { office, paymentMethods } from '../../data/dummyData.js'
import { formatBDT, formatDate } from '../../utils.js'

const PAYMENT_LABELS = Object.fromEntries(paymentMethods.map((m) => [m.value, m.label]))

export default function ExpensePrintSheet({ expense }) {
  if (!expense) return null

  return (
    <div id="expense-print-sheet" className="hidden print:block bg-white text-black p-10 font-body">
      <div className="flex items-baseline justify-between border-b border-black/30 pb-4 mb-6">
        <div>
          <p className="font-display text-xl">{office.name}</p>
          <p className="text-sm mt-0.5">Expense Approval Record</p>
        </div>
        <p className="font-mono text-sm">{expense.id}</p>
      </div>

      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr>
            <td className="py-1.5 pr-4 align-top w-1/3 text-black/60">Item / Title</td>
            <td className="py-1.5">{expense.title}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Category</td>
            <td className="py-1.5">{expense.category}</td>
          </tr>
          {expense.quantity != null && (
            <tr>
              <td className="py-1.5 pr-4 align-top text-black/60">Quantity</td>
              <td className="py-1.5">{expense.quantity}</td>
            </tr>
          )}
          {expense.description && (
            <tr>
              <td className="py-1.5 pr-4 align-top text-black/60">Description</td>
              <td className="py-1.5">{expense.description}</td>
            </tr>
          )}
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Expense Date</td>
            <td className="py-1.5 font-mono">{formatDate(expense.expense_date)}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Requested Amount</td>
            <td className="py-1.5 font-mono">{formatBDT(expense.amount)}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Approved Amount</td>
            <td className="py-1.5 font-mono">{expense.approved_amount != null ? formatBDT(expense.approved_amount) : '—'}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Payment Method</td>
            <td className="py-1.5">{expense.payment_method ? (PAYMENT_LABELS[expense.payment_method] || expense.payment_method) : '—'}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Payment Date</td>
            <td className="py-1.5 font-mono">{expense.payment_date ? formatDate(expense.payment_date) : '—'}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Submitted By</td>
            <td className="py-1.5">{expense.submitted_by}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Approved By</td>
            <td className="py-1.5">{expense.approved_by || '—'}</td>
          </tr>
          <tr>
            <td className="py-1.5 pr-4 align-top text-black/60">Approval Date</td>
            <td className="py-1.5 font-mono">{expense.approved_at ? formatDate(expense.approved_at) : '—'}</td>
          </tr>
          {expense.remarks && (
            <tr>
              <td className="py-1.5 pr-4 align-top text-black/60">Remarks</td>
              <td className="py-1.5">{expense.remarks}</td>
            </tr>
          )}
          {expense.approval_note && (
            <tr>
              <td className="py-1.5 pr-4 align-top text-black/60">Approval Note</td>
              <td className="py-1.5">{expense.approval_note}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-between border-t border-black/30 pt-6 mt-16 text-sm">
        <span>Prepared By</span>
        <span>Approved By</span>
      </div>
    </div>
  )
}
