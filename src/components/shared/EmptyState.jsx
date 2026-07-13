export default function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-14">
      {Icon && (
        <div className="w-12 h-12 rounded-full border border-dashed border-brass/50 flex items-center justify-center mb-4">
          <Icon size={20} className="text-brass" strokeWidth={1.5} />
        </div>
      )}
      <p className="font-display text-lg text-ink">{title}</p>
      {message && <p className="text-sm text-ink-muted font-body mt-1 max-w-sm">{message}</p>}
    </div>
  )
}
