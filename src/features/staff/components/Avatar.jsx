export default function Avatar({ name, photoUrl, size = 32 }) {
  const initials = (name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  const style = { width: size, height: size }

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        style={style}
        className="rounded-full object-cover border border-hairline shrink-0"
      />
    )
  }

  return (
    <div
      style={style}
      className="rounded-full border border-brass/50 bg-brass/10 text-brass flex items-center justify-center font-display shrink-0"
    >
      <span style={{ fontSize: size * 0.4 }}>{initials}</span>
    </div>
  )
}
