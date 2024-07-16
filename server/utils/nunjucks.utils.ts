import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import { AnswerDto } from '../services/strengthsBasedNeedsService'
import { FieldType } from '../@types/hmpo-form-wizard/enums'
import { HandoverPrincipal } from '../services/arnsHandoverService'

export const toOptionDescription = (answer: AnswerDto): string => {
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

export const toErrorSummary = (errors: Record<string, ValidationError>): ErrorSummaryItem[] =>
  Object.entries(errors).map(([_, e]) => ({ text: e.message, href: `#${e.key}-error` }))

export const answerIncludes = (value: string, answer: Array<string> = []) => answer.includes(value)

export const getLabelForOption = (field: FormWizard.Field, value: string) => {
  const option = (field.options || [])
    .filter(o => o.kind === 'option')
    .find((o: FormWizard.Field.Option) => o.value === value) as FormWizard.Field.Option
  return option ? option.text : value
}

export const getSelectedAnswers = (field: FormWizard.Field) =>
  ((field.options?.filter(o => o.kind === 'option') as Array<FormWizard.Field.Option>) || [])
    .filter(o => o.checked)
    .map(o => o.text)
    .join(', ')

export const isNonRenderedField = (field: string) =>
  field.endsWith('_section_complete') || field === 'assessment_complete'

export const isPractitionerAnalysisField = (field: string) => field.includes('_practitioner_analysis_')

export const removeNonRenderedFields = (fields: string[] = []): string[] =>
  fields.filter(field => !isNonRenderedField(field))

export const formatDateForDisplay = (value: string): string => {
  if (!value) {
    return null
  }

  const date = DateTime.fromISO(value)
  return date.isValid ? date.toFormat('dd MMMM y') : null
}

export const urlSafe = (text: string) => text.replace(/[|&;$%@"<>()+,]/g, '').replace(/\s+/g, '-')

export const startsWith = (subject: string, startWith: string) => subject.startsWith(startWith)

export const isInEditMode = (user: HandoverPrincipal) => user.accessMode === 'READ_WRITE'

export const practitionerAnalysisStarted = (
  options: FormWizard.FormOptions,
  answers: Record<string, string | string[]>,
) =>
  Object.values(options.steps)
    .filter(step => step.section === options.section)
    .flatMap(step => Object.values(step.fields || {}).map(field => field.code))
    .filter(
      (fieldCode, index, self) =>
        fieldCode.match(new RegExp(`^${options.section}_practitioner_analysis_.*$`, 'gi')) &&
        self.indexOf(fieldCode) === index,
    )
    .some(fieldCode => answers[fieldCode])
