import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'

export const characterLimit = 400
export const summaryCharacterLimit = 4000
export const mediumLabel = 'govuk-label--m'
export const visuallyHidden = 'govuk-visually-hidden'
export const inlineRadios = 'govuk-radios--inline'
export const smallRadios = 'govuk-radios--small'

export const yesNoOptions: FormWizard.Field.Options = [
  { text: 'Yes', value: 'YES', kind: 'option' },
  { text: 'No', value: 'NO', kind: 'option' },
]

export const orDivider: FormWizard.Field.Divider = {
  divider: 'or',
  kind: 'divider',
}

export function futureDateValidator(value: string) {
  const now = DateTime.now().startOf('day')
  const date = DateTime.fromISO(value)
  return date >= now
}

export function requiredWhen(field: string, requiredValue: string) {
  return function validatedRequiredWhen(value: string = '') {
    const answers: Record<string, string | string[]> = this.sessionModel?.options?.req?.form?.submittedAnswers || {}
    const dependentFieldAnswer = answers[field]

    const answeredWithRequiredValue = Array.isArray(dependentFieldAnswer)
      ? dependentFieldAnswer.includes(requiredValue)
      : dependentFieldAnswer === requiredValue
    const checkValue = (v: string | string[]) => (Array.isArray(v) ? v.length > 0 : v !== '')

    return !answeredWithRequiredValue || (answeredWithRequiredValue && checkValue(value))
  }
}
