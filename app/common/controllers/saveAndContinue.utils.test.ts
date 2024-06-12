import FormWizard, { FieldType } from 'hmpo-form-wizard'
import {
  buildRequestBody,
  combineDateFields,
  flattenAnswers,
  formatForNunjucks,
  mergeAnswers,
  whereSelectable,
  withPlaceholdersFrom,
  withValuesFrom,
} from './saveAndContinue.utils'
import { AnswerDto } from '../../../server/services/strengthsBasedNeedsService'

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

  describe('flattenAnswers', () => {
    it('transforms persisted answers in to simple key/value pairs', () => {
      const persistedAnswers: Record<string, AnswerDto> = {
        single_value_field: { description: 'Single value field', type: FieldType.Text, value: 'FOO' },
        multiple_value_field: {
          description: 'Multiple value field',
          type: FieldType.CheckBox,
          values: ['FOO', 'BAR', 'BAZ'],
        },
      }

      const result = flattenAnswers(persistedAnswers)

      expect(result).toEqual({
        single_value_field: 'FOO',
        multiple_value_field: ['FOO', 'BAR', 'BAZ'],
      })
    })
  })

  describe('mergeAnswers', () => {
    it('applies submitted answers over persisted answers', () => {
      const persistedAnswers: Record<string, string | string[]> = {
        single_value_field: 'FOO',
        single_value_field_2: 'not updated',
        multiple_value_field: ['FOO', 'BAR', 'BAZ'],
        multiple_value_field_2: ['NOT_UPDATED'],
      }

      const submittedAnswers: Record<string, string | string[]> = {
        single_value_field: 'updated',
        multiple_value_field: ['UPDATED'],
      }

      const result = mergeAnswers(persistedAnswers, submittedAnswers)

      expect(result).toEqual({
        single_value_field: 'updated',
        single_value_field_2: 'not updated',
        multiple_value_field: ['UPDATED'],
        multiple_value_field_2: ['NOT_UPDATED'],
      })
    })
  })

  describe('buildRequestBody', () => {
    const options: FormWizard.Field.Options = [
      { text: 'Foo', value: 'FOO', kind: 'option' },
      { text: 'Bar', value: 'BAR', kind: 'option' },
      { text: 'Bar', value: 'BAZ', kind: 'option' },
    ]

    const parentFieldOfType = (type: FieldType): FormWizard.Field => ({
      text: 'Parent Field',
      code: 'parent_field',
      type,
      options,
    })

    describe('answersToAdd', () => {
      it('lists field codes where the parent has a single value and the dependency has been met', () => {
        const parentField = parentFieldOfType(FieldType.Radio)
        const fields: FormWizard.Fields = {
          parent_field: parentField,
          foo_dependent: {
            text: 'Child Field',
            code: 'foo_dependent',
            type: FieldType.Radio,
            options,
            dependent: {
              field: parentField.code,
              value: 'FOO',
            },
          },
          bar_dependent: {
            text: 'Child Field',
            code: 'bar_dependent',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAR',
            },
          },
          baz_dependent: {
            text: 'Child Field',
            code: 'baz_dependent',
            type: FieldType.Text,
            dependent: {
              field: 'foo_dependent',
              value: 'BAZ',
            },
          },
        }

        const submittedAnswers: Record<string, string | string[]> = {
          parent_field: 'FOO',
          foo_dependent: 'BAZ',
          bar_dependent: 'Bar dependents value',
          baz_dependent: 'Baz dependents value',
        }

        const result = buildRequestBody(fields, fields, submittedAnswers)

        expect(result.answersToAdd).toEqual({
          parent_field: { description: 'Parent Field', options, type: 'RADIO', value: 'FOO' },
          foo_dependent: { description: 'Child Field', options, type: 'RADIO', value: 'BAZ' },
          baz_dependent: { description: 'Child Field', type: 'TEXT', value: 'Baz dependents value' },
        })
      })

      it('lists field codes where the parent has multiple values and the dependency has been met', () => {
        const parentField = parentFieldOfType(FieldType.CheckBox)
        const fields: FormWizard.Fields = {
          parent_field: parentField,
          foo_dependent: {
            text: 'Child Field',
            code: 'foo_dependent',
            type: FieldType.Text,
            options,
            dependent: {
              field: parentField.code,
              value: 'FOO',
            },
          },
          bar_dependent: {
            text: 'Child Field',
            code: 'bar_dependent',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAR',
            },
          },
          baz_dependent: {
            text: 'Child Field',
            code: 'baz_dependent',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAZ',
            },
          },
        }

        const submittedAnswers: Record<string, string | string[]> = {
          parent_field: ['FOO', 'BAR'],
          foo_dependent: 'Foo dependents value',
          bar_dependent: 'Bar dependents value',
          baz_dependent: 'Baz dependents value',
        }

        const result = buildRequestBody(fields, fields, submittedAnswers)

        expect(result.answersToAdd).toEqual({
          parent_field: { description: 'Parent Field', options, type: 'CHECKBOX', values: ['FOO', 'BAR'] },
          foo_dependent: { description: 'Child Field', type: 'TEXT', value: 'Foo dependents value' },
          bar_dependent: { description: 'Child Field', type: 'TEXT', value: 'Bar dependents value' },
        })
      })
    })

    describe('answersToRemove', () => {
      it('lists field codes where the parent has a single value and the dependency is not met', () => {
        const parentField = parentFieldOfType(FieldType.Radio)
        const fields: FormWizard.Fields = {
          parent_field: parentField,
          foo_dependent: {
            text: 'Child Field',
            code: 'foo_dependent',
            type: FieldType.Radio,
            options,
            dependent: {
              field: parentField.code,
              value: 'FOO',
            },
          },
          bar_dependent: {
            text: 'Child Field',
            code: 'bar_dependent',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAR',
            },
          },
          baz_dependent: {
            text: 'Child Field',
            code: 'baz_dependent',
            type: FieldType.Text,
            dependent: {
              field: 'foo_dependent',
              value: 'BAZ',
            },
          },
        }

        const submittedAnswers: Record<string, string | string[]> = {
          parent_field: 'BAR',
        }

        const result = buildRequestBody(fields, fields, submittedAnswers)

        expect(result.answersToRemove).toEqual(['foo_dependent', 'baz_dependent'])
      })

      it('lists field codes where the parent has multiple values and the dependency is not met', () => {
        const parentField = parentFieldOfType(FieldType.CheckBox)
        const fields: FormWizard.Fields = {
          parent_field: parentField,
          foo_dependent: {
            text: 'Child Field',
            code: 'foo_dependent',
            type: FieldType.Radio,
            options,
            dependent: {
              field: parentField.code,
              value: 'FOO',
            },
          },
          bar_dependent: {
            text: 'Child Field',
            code: 'bar_dependent',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAR',
            },
          },
          baz_dependent: {
            text: 'Child Field',
            code: 'baz_dependent',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAZ',
            },
          },
        }

        const submittedAnswers: Record<string, string | string[]> = {
          parent_field: ['FOO', 'BAR'],
        }

        const result = buildRequestBody(fields, fields, submittedAnswers)

        expect(result.answersToRemove).toEqual(['baz_dependent'])
      })

      it('does not include fields sharing question codes where at least one dependency is met', () => {
        const parentField = parentFieldOfType(FieldType.Radio)
        const fields: FormWizard.Fields = {
          parent_field: parentField,
          foo_dependent: {
            text: 'Child Field',
            code: 'shared_code',
            type: FieldType.Radio,
            options,
            dependent: {
              field: parentField.code,
              value: 'FOO',
            },
          },
          bar_dependent: {
            text: 'Child Field',
            code: 'shared_code',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAR',
            },
          },
          baz_dependent: {
            text: 'Child Field',
            code: 'shared_code',
            type: FieldType.Text,
            dependent: {
              field: parentField.code,
              value: 'BAZ',
            },
          },
        }

        const submittedAnswers: Record<string, string | string[]> = {
          parent_field: 'FOO',
        }

        const result = buildRequestBody(fields, fields, submittedAnswers)

        expect(result.answersToRemove).toEqual([])
      })
    })
  })
})
