import { CheckCircle2, XCircle } from 'lucide-react'

export default function StatusMessage({ status }) {
  if (!status) return null
  const isError = status.type === 'error'

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-sm font-body mt-3 ${
        isError ? 'bg-rust/10 border-rust/30 text-rust' : 'bg-forest/10 border-forest/30 text-forest'
      }`}
    >
      {isError ? <XCircle size={15} className="shrink-0" /> : <CheckCircle2 size={15} className="shrink-0" />}
      {status.message}
    </div>
  )
}
