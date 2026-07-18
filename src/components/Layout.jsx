import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import MobileSidebar from './MobileSidebar.jsx'

export default function Layout({ officeName, companyName, logoUrl, userName, role, roles, onRoleChange, dateLabel }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar officeName={officeName} companyName={companyName} logoUrl={logoUrl} />

      <MobileSidebar
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        officeName={officeName}
        companyName={companyName}
        logoUrl={logoUrl}
      />

      <div className="flex-1 min-w-0">
        <Topbar
          userName={userName}
          role={role}
          roles={roles}
          onRoleChange={onRoleChange}
          dateLabel={dateLabel}
          onOpenMenu={() => setMobileNavOpen(true)}
        />

        <main className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1400px] mx-auto space-y-6 sm:space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
