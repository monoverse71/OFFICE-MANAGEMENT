import CompanySettingsSection from '../features/settings/components/CompanySettingsSection.jsx'
import SystemSettingsSection from '../features/settings/components/SystemSettingsSection.jsx'
import BackupRestoreSection from '../features/settings/components/BackupRestoreSection.jsx'
import DataManagementSection from '../features/settings/components/DataManagementSection.jsx'
import AboutSystemSection from '../features/settings/components/AboutSystemSection.jsx'

export default function SettingsPage({
  companySettings,
  onSaveCompanySettings,
  systemSettings,
  onSaveSystemSettings,
  appState,
  onRestoreBackup,
  onDataAction,
  totalRecords
}) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="font-display text-2xl leading-tight">Settings</p>
        <p className="text-sm text-ink-muted font-body mt-0.5">Company profile, system preferences, backups, and system info.</p>
      </div>

      <CompanySettingsSection settings={companySettings} onSave={onSaveCompanySettings} />
      <SystemSettingsSection settings={systemSettings} onSave={onSaveSystemSettings} />
      <BackupRestoreSection appState={appState} onRestore={onRestoreBackup} />
      <DataManagementSection onAction={onDataAction} />
      <AboutSystemSection totalRecords={totalRecords} />
    </div>
  )
}
