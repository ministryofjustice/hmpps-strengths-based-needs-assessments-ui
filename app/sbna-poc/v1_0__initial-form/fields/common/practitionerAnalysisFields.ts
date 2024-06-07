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
    classes: analysisRadioGroupClasses,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    formGroupClasses: 'no-margin-bottom',
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
    text: 'Is this an area linked to risk of serious harm?',
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
    text: 'Is this an area linked to risk of reoffending?',
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
  {
    text: 'Is this an area of need which is not related to risk?',
    code: `${prefix}_practitioner_analysis_related_to_risk`,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: yesNoOptions,
    classes: analysisRadioGroupClasses,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
    formGroupClasses: 'no-margin-bottom',
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
