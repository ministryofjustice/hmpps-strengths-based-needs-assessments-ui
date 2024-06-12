import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, fieldCodesFrom } from './common'

describe('sbna-poc/steps/common', () => {
  describe('fieldCodesFrom', () => {
    it('returns a list of field codes', () => {
      const field: FormWizard.Field = {
        code: 'field_code',
        text: 'Test Field',
        type: FieldType.Text,
      }
      const fields = [field]

      const result = fieldCodesFrom(fields)

      expect(result).toContain(field.code)
    })

    it('uses the field ID when present', () => {
      const field: FormWizard.Field = {
        code: 'field_code',
        id: 'field_id',
        text: 'Test Field',
        type: FieldType.Text,
      }
      const fields = [field]

      const result = fieldCodesFrom(fields)

      expect(result).toContain(field.id)
      expect(result).not.toContain(field.code)
    })
  })

  describe('setField', () => {
    it('returns configuration for setting a fields value', () => {
      const fieldCode = 'field_code'
      const value = false

      const result = setFieldToIncomplete(fieldCode)

      expect(result.fieldCode).toEqual(fieldCode)
      expect(result.conditionFn()).toEqual(value)
    })
  })

  describe('setFieldWhenValid', () => {
    it('returns configuration for setting a fields value when valid', () => {
      const fieldCode = 'field_code'

      const result = setFieldToCompleteWhenValid(fieldCode)

      expect(result.fieldCode).toEqual(fieldCode)
      expect(result.conditionFn(true)).toEqual(true)
      expect(result.conditionFn(false)).toEqual(false)
    })
  })
})
