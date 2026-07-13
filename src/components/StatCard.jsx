export default function StatCard({ label, value, sub, accent = 'ink', icon: Icon }) {
  const accentColor = {
    ink: 'text-ink',
    brass: 'text-brass',
    rust: 'text-rust',
    amber: 'text-amber',
    forest: 'text-forest'
  }[accent]

  return (
    <div className="relative bg-paper-card border border-hairline rounded-sm p-5 shadow-card overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-brass/70" />
      <div className="flex items-start justify-between">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ink-muted font-body">{label}</p>
        {Icon && <Icon size={16} strokeWidth={1.75} className={accentColor} />}
      </div>
      <p className={`font-display text-3xl mt-2 ${accentColor}`}>{value}</p>
      {sub && <p className="text-xs text-ink-muted font-body mt-1.5">{sub}</p>}
    </div>
  )
}
