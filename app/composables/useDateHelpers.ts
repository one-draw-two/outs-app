const formatters = {
  dateTime: new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }),
  isoDate: new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const ensureDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null
  return date instanceof Date ? date : new Date(date)
}

const formatDate = (d: Date, pattern: string): string => {
  const parts = formatters.dateTime.formatToParts(d)
  const getValue = (type: string) => parts.find(p => p.type === type)?.value || ''

  switch (pattern) {
    case 'ddd DD/MM HH:mm':
      return `${getValue('weekday')} ${getValue('day')}/${getValue('month')} ${getValue('hour')}:${getValue('minute')}`
    case 'ddd DD/MM':
      return `${getValue('weekday')} ${getValue('day')}/${getValue('month')}`
    case 'HH:mm':
      return `${getValue('hour')}:${getValue('minute')}`
    case 'YYYY-MM-DD':
      return formatters.isoDate.format(d)
    default:
      return d.toISOString()
  }
}

const getRelativeTime = (d: Date, withoutSuffix = false): string => {
  const now = Date.now()
  const then = d.getTime()
  const diffMs = Math.abs(now - then)
  const isPast = then < now

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  let value: number
  let unit: string

  if (years > 0) {
    value = years
    unit = years === 1 ? 'year' : 'years'
  } else if (months > 0) {
    value = months
    unit = months === 1 ? 'month' : 'months'
  } else if (days > 0) {
    value = days
    unit = days === 1 ? 'day' : 'days'
  } else if (hours > 0) {
    value = hours
    unit = hours === 1 ? 'hour' : 'hours'
  } else if (minutes > 0) {
    value = minutes
    unit = minutes === 1 ? 'minute' : 'minutes'
  } else {
    value = seconds
    unit = 'seconds'
  }

  if (withoutSuffix) return `${value} ${unit}`
  return isPast ? `${value} ${unit} ago` : `in ${value} ${unit}`
}

export const $day = (date: string | Date | null | undefined) => {
  const d = ensureDate(date)

  return {
    format: (pattern: string): string => {
      if (!d || isNaN(d.getTime())) return ''
      return formatDate(d, pattern)
    },
    fromNow: (withoutSuffix = false): string => {
      if (!d || isNaN(d.getTime())) return ''
      return getRelativeTime(d, withoutSuffix)
    }
  }
}

export const useDateHelpers = () => ({ $day })
