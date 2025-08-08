import { DateTime } from 'luxon'

export const escape = {
  type: 'escape',
  fn: (input: string) =>
    input
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\//g, '&#x2F;')
      .replace(/\\/g, '&#x5C;')
      .replace(/`/g, '&#96;')
      .replace(/\r\n|\r/g, '\n'),
}

export const unescape = (input: string) =>
  input
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x5C;/g, '\\')
    .replace(/&#96;/g, '`')

export enum DateFormats {
  DEFAULT = 'd MMMM y',
  JUST_YEAR = 'yyyy',
}

export const formatDateForDisplay = (value: string, dateFormat: DateFormats = DateFormats.DEFAULT): string => {
  if (!value) {
    return null
  }

  const date = DateTime.fromISO(value)
  return date.isValid ? date.toFormat(dateFormat) : null
}

export const ordinalWordFromNumber = (n: number): string => {
  const ordinals = [
    'zeroth',
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
    'eleventh',
    'twelfth',
    'thirteenth',
    'fourteenth',
    'fifteenth',
    'sixteenth',
    'seventeenth',
    'eighteenth',
    'nineteenth',
    'twentieth',
  ]

  return n <= 20 ? ordinals[n] : n.toString()
}
