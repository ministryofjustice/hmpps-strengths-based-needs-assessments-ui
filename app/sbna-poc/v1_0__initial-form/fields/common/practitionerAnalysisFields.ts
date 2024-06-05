import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  getMediumLabelClassFor,
  inlineRadios,
  requiredWhenValidator,
  summaryCharacterLimit,
  yesNoOptions,
} from '../common'

const analysisRadioGroupClasses = `${inlineRadios} radio-group--analysis`

// eslint-disable-next-line import/prefer-default-export
export const createPractitionerAnalysisFieldsWith = (prefix: string, prefix2: string): Array<FormWizard.Field> => [
  {
    text: `Are there any strengths or protective factors related to [subject]'s ${prefix2}?`,
    hint: {
      text: 'Include any strategies, people or support networks that helped.',
      kind: 'text',
    },
    code: `${prefix}_practitioner_analysis_strengths_or_protective_factors`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: yesNoOptions,
    classes: analysisRadioGroupClasses,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    formGroupClasses: 'no-margin-bottom',
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
    text: `Is [subject]’s ${prefix2} linked to risk of serious harm?`,
    code: `${prefix}_practitioner_analysis_risk_of_serious_harm`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: yesNoOptions,
    classes: analysisRadioGroupClasses,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    formGroupClasses: 'no-margin-bottom',
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
    text: `Is [subject]’s ${prefix2} linked to risk of reoffending?`,
    code: `${prefix}_practitioner_analysis_risk_of_reoffending`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: yesNoOptions,
    classes: analysisRadioGroupClasses,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    formGroupClasses: 'no-margin-bottom',
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
]
