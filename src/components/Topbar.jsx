import { ChevronDown, Search } from 'lucide-react'

export default function Topbar({ userName, role, roles, onRoleChange, dateLabel }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 lg:px-10 py-5 border-b border-hairline bg-paper/80 backdrop-blur sticky top-0 z-10">
      <div>
        <p className="font-display text-2xl leading-tight">
          {role === 'Chairman' || role === 'Vice Chairman' ? `Office of the ${role}` : `${role} Desk`}
        </p>
        <p className="text-sm text-ink-muted font-body mt-0.5">
          Good to see you, {userName.split(' ')[0]} — here is where the office stands today.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search records, staff, assets…"
            className="w-56 pl-9 pr-3 py-2 text-sm bg-paper-card border border-hairline rounded-sm font-body focus:border-brass focus:outline-none"
          />
        </label>

        <div className="relative">
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            aria-label="Viewing dashboard as role"
            className="appearance-none pl-3 pr-8 py-2 text-sm bg-ink text-paper rounded-sm font-body cursor-pointer focus:outline-none"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                Viewing as {r}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-paper/70 pointer-events-none" />
        </div>

        <div className="hidden sm:flex flex-col items-end leading-tight px-3 py-1.5 border border-dashed border-brass/60 rounded-sm -rotate-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-brass">Today</span>
          <span className="font-mono text-xs text-ink">{dateLabel}</span>
        </div>
      </div>
    </header>
  )
}
