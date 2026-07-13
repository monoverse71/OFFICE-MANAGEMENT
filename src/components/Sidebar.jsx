import {
  LayoutGrid,
  Receipt,
  CheckSquare2,
  Users,
  Boxes,
  FileStack,
  ListChecks,
  Bell,
  Settings,
  ScrollText
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', icon: LayoutGrid, active: true },
  { label: 'Expenses', icon: Receipt },
  { label: 'Approvals', icon: CheckSquare2 },
  { label: 'Staff Directory', icon: Users },
  { label: 'Inventory', icon: Boxes },
  { label: 'Documents', icon: FileStack },
  { label: 'Tasks', icon: ListChecks },
  { label: 'Notifications', icon: Bell },
  { label: 'Activity Log', icon: ScrollText },
  { label: 'Settings', icon: Settings }
]

export default function Sidebar({ officeName }) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 bg-ink text-paper h-screen sticky top-0">
      <div className="px-6 pt-7 pb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border-2 border-brass flex items-center justify-center">
            <span className="font-display text-brass text-sm">R</span>
          </div>
          <div>
            <p className="font-display text-[15px] leading-none tracking-tight">The Register</p>
            <p className="text-[10px] text-paper/45 uppercase tracking-[0.14em] mt-1">Office Administration</p>
          </div>
        </div>
        <p className="mt-4 text-[11px] text-paper/60 font-body truncate" title={officeName}>
          {officeName}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            type="button"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-sm text-[13px] font-body transition-colors ${
              active
                ? 'bg-white/10 text-paper border-l-2 border-brass pl-[10px]'
                : 'text-paper/55 hover:text-paper hover:bg-white/5 border-l-2 border-transparent pl-[10px]'
            }`}
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-white/10 text-[10px] text-paper/40 font-mono">
        v1.0 · Dashboard module
      </div>
    </aside>
  )
}
