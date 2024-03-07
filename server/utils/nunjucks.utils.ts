import FormWizard, { FieldType } from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import { AnswerDto } from '../services/strengthsBasedNeedsService'

export function toOptionDescription(answer: AnswerDto): string {
  switch (answer.type) {
    case FieldType.Radio:
    case FieldType.Dropdown:
      return answer.options.find(option => option.value === answer.value)?.text || answer.value
    case FieldType.CheckBox:
      return (answer.values || [])
        .map(selected => answer.options.find(option => option.value === selected)?.text || selected)
        .join(', ')
    default:
      return answer.value || ''
  }
}

type ValidationError = { message: string; key: string }
type ErrorSummaryItem = { text: string; href: string }

export function toErrorSummary(errors: Record<string, ValidationError>): ErrorSummaryItem[] {
  return Object.entries(errors).map(([_, e]) => ({ text: e.message, href: `#${e.key}-error` }))
}

export function answerIncludes(value: string, answer: Array<string> = []) {
  return answer.includes(value)
}

export function getLabelForOption(field: FormWizard.Field, value: string) {
  const options = field.options || []
  const option = options
    .filter(o => o.kind === 'option')
    .find((o: FormWizard.Field.Option) => o.value === value) as FormWizard.Field.Option
  return option ? option.text : value
}

export function getSelectedAnswers(field: FormWizard.Field) {
  const options = (field.options?.filter(o => o.kind === 'option') as Array<FormWizard.Field.Option>) || []
  return options
    .filter(o => o.checked)
    .map(o => o.text)
    .join(', ')
}

export function removeSectionCompleteFields(fields: string[] = []): string[] {
  return fields.filter(it => !it.endsWith('_section_complete'))
}

export function removePractitionerAnalysisFields(fields: string[] = []): string[] {
  return fields.filter(it => !it.includes('_practitioner_analysis_'))
}

export function formatDateForDisplay(value: string): string {
  if (!value) {
    return null
  }

  const date = DateTime.fromISO(value)
  return date.isValid ? date.toFormat('dd MMMM y') : null
}
