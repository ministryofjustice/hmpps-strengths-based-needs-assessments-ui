import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import { HandoverPrincipal } from '../services/arnsHandoverService'
import { FieldAnswer } from '../../app/utils/fieldDependencyTreeBuilder'
import characterLimits from '../../app/form/v1_0/config/characterLimits'

type ValidationError = { text: string; href: string } & FormWizard.Controller.Error

export const toErrorSummary = (errors: FormWizard.Controller.Errors): ValidationError[] =>
  Object.values(errors)
    .flatMap(it => (it.messageGroup ? Object.values(it.messageGroup) : it))
    .map(it => ({ ...it, text: it.message, href: `#${it.key}-error` }))

export const isNonRenderedField = (field: string) =>
  field.endsWith('_section_complete') || field === 'assessment_complete'

export const getRenderedFields = (fields: string[], step: FormWizard.RenderedStep) =>
  fields.filter(field => step.fields[field].hidden !== true)

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

export const getMaxCharacterCount = (field: FormWizard.Field) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field.validate?.find(rule => (<any>rule).type === 'validateMaxLength')?.arguments[0] || characterLimits.default

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setProp = (obj: any, prop: string, value: any) => ({ ...obj, [prop]: value })

export const display = (answer: FieldAnswer): string =>
  answer.html ? answer.html : answer.text.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2')
