// eslint-disable-next-line import/prefer-default-export
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
      .replace(/`/g, '&#96;'),
}

export const formatDateForDisplay = (value: string): string => {
  if (!value) {
    return null
  }

  const date = DateTime.fromISO(value)
  return date.isValid ? date.toFormat('dd MMMM y') : null
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
