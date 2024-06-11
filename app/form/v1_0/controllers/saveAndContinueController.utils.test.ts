import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { AnswerDto } from '../../../../server/services/strengthsBasedNeedsService'
import { buildRequestBody, flattenAnswers, mergeAnswers } from './saveAndContinueController.utils'

describe('sbna-poc/controllers/saveAndContinueController.utils', () => {
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
