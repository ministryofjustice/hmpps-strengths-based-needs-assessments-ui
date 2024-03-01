import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import { DateTime } from 'luxon'

export const characterLimit = 400
export const summaryCharacterLimit = 4000
export const getMediumLabelClassFor = (type: FieldType) =>
  type === FieldType.CheckBox || type === FieldType.Radio || type === FieldType.Date
    ? 'govuk-fieldset__legend--m'
    : 'govuk-label--m'

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
  return date.isValid ? date >= now : true
}

export function requiredWhenValidator(field: string, requiredValue: string) {
  return function validatedRequiredWhen(value: string = '') {
    const answers: Record<string, string | string[]> = this.sessionModel?.options?.req?.form?.values || {}
    const dependentFieldAnswer = answers[field]

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

const analysisRadioGroupClasses = `${inlineRadios} radio-group--analysis`

export const createPractitionerAnalysisFieldsWith = (prefix: string): Array<FormWizard.Field> => [
  {
    text: 'Are there any patterns of behaviours related to this area?',
    hint: {
      text: 'Include repeated circumstances or behaviours.',
      kind: 'text',
    },
    code: `${prefix}_practitioner_analysis_patterns_of_behaviour`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    classes: analysisRadioGroupClasses,
  },
  {
    text: 'Give details',
    code: `${prefix}_practitioner_analysis_patterns_of_behaviour_details`,
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhenValidator(`${prefix}_practitioner_analysis_patterns_of_behaviour`, 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: {
      text: 'Include any strategies, people or support networks that helped.',
      kind: 'text',
    },
    code: `${prefix}_practitioner_analysis_strengths_or_protective_factors`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    classes: analysisRadioGroupClasses,
  },
  {
    text: 'Give details',
    code: `${prefix}_practitioner_analysis_strengths_or_protective_factors_details`,
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhenValidator(`${prefix}_practitioner_analysis_strengths_or_protective_factors`, 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  {
    text: 'Is this an area linked to risk of serious harm?',
    code: `${prefix}_practitioner_analysis_risk_of_serious_harm`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    classes: analysisRadioGroupClasses,
  },
  {
    text: 'Give details',
    code: `${prefix}_practitioner_analysis_risk_of_serious_harm_details`,
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhenValidator(`${prefix}_practitioner_analysis_risk_of_serious_harm`, 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  {
    text: 'Is this an area linked to risk of reoffending?',
    code: `${prefix}_practitioner_analysis_risk_of_reoffending`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    classes: analysisRadioGroupClasses,
  },
  {
    text: 'Give details',
    code: `${prefix}_practitioner_analysis_risk_of_reoffending_details`,
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhenValidator(`${prefix}_practitioner_analysis_risk_of_reoffending`, 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  {
    text: 'Is this an area of need which is not related to risk?',
    code: `${prefix}_practitioner_analysis_related_to_risk`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    classes: analysisRadioGroupClasses,
  },
  {
    text: 'Give details',
    code: `${prefix}_practitioner_analysis_related_to_risk_details`,
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhenValidator(`${prefix}_practitioner_analysis_related_to_risk`, 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
]

export const detailsFieldWith =
  (parentFieldCode: string) =>
  (option: FormWizard.Field.Option): FormWizard.Field => ({
    text: 'Give details (optional)',
    code: fieldCodeWith(parentFieldCode, option.value.toLowerCase(), 'details'),
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: parentFieldCode,
      value: option.value,
      displayInline: true,
    },
  })
