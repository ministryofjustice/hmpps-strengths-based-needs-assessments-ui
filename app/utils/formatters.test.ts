import { escape } from './formatters'

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
