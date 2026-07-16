import { useEffect, useRef, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import CategoryCombobox from './CategoryCombobox.jsx'

export default function ItemCombobox({ catalogue, categories, value, onSelectItem, onCreateItem, error }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setQuery('')
        setCreating(false)
        setNewCategory('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const term = query.trim().toLowerCase()
  const filtered = term ? catalogue.filter((it) => it.name.toLowerCase().includes(term)) : catalogue
  const exactMatch = catalogue.some((it) => it.name.toLowerCase() === term)

  function selectItem(item) {
    onSelectItem(item)
    setQuery('')
    setOpen(false)
    setCreating(false)
  }

  function confirmCreate() {
    if (!newCategory) return
    onCreateItem(query.trim(), newCategory)
    setQuery('')
    setNewCategory('')
    setCreating(false)
    setOpen(false)
  }

  const inputClass =
    'w-full pl-8 pr-3 py-2 text-sm bg-paper border rounded-sm font-body text-ink focus:border-brass focus:outline-none'

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-body uppercase tracking-wide text-ink-muted mb-1.5" htmlFor="item-search">
        Expense Title (Item)
      </label>
      <div className="relative">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
        <input
          id="item-search"
          type="text"
          className={`${inputClass} ${error ? 'border-rust' : 'border-hairline'}`}
          value={open ? query : value || ''}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setCreating(false)
          }}
          onFocus={() => {
            setOpen(true)
            setQuery('')
          }}
          placeholder="Search or type an item… e.g. Laptop, Tea, Fuel"
          autoComplete="off"
        />
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-paper-card border border-hairline rounded-sm shadow-card overflow-hidden">
          {!creating && (
            <ul className="max-h-56 overflow-y-auto">
              {term === '' && filtered.length === 0 && (
                <li className="px-3 py-2.5 text-sm text-ink-muted font-body">Start typing to search items…</li>
              )}
              {filtered.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => selectItem(it)}
                    className="w-full text-left px-3 py-2 text-sm font-body hover:bg-paper transition-colors"
                  >
                    <span className="block">{it.name}</span>
                    <span className="block text-xs text-ink-muted mt-0.5">{it.category}</span>
                  </button>
                </li>
              ))}
              {term && !exactMatch && (
                <li className="border-t border-hairline">
                  <button
                    type="button"
                    onClick={() => setCreating(true)}
                    className="w-full text-left px-3 py-2 text-sm font-body text-brass hover:bg-brass/10 transition-colors inline-flex items-center gap-1.5"
                  >
                    <Plus size={13} /> Add "{query.trim()}" as a new item
                  </button>
                </li>
              )}
            </ul>
          )}

          {creating && (
            <div className="p-3 space-y-3">
              <p className="text-xs font-body text-ink-muted">
                "{query.trim()}" isn't in the catalogue yet. Choose its Main Category to save it — every future
                expense for this item will use that category automatically.
              </p>
              <CategoryCombobox categories={categories} value={newCategory} onChange={setNewCategory} />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="px-3 py-1.5 text-xs font-body rounded-sm border border-hairline text-ink hover:bg-paper transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!newCategory}
                  onClick={confirmCreate}
                  className="px-3 py-1.5 text-xs font-body rounded-sm bg-ink text-paper hover:bg-ink-2 transition-colors disabled:opacity-50"
                >
                  Save Item
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-rust font-body mt-1">{error}</p>}
    </div>
  )
}
