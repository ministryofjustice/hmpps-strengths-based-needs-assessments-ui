import FormWizard from 'hmpo-form-wizard'
import { display, toErrorSummary } from './nunjucks.utils'

describe('server/utils/nunjucks.utils', () => {
  describe('toErrorSummary', () => {
    it('', () => {
      const errors = {
        foo: new FormWizard.Controller.Error('foo', { message: 'Foo is required' }, null),
        bar: new FormWizard.Controller.Error('bar', { message: 'Bar is required' }, null),
        baz: new FormWizard.Controller.Error('baz', { message: 'Baz is required' }, null),
      }

      expect(toErrorSummary(errors)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ text: 'Foo is required', href: '#foo-error' }),
          expect.objectContaining({ text: 'Bar is required', href: '#bar-error' }),
          expect.objectContaining({ text: 'Baz is required', href: '#baz-error' }),
        ]),
      )
    })
  })

  describe('display', () => {
    it('returns html if set', () => {
      expect(display({ text: 'Test', html: '<b>Test</b>', value: '', nestedFields: [] })).toEqual('<b>Test</b>')
    })

    it('returns text if html is not set', () => {
      expect(display({ text: 'Test\nnew line', value: '', nestedFields: [] })).toEqual('Test<br>\nnew line')
    })
  })
})
