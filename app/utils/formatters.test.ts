import { escape, formatDateForDisplay } from './formatters'

describe('escape', () => {
  it('should escape HTML', () => {
    expect(escape.fn('<script> alert("xss&fun"); </script>')).toEqual(
      '&lt;script&gt; alert(&quot;xss&amp;fun&quot;); &lt;&#x2F;script&gt;',
    )

    expect(escape.fn("<script> alert('xss&fun'); </script>")).toEqual(
      '&lt;script&gt; alert(&#x27;xss&amp;fun&#x27;); &lt;&#x2F;script&gt;',
    )

    expect(escape.fn('Backtick: `')).toEqual('Backtick: &#96;')

    expect(escape.fn('Backslash: \\')).toEqual('Backslash: &#x5C;')
  })
})

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
