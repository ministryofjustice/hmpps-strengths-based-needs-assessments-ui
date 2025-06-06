import FormWizard from 'hmpo-form-wizard'
import { DateTime } from 'luxon'
import { FieldType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import { unescape } from '../../../../utils/formatters'

export const getLabelClassFor = (size: string) => (type: FieldType) =>
  type === FieldType.CheckBox || type === FieldType.Radio || type === FieldType.Date
    ? `govuk-fieldset__legend--${size}`
    : `govuk-label--${size}`
export const getLargeLabelClassFor = getLabelClassFor('l')
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

export function validateMaxLength(value: string, maxLength: number) {
  return unescape(value || '').length <= maxLength
}

export function validatePastDate(value: string) {
  const now = DateTime.now().startOf('day')
  const date = DateTime.fromISO(value)
  return !value || value === '' ? true : date.isValid && date >= now
}

export function validateValidDate(value: string) {
  const date = DateTime.fromISO(value)
  return !value || value === '' ? true : date.isValid
}

type FieldScope = 'step' | 'assessment'

export function requiredWhenValidator(field: string, scope: FieldScope, requiredValue: string) {
  return function validatedRequiredWhen(value: string = '') {
    const dependentFieldAnswer =
      scope === 'assessment' && 'sessionModel' in this ? this.sessionModel.attributes[field] : this.values[field]

    const answeredWithRequiredValue = Array.isArray(dependentFieldAnswer)
      ? dependentFieldAnswer.includes(requiredValue)
      : dependentFieldAnswer === requiredValue
    const checkValue = (v: string | string[]) => (Array.isArray(v) ? v.length > 0 : v !== '')

    return !answeredWithRequiredValue || (answeredWithRequiredValue && checkValue(value))
  }
}

export const fieldCodeWith = (...parts: string[]) => parts.map(it => it.trim().toLowerCase()).join('_')

export const dependentOn = (
  field: FormWizard.Field,
  option: string,
  displayInline: boolean = true,
): FormWizard.Dependent => {
  if (Array.isArray(field.options) && field.options.findIndex(o => o.kind === 'option' && o.value === option) !== -1) {
    return {
      field: field.code,
      value: option,
      displayInline,
    }
  }
  throw Error(`Failed to create dependency, target field "${field.code}" does not contain the option "${option}"`)
}
