import Modal from '../../../components/shared/Modal.jsx'
import EmploymentStatusBadge from './EmploymentStatusBadge.jsx'
import Avatar from './Avatar.jsx'
import { formatDate } from '../../../utils.js'

export default function StaffDetailsModal({ employee, onClose }) {
  return (
    <Modal title={employee.full_name} subtitle={`Record ${employee.code || employee.id}`} onClose={onClose} width="max-w-lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={employee.full_name} photoUrl={employee.photo_url} size={56} />
            <div>
              <p className="font-display text-lg leading-tight">{employee.full_name}</p>
              <p className="text-sm text-ink-muted font-body">{employee.designation}</p>
            </div>
          </div>
          <EmploymentStatusBadge status={employee.employment_status} />
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Department</dt>
            <dd className="font-body mt-0.5">{employee.department}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Joining Date</dt>
            <dd className="font-mono mt-0.5">{formatDate(employee.joining_date)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Mobile Number</dt>
            <dd className="font-mono mt-0.5">{employee.mobile_number}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Email</dt>
            <dd className="font-body mt-0.5">{employee.email || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ink-muted font-body">Emergency Contact</dt>
            <dd className="font-body mt-0.5">{employee.emergency_contact || '—'}</dd>
          </div>
        </dl>

        {employee.address && (
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Address</p>
            <p className="text-sm font-body text-ink">{employee.address}</p>
          </div>
        )}

        {employee.notes && (
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-muted font-body mb-1">Notes</p>
            <p className="text-sm font-body text-ink">{employee.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
