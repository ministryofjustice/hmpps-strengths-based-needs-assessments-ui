import {
  fieldCodeWith,
  validateFutureDate,
  requiredWhenValidator,
  getMediumLabelClassFor,
  getSmallLabelClassFor,
  validateMaxLength,
} from './utils'
import { FieldType } from '../../../../../server/@types/hmpo-form-wizard/enums'

describe('fields/common', () => {
  describe('fieldCodeWith', () => {
    it('assembles the components of a field code', () => {
      expect(fieldCodeWith('prefix', 'field_code', 'suffix')).toEqual('prefix_field_code_suffix')
    })

    it('tidies up the input', () => {
      expect(fieldCodeWith('FOO', ' bar', 'baz ')).toEqual('foo_bar_baz')
    })
  })

  describe('validateFutureDate', () => {
    it('is valid when the date is in the future', () => expect(validateFutureDate('2100-01-01')).toEqual(true))

    it('is invalid when the date is in the future', () => expect(validateFutureDate('1970-01-01')).toEqual(false))

    it('is invalid when the date is invalid', () => {
      expect(validateFutureDate('9999-99-99')).toEqual(false)
    })

    it('is valid when no value present', () => {
      expect(validateFutureDate(undefined)).toEqual(true)
      expect(validateFutureDate(null)).toEqual(true)
    })
  })

  describe('validateMaxLength', () => {
    it('is valid when the length is under the limit', () => expect(validateMaxLength('abc', 4)).toEqual(true))
    it('is valid when the length is equal to the limit', () => expect(validateMaxLength('abc', 3)).toEqual(true))
    it('is invalid when the length is over the limit', () => expect(validateMaxLength('abc', 2)).toEqual(false))
    it('unescapes html characters before validation', () => expect(validateMaxLength('&amp;', 1)).toEqual(true))
  })

  describe('requiredWhenValidator', () => {
    const contextWithAnswers = (answers: Record<string, string | string[]>) => ({
      values: answers,
    })
    const contextWithSessionAnswers = (answers: Record<string, string | string[]>) => ({
      sessionModel: { attributes: answers },
    })

    describe('when the the dependent field has a single value answer', () => {
      it('is valid when a value is present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: 'bar' }))('baz')).toEqual(true)
      })

      it('is invalid when a value is not present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: 'bar' }))('')).toEqual(false)
      })

      it('is valid when a value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({}))('baz')).toEqual(true)
      })

      it('is valid when no value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({}))('')).toEqual(true)
      })
    })

    describe('when the the dependent field has an array of answers', () => {
      it('is valid when a value is present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: ['bar'] }))('baz')).toEqual(true)
      })

      it('is invalid when a value is not present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: ['bar'] }))('')).toEqual(false)
      })

      it('is valid when a value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: [] }))('baz')).toEqual(true)
      })

      it('is valid when no value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'step', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: [] }))('')).toEqual(true)
      })
    })

    describe('when the dependent field is not on the same step', () => {
      it('is valid when a value is present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'assessment', 'bar')

        expect(validate.bind(contextWithSessionAnswers({ foo: 'bar' }))('baz')).toEqual(true)
      })

      it('is invalid when a value is not present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'assessment', 'bar')

        expect(validate.bind(contextWithSessionAnswers({ foo: 'bar' }))('')).toEqual(false)
      })

      it('is valid when a value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'assessment', 'bar')

        expect(validate.bind(contextWithSessionAnswers({}))('baz')).toEqual(true)
      })

      it('is valid when no value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'assessment', 'bar')

        expect(validate.bind(contextWithSessionAnswers({}))('')).toEqual(true)
      })
    })
  })

  describe('getMediumLabelClassFor', () => {
    it('returns the correct class for fields that use legends', () => {
      const expectedClass = 'govuk-fieldset__legend--m'

      expect(getMediumLabelClassFor(FieldType.CheckBox)).toEqual(expectedClass)
      expect(getMediumLabelClassFor(FieldType.Radio)).toEqual(expectedClass)
      expect(getMediumLabelClassFor(FieldType.Date)).toEqual(expectedClass)
    })

    it('returns the correct class for fields that use labels', () => {
      const expectedClass = 'govuk-label--m'

      expect(getMediumLabelClassFor(FieldType.TextArea)).toEqual(expectedClass)
      expect(getMediumLabelClassFor(FieldType.Text)).toEqual(expectedClass)
      expect(getMediumLabelClassFor(FieldType.Dropdown)).toEqual(expectedClass)
    })
  })

  describe('getSmallLabelClassFor', () => {
    it('returns the correct class for fields that use legends', () => {
      const expectedClass = 'govuk-fieldset__legend--s'

      expect(getSmallLabelClassFor(FieldType.CheckBox)).toEqual(expectedClass)
      expect(getSmallLabelClassFor(FieldType.Radio)).toEqual(expectedClass)
      expect(getSmallLabelClassFor(FieldType.Date)).toEqual(expectedClass)
    })

    it('returns the correct class for fields that use labels', () => {
      const expectedClass = 'govuk-label--s'

      expect(getSmallLabelClassFor(FieldType.TextArea)).toEqual(expectedClass)
      expect(getSmallLabelClassFor(FieldType.Text)).toEqual(expectedClass)
      expect(getSmallLabelClassFor(FieldType.Dropdown)).toEqual(expectedClass)
    })
  })
})
