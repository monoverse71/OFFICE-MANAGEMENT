import { Eye, Pencil, Trash2, Users } from 'lucide-react'
import EmptyState from '../../../components/shared/EmptyState.jsx'
import EmploymentStatusBadge from './EmploymentStatusBadge.jsx'
import Avatar from './Avatar.jsx'
import { formatDate } from '../../../utils.js'

export default function StaffTable({ rows, onView, onEdit, onDelete }) {
  return (
    <div className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-muted font-body border-b border-hairline">
              <th className="px-4 py-3 font-medium whitespace-nowrap">Employee ID</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Photo</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Full Name</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Mobile Number</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Email</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Designation</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Department</th>
              <th className="px-4 py-3 font-medium whitespace-nowrap">Joining Date</th>
              <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-hairline/70 last:border-0 hover:bg-paper/60 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{s.id}</td>
                <td className="px-4 py-3">
                  <Avatar name={s.full_name} photoUrl={s.photo_url} size={28} />
                </td>
                <td className="px-4 py-3 font-body whitespace-nowrap">{s.full_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{s.mobile_number}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{s.email || '—'}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{s.designation}</td>
                <td className="px-4 py-3 font-body text-ink-muted whitespace-nowrap">{s.department}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted whitespace-nowrap">{formatDate(s.joining_date)}</td>
                <td className="px-4 py-3 text-right"><EmploymentStatusBadge status={s.employment_status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onView(s)} title="View profile" className="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-paper transition-colors">
                      <Eye size={14} />
                    </button>
                    <button type="button" onClick={() => onEdit(s)} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:text-brass hover:bg-brass/10 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => onDelete(s)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-sm text-ink-muted hover:text-rust hover:bg-rust/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <EmptyState
            icon={Users}
            title="No employees found"
            message="Try adjusting your search or filters, or add the first employee to the directory."
          />
        )}
      </div>
    </div>
  )
}
