import { formatDateForDisplay } from './formatters'

describe('formatDateForDisplay', () => {
  it('returns the data in the format', () => {
    expect(formatDateForDisplay('2023-08-02')).toEqual('02 August 2023')
  })

  it('returns null when passed a null/undefined value', () => {
    expect(formatDateForDisplay(null)).toEqual(null)
    expect(formatDateForDisplay(undefined)).toEqual(null)
  })

  it('returns null when passed an invalid date', () => {
    expect(formatDateForDisplay('99-99-9999')).toEqual(null)
    expect(formatDateForDisplay('foo date')).toEqual(null)
    expect(formatDateForDisplay('')).toEqual(null)
  })
})
