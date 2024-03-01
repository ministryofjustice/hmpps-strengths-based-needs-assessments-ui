import FormWizard, { FieldType } from 'hmpo-form-wizard'
import {
  fieldCodeWith,
  validateFutureDate,
  toFormWizardFields,
  requiredWhenValidator,
  getMediumLabelClassFor,
} from './common'

describe('sbna-poc/fields/common', () => {
  describe('fieldCodeWith', () => {
    it('assembles the components of a field code', () => {
      expect(fieldCodeWith('prefix', 'field_code', 'suffix')).toEqual('prefix_field_code_suffix')
    })

    it('tidies up the input', () => {
      expect(fieldCodeWith('FOO', ' bar', 'baz ')).toEqual('foo_bar_baz')
    })
  })

  describe('toFormWizardFields', () => {
    it('transforms an array of fields to Form Wizard field configuration', () => {
      const field: FormWizard.Field = {
        code: 'field_code',
        text: 'Test Field',
        type: FieldType.Text,
      }
      const fields = [field]

      const result = fields.reduce(toFormWizardFields, {})

      expect(result[field.code]).toEqual(field)
    })

    it('uses the ID when present', () => {
      const field: FormWizard.Field = {
        code: 'field_code',
        id: 'field_id',
        text: 'Test Field',
        type: FieldType.Text,
      }
      const fields = [field]

      const result = fields.reduce(toFormWizardFields, {})

      expect(result[field.id]).toEqual(field)
      expect(result[field.code]).toBeUndefined()
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

  describe('requiredWhenValidator', () => {
    const contextWithAnswers = (answers: Record<string, string | string[]>) => ({
      sessionModel: {
        options: {
          req: {
            form: {
              values: answers,
            },
          },
        },
      },
    })

    describe('when the the dependent field has a single value answer', () => {
      it('is valid when a value is present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: 'bar' }))('baz')).toEqual(true)
      })

      it('is invalid when a value is not present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: 'bar' }))('')).toEqual(false)
      })

      it('is valid when a value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({}))('baz')).toEqual(true)
      })

      it('is valid when no value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({}))('')).toEqual(true)
      })
    })

    describe('when the the dependent field has an array of answers', () => {
      it('is valid when a value is present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: ['bar'] }))('baz')).toEqual(true)
      })

      it('is invalid when a value is not present and the condition is met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: ['bar'] }))('')).toEqual(false)
      })

      it('is valid when a value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: [] }))('baz')).toEqual(true)
      })

      it('is valid when no value is present and the condition is not met', () => {
        const validate = requiredWhenValidator('foo', 'bar')

        expect(validate.bind(contextWithAnswers({ foo: [] }))('')).toEqual(true)
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
  })
})
