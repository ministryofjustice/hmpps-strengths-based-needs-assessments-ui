import { FieldType } from 'hmpo-form-wizard'
import { AnswerDto } from '../../../../server/services/strengthsBasedNeedsService'
import { flattenAnswers, mergeAnswers } from './saveAndContinueController.utils'

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
    it('transforms persisted answers in to simple key/value pairs', () => {
      const persistedAnswers: Record<string, AnswerDto> = {
        single_value_field: { description: 'Single value field', type: FieldType.Text, value: 'FOO' },
        single_value_field_2: { description: 'Single value field', type: FieldType.Text, value: 'not updated' },
        multiple_value_field: {
          description: 'Multiple value field',
          type: FieldType.CheckBox,
          values: ['FOO', 'BAR', 'BAZ'],
        },
        multiple_value_field_2: {
          description: 'Multiple value field',
          type: FieldType.CheckBox,
          values: ['NOT_UPDATED'],
        },
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
})
