import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

export default function Layout({ officeName, companyName, logoUrl, userName, role, roles, onRoleChange, dateLabel }) {
  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar officeName={officeName} companyName={companyName} logoUrl={logoUrl} />

      <div className="flex-1 min-w-0">
        <Topbar
          userName={userName}
          role={role}
          roles={roles}
          onRoleChange={onRoleChange}
          dateLabel={dateLabel}
        />

        <main className="px-6 lg:px-10 py-8 max-w-[1400px] mx-auto space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
