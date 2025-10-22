import FormWizard from 'hmpo-form-wizard'
import { FieldType } from '../../../server/@types/hmpo-form-wizard/enums'
import { whereSelectable } from '../field.utils'
import { formatDateForDisplay } from '../formatters'
import { FieldAnswer } from '../fieldDependencyTreeBuilder'

export default class AnswersProvider {
  private readonly answers: FormWizard.Answers

  private answersOverride: FormWizard.Answers = null

  constructor(answers: FormWizard.Answers) {
    this.answers = answers
  }

  setOverride(override: FormWizard.Answers | null) {
    this.answersOverride = override
  }

  clearOverride() {
    this.answersOverride = null
  }

  getRawAnswers(): FormWizard.Answers {
    return this.answers
  }

  getAnswers(field: string, answersOverride: FormWizard.Answers = null): string[] | null {
    const answers = answersOverride || this.answers
    const fieldAnswer = answers[field]

    if (typeof fieldAnswer === 'string') {
      return fieldAnswer === '' ? null : [fieldAnswer]
    }

    if (!Array.isArray(fieldAnswer) || fieldAnswer.length === 0) {
      return null
    }

    return typeof fieldAnswer[0] === 'string' ? (fieldAnswer as string[]) : null
  }

  getFieldAnswers(field: FormWizard.Field): FieldAnswer[] {
    const answers = this.answersOverride || this.answers

    switch (field.type) {
      case FieldType.Radio:
      case FieldType.Dropdown:
      case FieldType.CheckBox:
      case FieldType.AutoComplete:
        return field.options
          .filter(o => whereSelectable(o) && this.getAnswers(field.code, answers)?.includes(o.value))
          .map(o => {
            return {
              text: whereSelectable(o) ? o.summary?.displayFn(o.text, o.value) || o.text : '',
              html: whereSelectable(o) ? o.html : null,
              value: whereSelectable(o) ? o.value : '',
              nestedFields: [],
            } as FieldAnswer
          })
      case FieldType.Date:
        return [
          {
            text: field.summary?.displayFn
              ? field.summary?.displayFn(answers[field.code] as string)
              : formatDateForDisplay(answers[field.code] as string) || '',
            value: formatDateForDisplay(answers[field.code] as string) || '',
            nestedFields: [],
          },
        ]
      default:
        return [
          {
            text: (answers[field.code] as string) || '',
            value: (answers[field.code] as string) || '',
            nestedFields: [],
          },
        ]
    }
  }
}
