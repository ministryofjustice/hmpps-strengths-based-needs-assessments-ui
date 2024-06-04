import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import { getMediumLabelClassFor, toFormWizardFields, yesNoOptions, validatePastDate, orDivider, visuallyHidden,} from './common'
import { createPractitionerAnalysisFieldsWith } from './common/practitionerAnalysisFields' 
import { detailsCharacterLimit, } from './common/detailsField'
import { formatDateForDisplay } from '../../../../server/utils/nunjucks.utils'


const endDateSummaryDisplay = (value: string) => `Expected end date:\n${formatDateForDisplay(value) || 'Not provided'}`
const offenceAnalysisDetailsCharacterLimit4k = 4000
const offenceAnalysisDetailsCharacterLimit1k = 1000

export const offenceAnalysisFields: Array<FormWizard.Field> = [
  {
    text: 'Enter a brief description of the offence',
    code: 'offence_analysis_description_of_offence',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit4k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit4k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit4k,
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),

  },
  {
    text: 'When did the offence happen?',
    code: 'offence_analysis_date',
    type: FieldType.Date,
    validate: [
      { type: ValidationType.Required, message: 'Enter the date of the offence' },
      { fn: validatePastDate, message: 'The date of the offence must be in the past' }
    ],
    summary: {
      displayFn: endDateSummaryDisplay,
      displayAlways: true,
    },
    labelClasses: getMediumLabelClassFor(FieldType.Date),
  },
  {
    text: 'Did the offence have any of the following elements?',
    code: 'offence_analysis_elements',
    hint: { text: 'Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select if the offence had any of the elements, or select ‘Not applicable’' }],
    options: [
      {
        text: 'Excessive violence or sadistic violence',
        value: 'EXCESSIVE_OR_SADISTIC_VIOLENCE',
        kind: 'option',
      },
      {
        text: 'Domestic abuse',
        value: 'DOMESTIC_ABUSE',
        kind: 'option',
      },
      {
        text: 'Sexual element',
        value: 'SEXUAL_ELEMENT',
        kind: 'option',
      },
      {
        text: 'Victim targeted',
        value: 'VICTIM_TARGETED',
        kind: 'option',
      },
      {
        text: 'Violence or threat of violence or coercion',
        value: 'VIOLENCE_OR_COERCION',
        kind: 'option',
      },
      orDivider,
      {
        text: 'None',
        value: 'NONE',
        kind: 'option',
        behaviour: 'exclusive',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'victim_targeted_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'offence_analysis_elements',
      value: 'VICTIM_TARGETED',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Why did the offence happen?',
    code: 'offence_analysis_reason',
    hint: { text: 'Consider any motivation and triggers.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.Required,
        message: `Enter details`,
      },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit4k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit4k} characters or less`,
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
    characterCountMax: offenceAnalysisDetailsCharacterLimit4k,
  }, 
  {
    text: 'What was [subject] trying to gain from the offence?',
    code: 'offence_analysis_gain',
    type: FieldType.CheckBox,
    hint: { text: 'Select all that apply.', kind: 'text' },
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select what they were trying to gain from the offence' }],
    options: [
      {
        text: 'Exerting power',
        value: 'EXERTING_POWER',
        kind: 'option',
      },
      {
        text: 'Fulfilling specific sexual desires',
        value: 'SEXUAL_DESIRES',
        kind: 'option',
      },
      {
        text: 'Impressing friends/associates',
        value: 'IMPRESSING_PEOPLE',
        kind: 'option',
      },
      {
        text: 'Individual was in a highly emotional state that clouded judgement',
        value: 'EMOTIONS_CLOUDED_JUDGEMENT',
        kind: 'option',
      },
      {
        text: 'Meeting basic financial needs',
        value: 'BASIC_FINANCIAL_NEEDS',
        kind: 'option',
      },
      {
        text: 'Supporting drug use',
        value: 'SUPPORTING_DRUG_USE',
        kind: 'option',
      },
      {
        text: 'Supporting lifestyle beyond basic needs',
        value: 'SUPPORTING_LIFESTYLE',
        kind: 'option',
      },
      {
        text: 'The individual was pressurised or led into offending by others',
        value: 'PRESSURISED',
        kind: 'option',
      },
      {
        text: 'Other',
        value: 'OTHER',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details (optional)',
    hint: { text: 'Give details (optional)', kind: 'text' },
    code: 'OTHER_OFFENCE_GAIN_DETAILS',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'offence_analysis_gain',
      value: 'OTHER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },   
  {
    text: 'Enter all victim details',
    code: 'offence_analysis_victim_details',
    hint: { text: 'Include things like age, sex, relationship to [subject] and impact.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.Required,
        message: `Enter details`,
      },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit1k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit1k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit1k,
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
  },  
  {
    text: 'Does [subject] recognise the impact or consequences on the victims or others and the wider community?',
    code: 'offence_analysis_impact_on_victims',
    type: FieldType.Radio,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select if they recognise the impact on the victim or consequences for others and the wider community' }],
    options: [
      {
        text: 'Yes',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    hint: { text: 'Give details (optional)', kind: 'text' },
    code: 'YES_IMPACT_ON_VICTIMS_DETAILS',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'offence_analysis_impact_on_victims',
      value: 'YES',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details (optional)',
    hint: { text: 'Give details (optional)', kind: 'text' },
    code: 'NO_IMPACT_ON_VICTIMS_DETAILS',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'offence_analysis_impact_on_victims',
      value: 'NO',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Is the offence linked to risk of serious harm, risks to the individual or other risks?',
    code: 'offence_analysis_risk',
    type: FieldType.Radio,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select if the offence is linked to risk of serious harm, risks to the individual or other risks' }],
    options: [
      {
        text: 'Yes',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'YES_OFFENCE_RISK_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit4k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit4k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit4k,
    dependent: {
      field: 'offence_analysis_risk',
      value: 'YES',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'NO_OFFENCE_RISK_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit4k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit4k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit4k,
    dependent: {
      field: 'offence_analysis_risk',
      value: 'NO',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'What are the patterns of offending?',
    code: 'offence_analysis_patterns_of_offending',
    hint: { text: 'Analyse previous convictions and offending behaviour.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [offenceAnalysisDetailsCharacterLimit1k],
        message: `Details must be ${offenceAnalysisDetailsCharacterLimit1k} characters or less`,
      },
    ],
    characterCountMax: offenceAnalysisDetailsCharacterLimit1k,
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
  },
  {
    text: 'Is there evidence that [subject] has ever been a perpetrator of domestic abuse?',
    code: 'offence_analysis_perpetrator_of_domestic_abuse',
    type: FieldType.Radio,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if there is any evidence that they have ever been perpetrator of domestic abuse',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Who was this committed against?',
    code: 'domestic_abuse_victim_type',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select an option' },
    ],
    options: [
      { text: 'Family member', value: 'FAMILY_MEMBER', kind: 'option' },
      { text: 'Intimate partner', value: 'INTIMATE_PARTNER', kind: 'option' },
      { text: 'Family member and intimate partner', value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER', kind: 'option' },
    ],
    dependent: {
      field: 'offence_analysis_perpetrator_of_domestic_abuse',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'VICTIM_FAMILY_MEMBER_DOMESTIC_ABUSE_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'domestic_abuse_victim_type',
      value: 'FAMILY_MEMBER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'VICTIM_INTIMATE_PARTNER_DOMESTIC_ABUSE_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'domestic_abuse_victim_type',
      value: 'INTIMATE_PARTNER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'VICTIM_FAMILY_AND_INTIMATE_PARTNER_DOMESTIC_ABUSE_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'domestic_abuse_victim_type',
      value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Is there evidence that [subject] has ever been a victim of domestic abuse?',
    code: 'offence_analysis_victim_of_domestic_abuse',
    type: FieldType.Radio,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if there is evidence that they have ever been victim of domestic abuse',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Who was this committed by?',
    code: 'domestic_abuse_perpetrator_type',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select an option' },
    ],
    options: [
      { text: 'Family member', value: 'FAMILY_MEMBER', kind: 'option' },
      { text: 'Intimate partner', value: 'INTIMATE_PARTNER', kind: 'option' },
      { text: 'Family member and intimate partner', value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER', kind: 'option' },
    ],
    dependent: {
      field: 'offence_analysis_victim_of_domestic_abuse',
      value: 'YES',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'PERPETRATOR_FAMILY_MEMBER_DOMESTIC_ABUSE_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'domestic_abuse_perpetrator_type',
      value: 'FAMILY_MEMBER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'PERPETRATOR_INTIMATE_PARTNER_DOMESTIC_ABUSE_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'domestic_abuse_perpetrator_type',
      value: 'INTIMATE_PARTNER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Give details',
    hint: { text: 'Give details', kind: 'text' },
    code: 'PERPETRATOR_FAMILY_AND_INTIMATE_PARTNER_DOMESTIC_ABUSE_DETAILS',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [detailsCharacterLimit],
        message: `Details must be ${detailsCharacterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'domestic_abuse_perpetrator_type',
      value: 'FAMILY_MEMBER_AND_INTIMATE_PARTNER',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
]


// export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith(
  
// )
// export const practitionerAnalysisFields: Array<FormWizard.Field> = []
  

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the offence analysis section complete?',
  code: 'offence_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the offence analysis section complete?',
  code: 'offence_analysis_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  // practitionerAnalysisFields,
  sectionCompleteFields,
  analysisSectionComplete,
  questionSectionComplete,
  offenceAnalysisFields,
]
  .flat()
  .reduce(toFormWizardFields, {})
