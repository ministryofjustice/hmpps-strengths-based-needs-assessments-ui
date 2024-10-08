import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import { AnswerDto } from '../services/strengthsBasedNeedsService'
import { FieldType } from '../@types/hmpo-form-wizard/enums'
import { HandoverPrincipal } from '../services/arnsHandoverService'

export const toOptionDescription = (answer: AnswerDto): string => {
  switch (answer.type) {
    case FieldType.Radio:
    case FieldType.Dropdown:
    case FieldType.AutoComplete:
      return answer.options.find(option => option.value === answer.value)?.text || answer.value
    case FieldType.CheckBox:
      return (answer.values || [])
        .map(selected => answer.options.find(option => option.value === selected)?.text || selected)
        .join(', ')
    default:
      return answer.value || ''
  }
}

type ValidationError = { text: string; href: string } & FormWizard.Controller.Error

export const toErrorSummary = (errors: FormWizard.Controller.Errors): ValidationError[] =>
  Object.values(errors)
    .flatMap(it => (it.messageGroup ? Object.values(it.messageGroup) : it))
    .map(it => ({ ...it, text: it.message, href: `#${it.key}-error` }))

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

export const getRenderedFields = (fields: string[], step: FormWizard.RenderedStep) =>
  fields.filter(field => step.fields[field].hidden !== true)

export const formatDateForDisplay = (value: string): string => {
  if (!value) {
    return null
  }

  const date = DateTime.fromISO(value)
  return date.isValid ? date.toFormat('dd MMMM y') : null
}

export const displayDateForToday = (today: DateTime = DateTime.now()) => {
  return today.toFormat('dd MMMM y')
}

export const urlSafe = (text: string) => text.replace(/[|&;$%@"<>()+,]/g, '').replace(/\s+/g, '-')

export const startsWith = (subject: string, startWith: string) => subject.startsWith(startWith)

export const isInEditMode = (user: HandoverPrincipal) => user.accessMode === 'READ_WRITE'

export const outdent = (str: string, count: number) =>
  str
    .split('\n')
    .map(it => (it.startsWith(' '.repeat(count)) ? it.substring(count) : it))
    .join('\n')

export const practitionerAnalysisStarted = (
  options: FormWizard.FormOptions,
  answers: Record<string, string | string[]>,
) =>
  Object.values(options.steps)
    .filter(step => step.section === options.section)
    .flatMap(step => Object.values(step.fields || {}).map(field => field.code))
    .filter(
      (fieldCode, index, self) =>
        fieldCode.match(/^.*_practitioner_analysis_.*$/gi) && self.indexOf(fieldCode) === index,
    )
    .some(fieldCode => answers[fieldCode])

export const ordinalWordFromNumber = (n: number): string => {
  const ordinals = [
    'zeroth',
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
    'eleventh',
    'twelfth',
    'thirteenth',
    'fourteenth',
    'fifteenth',
    'sixteenth',
    'seventeenth',
    'eighteenth',
    'nineteenth',
    'twentieth',
  ]

  return n <= 20 ? ordinals[n] : n.toString()
}
