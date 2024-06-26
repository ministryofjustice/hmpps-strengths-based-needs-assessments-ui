import FormWizard from 'hmpo-form-wizard'
import { fieldCodeWith } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'

export const detailsCharacterLimit = 400

type DetailsFieldOptions = {
  parentFieldCode: string
  dependentValue?: string
  required?: boolean
  maxChars?: number
  textHint?: string
  htmlHint?: string
}

export const detailsFieldWith =
  (options: DetailsFieldOptions) =>
  (option: FormWizard.Field.Option): FormWizard.Field =>
    detailsField({ ...options, dependentValue: option.value })

export const detailsField = (options: DetailsFieldOptions): FormWizard.Field => {
  const maxChars = options.maxChars ? options.maxChars : detailsCharacterLimit
  const field: FormWizard.Field = {
    text: `Give details${options.required ? '' : ' (optional)'}`,
    code: fieldCodeWith(
      ...[options.parentFieldCode, options.dependentValue?.toLowerCase(), 'details'].filter(it => it),
    ),
    type: FieldType.TextArea,
    validate: [
      options.required ? { type: ValidationType.Required, message: 'Enter details' } : null,
      {
        type: ValidationType.MaxLength,
        arguments: [maxChars],
        message: `Details must be ${maxChars} characters or less`,
      },
    ].filter(it => it),
  }
  if (options.dependentValue) {
    field.dependent = {
      field: options.parentFieldCode,
      value: options.dependentValue,
      displayInline: true,
    }
  }
  if (options.textHint) {
    field.hint = { text: options.textHint, kind: 'text' }
  }
  if (options.htmlHint) {
    field.hint = { html: options.htmlHint, kind: 'html' }
  }
  return field
}
