import FormWizard, { FieldType } from 'hmpo-form-wizard'
import {
  combineDateFields,
  formatForNunjucks,
  whereSelectable,
  withPlaceholdersFrom,
  withValuesFrom,
} from './saveAndContinue.utils'

describe('saveAndContinue.utils', () => {
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
})
