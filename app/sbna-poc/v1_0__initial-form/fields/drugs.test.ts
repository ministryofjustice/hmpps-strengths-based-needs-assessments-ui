import { requiredWhenContains } from './drugs'

describe('sbna-poc/fields/drugs', () => {
  describe('requiredWhenContains', () => {
    const contextWithAnswers = (answers: Record<string, unknown>) => ({
      sessionModel: {
        options: {
          req: {
            form: {
              persistedAnswers: answers,
            },
          },
        },
      },
    })

    it('is valid when a value is present and the condition is met', () => {
      const validate = requiredWhenContains('foo', 'BAR')

      expect(validate.bind(contextWithAnswers({ foo: { values: ['BAR'] } }))('baz')).toEqual(true)
    })

    it('is invalid when a value is not present and the condition is met', () => {
      const validate = requiredWhenContains('foo', 'BAR')

      expect(validate.bind(contextWithAnswers({ foo: { values: ['BAR'] } }))('')).toEqual(false)
    })

    it('is valid when a value is present and the condition is not met', () => {
      const validate = requiredWhenContains('foo', 'BAR')

      expect(validate.bind(contextWithAnswers({ foo: { values: [] } }))('baz')).toEqual(true)
    })

    it('is valid when no value is present and the condition is not met', () => {
      const validate = requiredWhenContains('foo', 'BAR')

      expect(validate.bind(contextWithAnswers({ foo: { values: [] } }))('')).toEqual(true)
    })
  })
})
