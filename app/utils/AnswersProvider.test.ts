import FormWizard from 'hmpo-form-wizard'
import { FieldType } from '../../server/@types/hmpo-form-wizard/enums'
import AnswersProvider, { FieldAnswer } from './AnswersProvider'

describe('app/utils/AnswersProvider', () => {
  const answersProviderWith = (field: string, value: string | string[]) => new AnswersProvider({ [field]: value })

  describe('getAnswers', () => {
    it('should return a string value as array', () => {
      const sut = answersProviderWith('test', 'val')
      expect(sut.getAnswers('test')).toEqual(['val'])
    })

    it('should return an array value as array', () => {
      const sut = answersProviderWith('test', ['val'])
      expect(sut.getAnswers('test')).toEqual(['val'])
    })

    it('should return null when the field does not exist', () => {
      const sut = answersProviderWith('test', 'val')
      expect(sut.getAnswers('foo')).toBeNull()
    })

    it('should return null when the value is undefined', () => {
      const sut = answersProviderWith('test', undefined)
      expect(sut.getAnswers('foo')).toBeNull()
    })

    it('should return null when value is an empty array', () => {
      const sut = answersProviderWith('test', [])
      expect(sut.getAnswers('test')).toBeNull()
    })

    it('should return null when value is an empty string', () => {
      const sut = answersProviderWith('test', '')
      expect(sut.getAnswers('test')).toBeNull()
    })
  })

  describe('getFieldAnswers', () => {
    const optionsField: FormWizard.Field = {
      id: 'q1',
      text: 'Q1',
      code: 'q1',
      type: undefined,
      options: [
        { text: 'Value 1', value: 'val1', kind: 'option' },
        { text: 'Value 2', value: 'val2', kind: 'option' },
      ],
    }
    const textField: FormWizard.Field = { id: 'q2', text: 'Q2', code: 'q2', type: undefined }

    it('should return radio button answer', () => {
      optionsField.type = FieldType.Radio
      const answersProvider = new AnswersProvider({ q1: 'val1' })
      const expected: FieldAnswer[] = [{ text: 'Value 1', value: 'val1', nestedFields: [] }]
      expect(answersProvider.getFieldAnswers(optionsField)).toEqual(expected)
    })

    it('should return dropdown answer', () => {
      optionsField.type = FieldType.Dropdown
      const answersProvider = new AnswersProvider({ q1: 'val2' })
      const expected: FieldAnswer[] = [{ text: 'Value 2', value: 'val2', nestedFields: [] }]
      expect(answersProvider.getFieldAnswers(optionsField)).toEqual(expected)
    })

    it('should return checkbox answers', () => {
      optionsField.type = FieldType.CheckBox
      const answersProvider = new AnswersProvider({ q1: ['val1', 'val2'] })
      const expected: FieldAnswer[] = [
        { text: 'Value 1', value: 'val1', nestedFields: [] },
        { text: 'Value 2', value: 'val2', nestedFields: [] },
      ]
      expect(answersProvider.getFieldAnswers(optionsField)).toEqual(expected)
    })

    it('should return textarea answer', () => {
      textField.type = FieldType.TextArea
      const answersProvider = new AnswersProvider({ q2: 'free text' })
      const expected: FieldAnswer[] = [{ text: 'free text', value: 'free text', nestedFields: [] }]
      expect(answersProvider.getFieldAnswers(textField)).toEqual(expected)
    })

    it('should return text field answer', () => {
      textField.type = FieldType.Text
      const answersProvider = new AnswersProvider({ q2: 'free text' })
      const expected: FieldAnswer[] = [{ text: 'free text', value: 'free text', nestedFields: [] }]
      expect(answersProvider.getFieldAnswers(textField)).toEqual(expected)
    })

    it('should return date field answer', () => {
      textField.type = FieldType.Date
      const answersProviderDate = new AnswersProvider({ q2: '1970-01-01' })
      const expectedDate: FieldAnswer[] = [{ text: '1 January 1970', value: '1 January 1970', nestedFields: [] }]
      expect(answersProviderDate.getFieldAnswers(textField)).toEqual(expectedDate)
    })

    it('should return an empty array when no answer exists', () => {
      optionsField.type = FieldType.Radio
      const answersProvider = new AnswersProvider({ q2: 'free text' })
      expect(answersProvider.getFieldAnswers(optionsField)).toEqual([])
    })
  })
})

