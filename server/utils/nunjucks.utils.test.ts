import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { AnswerDto } from '../services/strengthsBasedNeedsService'
import {
  answerIncludes,
  formatDateForDisplay,
  getLabelForOption,
  getSelectedAnswers,
  removeSectionCompleteFields,
  toErrorSummary,
  toOptionDescription,
} from './nunjucks.utils'

describe('server/utils/nunjucks.utils', () => {
  describe('toOptionDescription', () => {
    const optionAnswerOfType = (type: FieldType): AnswerDto => ({
      type,
      description: 'Test field',
      options: [
        { text: 'Option 1', value: 'FIRST_OPTION' },
        { text: 'Option 2', value: 'SECOND_OPTION' },
        { text: 'Option 3', value: 'THIRD_OPTION' },
      ],
    })

    const radioAnswerWithValue = (value: string): AnswerDto => ({
      ...optionAnswerOfType(FieldType.Radio),
      value,
    })

    const checkboxAnswerWithValue = (values: string[]): AnswerDto => ({
      ...optionAnswerOfType(FieldType.CheckBox),
      values,
    })

    const dropdownAnswerWithValue = (value: string): AnswerDto => ({
      ...optionAnswerOfType(FieldType.Dropdown),
      value,
    })

    it('returns the option label for a radio field type', () => {
      const answer = radioAnswerWithValue('SECOND_OPTION')
      expect(toOptionDescription(answer)).toEqual('Option 2')
    })

    it('returns the value when unable to find the label for a radio field type', () => {
      const answer = radioAnswerWithValue('MISSING_OPTION')
      expect(toOptionDescription(answer)).toEqual('MISSING_OPTION')
    })

    it('returns the option labels for a checkbox field type', () => {
      const answer = checkboxAnswerWithValue(['SECOND_OPTION', 'THIRD_OPTION'])
      expect(toOptionDescription(answer)).toEqual('Option 2, Option 3')
    })

    it('returns the value when unable to find the label for a checkbox field type', () => {
      const answer = checkboxAnswerWithValue(['MISSING_OPTION'])
      expect(toOptionDescription(answer)).toEqual('MISSING_OPTION')
    })

    it('returns the option label for a radio field type', () => {
      const answer = dropdownAnswerWithValue('SECOND_OPTION')
      expect(toOptionDescription(answer)).toEqual('Option 2')
    })

    it('returns the value when unable to find the label for a radio field type', () => {
      const answer = dropdownAnswerWithValue('MISSING_OPTION')
      expect(toOptionDescription(answer)).toEqual('MISSING_OPTION')
    })
  })

  describe('toErrorSummary', () => {
    it('', () => {
      const errors = {
        foo: { key: 'foo', message: 'Foo is required' },
        bar: { key: 'bar', message: 'Bar is required' },
        baz: { key: 'baz', message: 'Baz is required' },
      }

      expect(toErrorSummary(errors)).toEqual([
        { text: 'Foo is required', href: '#foo-error' },
        { text: 'Bar is required', href: '#bar-error' },
        { text: 'Baz is required', href: '#baz-error' },
      ])
    })
  })

  describe('answerIncludes', () => {
    it('returns true when the answer array contains the value', () => {
      expect(answerIncludes('foo', ['foo', 'bar', 'baz'])).toEqual(true)
    })

    it('returns false when the answer array does not contain the value', () => {
      expect(answerIncludes('foo', [])).toEqual(false)
    })

    it('returns false when the answer array does not exist', () => {
      expect(answerIncludes('foo', undefined)).toEqual(false)
    })
  })

  describe('getLabelForOption', () => {
    it('returns the label when passed a value for an option', () => {
      const field: FormWizard.Field = {
        text: 'Foo field',
        code: 'foo_field',
        type: FieldType.Radio,
        options: [
          { text: 'Option 1', value: 'FIRST_OPTION', kind: 'option' },
          { text: 'Option 2', value: 'SECOND_OPTION', kind: 'option' },
          { text: 'Option 3', value: 'THIRD_OPTION', kind: 'option' },
        ],
      }

      expect(getLabelForOption(field, 'SECOND_OPTION')).toEqual('Option 2')
    })

    it('returns the passed value when the option could not be found', () => {
      const field: FormWizard.Field = {
        text: 'Foo field',
        code: 'foo_field',
        type: FieldType.Radio,
        options: [
          { text: 'Option 1', value: 'FIRST_OPTION', kind: 'option' },
          { text: 'Option 2', value: 'SECOND_OPTION', kind: 'option' },
          { text: 'Option 3', value: 'THIRD_OPTION', kind: 'option' },
        ],
      }

      expect(getLabelForOption(field, 'MISSING_OPTION')).toEqual('MISSING_OPTION')
    })
  })

  describe('getSelectedAnswers', () => {
    it('returns a formatted list of option labels that have been selected', () => {
      const field: FormWizard.Field = {
        text: 'Foo field',
        code: 'foo_field',
        type: FieldType.Radio,
        options: [
          { text: 'Option 1', value: 'FIRST_OPTION', kind: 'option' },
          { text: 'Option 2', value: 'SECOND_OPTION', kind: 'option', checked: true },
          { text: 'Option 3', value: 'THIRD_OPTION', kind: 'option', checked: true },
        ],
      }

      expect(getSelectedAnswers(field)).toEqual('Option 2, Option 3')
    })

    it('returns an empty string when no options have been selected', () => {
      const field: FormWizard.Field = {
        text: 'Foo field',
        code: 'foo_field',
        type: FieldType.Radio,
        options: [
          { text: 'Option 1', value: 'FIRST_OPTION', kind: 'option' },
          { text: 'Option 2', value: 'SECOND_OPTION', kind: 'option' },
          { text: 'Option 3', value: 'THIRD_OPTION', kind: 'option' },
        ],
      }

      expect(getSelectedAnswers(field)).toEqual('')
    })
  })

  describe('removeSectionCompleteFields', () => {
    it('removes fields with the "_section_complete" suffix', () => {
      const fields = ['foo_field', 'foo_section_complete', 'foo_analysis_section_complete', 'field_that_ends_complete']

      expect(removeSectionCompleteFields(fields)).toEqual(['foo_field', 'field_that_ends_complete'])
    })

    it('returns empty when the passed array is empty or missing', () => {
      expect(removeSectionCompleteFields([] as string[])).toEqual([])
      expect(removeSectionCompleteFields(undefined)).toEqual([])
    })
  })

  describe('formatDateForDisplay', () => {
    it('returns the data in the format', () => {
      expect(formatDateForDisplay('2023-08-02')).toEqual('02 August 2023')
    })

    it('returns null when passed a null/undefined value', () => {
      expect(formatDateForDisplay(null)).toEqual(null)
      expect(formatDateForDisplay(undefined)).toEqual(null)
    })

    it('returns null when passed an invalid date', () => {
      expect(formatDateForDisplay('99-99-9999')).toEqual(null)
      expect(formatDateForDisplay('foo date')).toEqual(null)
      expect(formatDateForDisplay('')).toEqual(null)
    })
  })
})
