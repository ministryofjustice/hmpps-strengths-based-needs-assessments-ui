import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import { FieldType } from '../../../../server/@types/hmpo-form-wizard/enums'

export const summaryCharacterLimit = 1000

export const getLabelClassFor = (size: string) => (type: FieldType) =>
  type === FieldType.CheckBox || type === FieldType.Radio || type === FieldType.Date
    ? `govuk-fieldset__legend--${size}`
    : `govuk-label--${size}`
export const getMediumLabelClassFor = getLabelClassFor('m')
export const getSmallLabelClassFor = getLabelClassFor('s')

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

export function validateFutureDate(value: string) {
  const now = DateTime.now().startOf('day')
  const date = DateTime.fromISO(value)
  return !value || value === '' ? true : date.isValid && date >= now
}

export function validatePastDate(value: string) {
  const now = DateTime.now().startOf('day')
  const date = DateTime.fromISO(value)
  return !value || value === '' ? true : date.isValid && date <= now
}

export function requiredWhenValidator(field: string, requiredValue: string) {
  return function validatedRequiredWhen(value: string = '') {
    const dependentFieldAnswer = this.values[field]

    const answeredWithRequiredValue = Array.isArray(dependentFieldAnswer)
      ? dependentFieldAnswer.includes(requiredValue)
      : dependentFieldAnswer === requiredValue
    const checkValue = (v: string | string[]) => (Array.isArray(v) ? v.length > 0 : v !== '')

    return !answeredWithRequiredValue || (answeredWithRequiredValue && checkValue(value))
  }
}

export const fieldCodeWith = (...parts: string[]) => parts.map(it => it.trim().toLowerCase()).join('_')

export const toFormWizardFields = (allFields: FormWizard.Fields, field: FormWizard.Field): FormWizard.Fields => ({
  ...allFields,
  [field.id || field.code]: field,
})
