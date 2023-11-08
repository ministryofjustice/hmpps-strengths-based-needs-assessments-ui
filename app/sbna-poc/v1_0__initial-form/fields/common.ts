import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'

export const characterLimit = 400
export const summaryCharacterLimit = 4000
export const mediumLabel = 'govuk-label--m'
export const visuallyHidden = 'govuk-visually-hidden'

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
