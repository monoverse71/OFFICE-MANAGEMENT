export default function SettingsSection({ title, description, children }) {
  return (
    <section className="bg-paper-card border border-hairline rounded-sm shadow-card">
      <div className="px-6 py-4 border-b border-hairline">
        <h2 className="font-display text-lg">{title}</h2>
        {description && <p className="text-xs text-ink-muted font-body mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  )
}
