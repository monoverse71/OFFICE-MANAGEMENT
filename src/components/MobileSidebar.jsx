import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV } from './Sidebar.jsx'
import logoMark from '../assets/logo-mark.png'
import { APP_VERSION } from '../data/appMeta.js'

export default function MobileSidebar({ isOpen, onClose, companyName, logoUrl, officeName }) {
  // ESC key closes the drawer.
  useEffect(() => {
    if (!isOpen) return undefined
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Background never scrolls while the drawer is open.
  useEffect(() => {
    if (!isOpen) return undefined
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [isOpen])

  // Device/browser Back button closes the drawer first instead of leaving
  // the app: pushing a history entry when the drawer opens means the next
  // Back press just pops that entry, which we catch here.
  useEffect(() => {
    if (!isOpen) return undefined
    window.history.pushState({ mobileSidebarOpen: true }, '')
    function onPopState() {
      onClose()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isOpen, onClose])

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink/60 backdrop-blur-[1px] transition-opacity duration-300 ease-in-out lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-ink text-paper shadow-card transition-transform duration-300 ease-in-out will-change-transform lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-6 pb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full border-2 border-brass flex items-center justify-center overflow-hidden bg-paper shrink-0">
              <img src={logoUrl || logoMark} alt={companyName} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[15px] leading-none tracking-tight truncate">{companyName}</p>
              <p className="text-[10px] text-paper/45 uppercase tracking-[0.14em] mt-1">Office Administration</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-sm text-paper/60 hover:text-paper hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {officeName && (
          <p className="px-5 pt-4 text-[11px] text-paper/60 font-body truncate" title={officeName}>
            {officeName}
          </p>
        )}

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overscroll-contain">
          {NAV.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-3 rounded-sm text-sm font-body transition-colors border-l-2 pl-[10px] ${
                  isActive
                    ? 'bg-white/10 text-paper border-brass'
                    : 'text-paper/55 hover:text-paper hover:bg-white/5 border-transparent'
                }`
              }
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 text-[10px] text-paper/40 font-mono">
          v{APP_VERSION} · Navigation enabled
        </div>
      </aside>
    </>
  )
}
