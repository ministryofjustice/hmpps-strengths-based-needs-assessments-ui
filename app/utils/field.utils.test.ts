import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../server/@types/hmpo-form-wizard/enums'
import {
  addAriaRequiredAttributeToRequiredFields,
  combineDateFields,
  formatForNunjucks,
  whereSelectable,
  withPlaceholdersFrom,
  withValuesFrom,
} from './field.utils'

describe('field.utils', () => {
  describe('withPlaceholdersFrom', () => {
    it('replaces the placeholder values in strings', () => {
      const field: FormWizard.Field = {
        text: "[person]'s details",
        code: 'person_details',
        type: FieldType.Text,
      }

      const personDetails = withPlaceholdersFrom({ person: 'Dave' })(field)

      expect(personDetails.text).toEqual("Dave's details")
    })

    it('leaves the placeholder values in strings when there is no replacement value', () => {
      const field: FormWizard.Field = {
        text: "[person]'s details",
        code: 'person_details',
        type: FieldType.Text,
      }

      const personDetails = withPlaceholdersFrom({ foo: 'Dave' })(field)

      expect(personDetails.text).toEqual("[person]'s details")
    })
  })

  describe('withValuesFrom', () => {
    it('maps values for field types when present', () => {
      const answers = {
        text_field: 'Text field value',
        text_area_field: 'Text area field value',
        radio_field: 'FOO',
        checkbox_field: ['FOO', 'BAZ'],
        date_field: '2023-2-1',
      }

      const [textField, textAreaField, radioField, checkboxField, dateField]: FormWizard.Field[] = [
        {
          text: 'Text field',
          code: 'text_field',
          type: FieldType.Text,
        },
        {
          text: 'Text area field',
          code: 'text_area_field',
          type: FieldType.TextArea,
        },
        {
          text: 'Radio field',
          code: 'radio_field',
          type: FieldType.Radio,
          options: [
            { text: 'Foo', value: 'FOO', kind: 'option' },
            { text: 'Bar', value: 'BAR', kind: 'option' },
          ] as FormWizard.Field.Options,
        },
        {
          text: 'Checkbox field',
          code: 'checkbox_field',
          type: FieldType.CheckBox,
          options: [
            { text: 'Foo', value: 'FOO', kind: 'option' },
            { text: 'Bar', value: 'BAR', kind: 'option' },
            { text: 'Baz', value: 'BAZ', kind: 'option' },
          ] as FormWizard.Field.Options,
        },
        {
          text: 'Date field',
          code: 'date_field',
          type: FieldType.Date,
        },
      ].map(withValuesFrom(answers))

      expect(textField.value).toEqual('Text field value')
      expect(textAreaField.value).toEqual('Text area field value')

      const [radioFirstOption, radioSecondOption] = radioField.options.filter(whereSelectable) || []
      expect(radioFirstOption.checked).toEqual(true)
      expect(radioSecondOption.checked).toEqual(false)

      const [checkboxFirstOption, checkboxSecondOption, checkboxThirdOption] =
        checkboxField.options.filter(whereSelectable) || []
      expect(checkboxFirstOption.checked).toEqual(true)
      expect(checkboxSecondOption.checked).toEqual(false)
      expect(checkboxThirdOption.checked).toEqual(true)

      expect(dateField.value).toEqual(['2023', '2', '1'])
    })

    it('handles when there are no values present', () => {
      const answers = {}

      const [textField, textAreaField, radioField, checkboxField, dateField]: FormWizard.Field[] = [
        {
          text: 'Text field',
          code: 'text_field',
          type: FieldType.Text,
        },
        {
          text: 'Text area field',
          code: 'text_area_field',
          type: FieldType.TextArea,
        },
        {
          text: 'Radio field',
          code: 'radio_field',
          type: FieldType.Radio,
          options: [
            { text: 'Foo', value: 'FOO', kind: 'option' },
            { text: 'Bar', value: 'BAR', kind: 'option' },
          ] as FormWizard.Field.Options,
        },
        {
          text: 'Checkbox field',
          code: 'checkbox_field',
          type: FieldType.CheckBox,
          options: [
            { text: 'Foo', value: 'FOO', kind: 'option' },
            { text: 'Bar', value: 'BAR', kind: 'option' },
          ] as FormWizard.Field.Options,
        },
        {
          text: 'Date field',
          code: 'date_field',
          type: FieldType.Date,
        },
      ].map(withValuesFrom(answers))

      expect(textField.value).toBeUndefined()
      expect(textAreaField.value).toBeUndefined()

      const [radioFirstOption, radioSecondOption] = radioField.options.filter(whereSelectable) || []
      expect(radioFirstOption.checked).toEqual(false)
      expect(radioSecondOption.checked).toEqual(false)

      const [checkboxFirstOption, checkboxSecondOption] = checkboxField.options.filter(whereSelectable) || []
      expect(checkboxFirstOption.checked).toEqual(false)
      expect(checkboxSecondOption.checked).toEqual(false)

      expect(dateField.value).toEqual([])
    })
  })

  describe('formatForNunjucks', () => {
    it('formats for nunjucks', () => {
      const input = '{ "key": "value", "subObject": { "key": "value", "subObject": {}}}'

      const output = formatForNunjucks(input)

      expect(output).toEqual('{ "key": "value", "subObject": { "key": "value", "subObject": {} } }')
    })
  })

  describe('combineDateFields', () => {
    it('combines the components of a date field', () => {
      const requestBody = {
        'date-day': '30',
        'date-month': '1',
        'date-year': '1970',
      }

      const preProcessedFields = {
        foo: 'bar',
        date: '',
      }

      const result = combineDateFields(requestBody, preProcessedFields)

      expect(result).toEqual({
        foo: 'bar',
        date: '1970-01-30',
      })
    })

    it('does not build the date when a component is missing', () => {
      const requestBody = {
        'date-day': '30',
        'date-month': '1',
        'date-year': '',
      }

      const preProcessedFields = {
        date: '',
      }

      const result = combineDateFields(requestBody, preProcessedFields)

      expect(result).toEqual({
        date: '',
      })
    })
  })

  describe('addAriaRequiredAttributeToRequiredFields', () => {
    it('adds aria-required attribute to all options except dividers and NONE values', () => {
      const field = {
        text: 'Sample text',
        code: 'sample_code',
        type: 'radio',
        validate: [{ type: ValidationType.Required, message: 'Validation error message' }],
        options: [
          { text: 'option0', kind: 'option', value: 'SETTLED' } as FormWizard.Field.Option,
          { kind: 'divider', divider: 'or' } as FormWizard.Field.Divider,
          { text: 'option2', kind: 'option', value: 'NONE' } as FormWizard.Field.Option,
        ],
      }

      const modifiedField = addAriaRequiredAttributeToRequiredFields()(field)

      // eslint-disable-next-line array-callback-return
      modifiedField.options.map((option: FormWizard.Field.Option) => {
        if (option.kind === 'option' && option.value !== 'NONE') {
          expect(option.attributes['aria-required']).toEqual(true)
        } else {
          expect(option.attributes).toBeUndefined()
        }
      })
    })

    it('preserves existing attributes while adding aria-required', () => {
      const field = {
        text: 'Sample text',
        code: 'sample_code',
        type: 'radio',
        validate: [{ type: ValidationType.Required, message: 'Validation error message' }],
        options: [
          {
            text: 'option0',
            kind: 'option',
            value: 'SETTLED',
            attributes: { existing: 'value' },
          } as FormWizard.Field.Option,
        ],
      }

      const modifiedField = addAriaRequiredAttributeToRequiredFields()(field)

      expect((modifiedField.options[0] as FormWizard.Field.Option).attributes).toEqual({
        existing: 'value',
        'aria-required': true,
      })
    })

    it('handles fields with no attributes gracefully', () => {
      const field = {
        text: 'Sample text',
        code: 'sample_code',
        type: 'radio',
        validate: [{ type: ValidationType.Required, message: 'Validation error message' }],
        options: [{ text: 'option0', kind: 'option', value: 'SETTLED' } as FormWizard.Field.Option],
      }

      const modifiedField = addAriaRequiredAttributeToRequiredFields()(field)

      expect((modifiedField.options[0] as FormWizard.Field.Option).attributes).toEqual({
        'aria-required': true,
      })
    })

    it('does not modify attributes of field without ValidationType.Required', () => {
      const field = {
        text: 'Sample text',
        code: 'sample_code',
        type: 'radio',
        options: [{ text: 'option0', kind: 'option', value: 'SETTLED' } as FormWizard.Field.Option],
      }

      const modifiedField = addAriaRequiredAttributeToRequiredFields()(field)

      expect((modifiedField.options[0] as FormWizard.Field.Option).attributes).toBeUndefined()
    })
  })
})
