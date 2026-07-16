import { useEffect, useRef, useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

export default function CategoryCombobox({ categories, value, onChange, error }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = categories.find((c) => c.name === value) || null

  const term = query.trim().toLowerCase()
  const filtered = term
    ? categories.filter((c) => {
        const nameMatch = c.name.toLowerCase().includes(term)
        const exampleMatch = (c.examples || []).some((ex) => ex.toLowerCase().includes(term))
        return nameMatch || exampleMatch
      })
    : categories

  function handleSelect(cat) {
    onChange(cat.name)
    setQuery('')
    setOpen(false)
  }

  const inputClass =
    'w-full pl-8 pr-8 py-2 text-sm bg-paper border rounded-sm font-body text-ink focus:border-brass focus:outline-none'

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5" htmlFor="category-search">
        Category
      </label>
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          id="category-search"
          type="text"
          className={`${inputClass} ${error ? 'border-rust' : 'border-hairline'}`}
          value={open ? query : selected ? selected.name : ''}
          onChange={(e) => {
            setQuery(e.target.value)
            if (!open) setOpen(true)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          placeholder="Search category… e.g. lap, tea"
          autoComplete="off"
        />
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
      </div>

      {open && (
        <ul className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-paper-card border border-hairline rounded-sm shadow-card">
          {filtered.length === 0 && (
            <li className="px-3 py-2.5 text-sm text-ink-muted font-body">No matching category.</li>
          )}
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => handleSelect(c)}
                className={`w-full text-left px-3 py-2 text-sm font-body hover:bg-paper transition-colors ${
                  c.name === value ? 'bg-brass/10 text-brass' : 'text-ink'
                }`}
              >
                <span className="block">{c.name}</span>
                {c.examples && c.examples.length > 0 && (
                  <span className="block text-xs text-ink-muted mt-0.5 truncate">{c.examples.join(', ')}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-rust font-body mt-1">{error}</p>}

      {!open && selected && selected.examples && selected.examples.length > 0 && (
        <p className="text-xs text-ink-muted font-body mt-1.5">
          <span className="uppercase tracking-wide text-[10px]">Examples: </span>
          {selected.examples.join(', ')}
        </p>
      )}
    </div>
  )
}
