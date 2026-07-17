// Formatting is intentionally configurable at the module level (rather than
// via React context) so every existing call site of formatBDT/formatDate/
// formatDateTime keeps working unchanged — Settings just calls
// configureFormatting() and every future render picks up the new values.
let currencySymbol = '৳'
let dateFormatPattern = 'DD MMM YYYY'
let timeFormatMode = '24'
let appTimezone = 'Asia/Dhaka'

export function configureFormatting({ currency, dateFormat, timeFormat, timezone } = {}) {
  if (currency) currencySymbol = currency
  if (dateFormat) dateFormatPattern = dateFormat
  if (timeFormat) timeFormatMode = timeFormat
  if (timezone) appTimezone = timezone
}

export function formatBDT(amount) {
  const num = Number(amount) || 0
  return currencySymbol + num.toLocaleString('en-IN')
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  if (dateFormatPattern === 'DD/MM/YYYY') {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: appTimezone })
  }
  if (dateFormatPattern === 'MMMM DD, YYYY') {
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric', timeZone: appTimezone })
  }
  // default: DD MMM YYYY
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: appTimezone })
}

export function formatDateTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: timeFormatMode === '12',
    timeZone: appTimezone
  })
}

export function timeAgo(dateStr) {
  const then = new Date(dateStr).getTime()
  const now = Date.now()
  const diffMin = Math.round((now - then) / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  const diffDay = Math.round(diffHr / 24)
  return `${diffDay}d ago`
}
