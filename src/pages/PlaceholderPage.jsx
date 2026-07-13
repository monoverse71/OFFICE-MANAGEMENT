export default function PlaceholderPage({ title, message }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="font-display text-2xl leading-tight">{title}</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">This module isn't built yet.</p>
      </div>
      <div className="bg-paper-card border border-hairline rounded-sm shadow-card px-6 py-14 text-center">
        <p className="font-display text-lg">{title} module coming soon</p>
        <p className="text-sm text-ink-muted font-body mt-1.5 max-w-sm mx-auto">
          {message || 'This part of the register hasn\u2019t been built yet. The navigation is ready for it.'}
        </p>
      </div>
    </div>
  )
}
