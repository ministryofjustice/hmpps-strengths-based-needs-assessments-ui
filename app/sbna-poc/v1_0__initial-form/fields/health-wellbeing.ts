import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  detailsFieldWith,
  mediumLabel,
  orDivider,
  toFormWizardFields,
  yesNoOptions,
} from './common'

const headInjuryOrIllnessHint = `
<div class="govuk-!-width-two-thirds">
  <p class="govuk-hint">This includes:</p>
  <ul class="govuk-hint govuk-list govuk-list--bullet">
    <li>traumatic brain injury</li>
    <li>acquired brain injury</li>
    <li>having fits</li>
    <li>significant episodes of unconsciousness as a result of a head injury</li>
  <ul>
</div>
`

const positiveFactorsHint = `
<p class="govuk-hint">Consider what's helped them feel more hopeful.</p>
<p class="govuk-hint">Select all that apply.</p>
`

export const physicalOrMentalHealthProblemsFields: Array<FormWizard.Field> = [
  {
    text: 'Does [subject] have any physical health conditions?',
    code: 'health_wellbeing_physical_health_condition',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_physical_health_condition_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_physical_health_condition',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Does [subject] have any diagnosed mental health problems?',
    code: 'health_wellbeing_mental_health_condition',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any diagnosed mental health problems' }],
    options: [
      {
        text: 'Yes, ongoing - severe and documented over a prolonged period of time',
        value: 'YES_ONGOING_SEVERE',
        kind: 'option',
      },
      {
        text: 'Yes, ongoing - duration is not known or there is no link to offending',
        value: 'YES_ONGOING',
        kind: 'option',
      },
      { text: 'Yes, in the past', value: 'YES_IN_THE_PAST', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_mental_health_condition_yes_ongoing_severe_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_mental_health_condition',
      value: 'YES_ONGOING_SEVERE',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_mental_health_condition_yes_ongoing_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_mental_health_condition',
      value: 'YES_ONGOING',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_mental_health_condition_yes_in_the_past_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_mental_health_condition',
      value: 'YES_IN_THE_PAST',
      displayInline: true,
    },
  },
]

export const physicalHealthConditionsFields: Array<FormWizard.Field> = [
  {
    text: 'Give details if [subject] is on prescribed medication or treatment for physical health conditions (optional)',
    code: 'health_wellbeing_prescribed_medication_physical_conditions',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    labelClasses: mediumLabel,
  },
]

export const mentalHealthConditionsFields: Array<FormWizard.Field> = [
  {
    text: 'Give details if [subject] is on prescribed medication or treatment for mental health problems (optional)',
    code: 'health_wellbeing_prescribed_medication_mental_conditions',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    labelClasses: mediumLabel,
  },
]

export const baseHealthAndWellbeingQuestions: Array<FormWizard.Field> = [
  {
    text: 'Is [subject] currently having psychiatric treatment?',
    code: 'health_wellbeing_psychiatric_treatment',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they are currently having psychiatric treatment' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'Pending treatment', value: 'PENDING_TREATMENT', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Has [subject] had a head injury or any illness effecting the brain?',
    hint: { html: headInjuryOrIllnessHint, kind: 'html' },
    code: 'health_wellbeing_head_injury_or_illness',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they have had a head injury or any illness effecting the brain',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Does [subject] have any neurodiverse conditions?',
    hint: { text: 'Include diagnosis and neurodiverse characteristics.', kind: 'text' },
    code: 'health_wellbeing_neurodiverse_conditions',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any neurodiverse conditions' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_neurodiverse_conditions_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_neurodiverse_conditions',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Does [subject] have any learning difficulties?',
    code: 'health_wellbeing_learning_difficulties',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any learning difficulties' }],
    options: [
      { text: 'No difficulties', value: 'NO', kind: 'option' },
      { text: 'Yes, some learning difficulties', value: 'YES_SOME_DIFFICULTIES', kind: 'option' },
      { text: 'Yes, significant learning difficulties', value: 'YES_SIGNIFICANT_DIFFICULTIES', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_learning_difficulties_yes_some_difficulties_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_learning_difficulties',
      value: 'YES_SOME_DIFFICULTIES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_learning_difficulties_yes_significant_difficulties_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_learning_difficulties',
      value: 'YES_SIGNIFICANT_DIFFICULTIES',
      displayInline: true,
    },
  },
  {
    text: 'Is [subject] able to cope with day-to-day life?',
    code: 'health_wellbeing_coping_day_to_day_life',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they are able to cope with day-to-day life' }],
    options: [
      { text: 'Yes, able to cope well', value: 'YES', kind: 'option' },
      { text: 'Has some difficulties coping', value: 'YES_SOME_DIFFICULTIES', kind: 'option' },
      { text: 'Not able to cope', value: 'NO', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: "What is [subject]'s attitude towards themselves?",
    code: 'health_wellbeing_attitude_towards_self',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they are able to cope with day-to-day life' }],
    options: [
      { text: 'Positive and reasonably happy with themselves', value: 'POSITIVE', kind: 'option' },
      {
        text: 'There are some aspects of themselves that they do not like or would like to change',
        value: 'SOME_NEGATIVE_ASPECTS',
        kind: 'option',
      },
      {
        text: 'Negative self-image and unhappy with themselves',
        hint: { text: 'This includes if they have a positive unrealistic self-image which is not true in reality.' },
        value: 'NEGATIVE',
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Has [subject] ever self-harmed?',
    hint: { text: "Consider what factors or circumstances are associated and if it's recurring.", kind: 'text' },
    code: 'health_wellbeing_self_harmed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever self harmed' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_self_harmed_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_self_harmed',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Has [subject] ever attempted suicide or had suicidal thoughts?',
    hint: { text: "Consider what factors or circumstances are associated and if it's recurring.", kind: 'text' },
    code: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they have ever attempted suicide or had suicidal thoughts' },
    ],
    options: yesNoOptions,
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'How optimistic is [subject] about their future?',
    code: 'health_wellbeing_outlook',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select how optimistic they are about their future' }],
    options: [
      { text: 'Optimistic and has a positive outlook about their future', value: 'OPTIMISTIC', kind: 'option' },
      { text: 'Not sure and thinks their future could get better or worse', value: 'NOT_SURE', kind: 'option' },
      {
        text: 'Not optimistic and thinks their future will not get better or may get worse',
        value: 'NOT_OPTIMISTIC',
        kind: 'option',
      },
      { text: '[subject] does not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: "What's helped [subject] during periods of good health and wellbeing?",
    hint: { html: positiveFactorsHint, kind: 'html' },
    code: 'health_wellbeing_positive_factors',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select how optimistic they are about their future' }],
    options: [
      { text: 'Accommodation', value: 'ACCOMMODATION', kind: 'option' },
      { text: 'Employment', value: 'EMPLOYMENT', kind: 'option' },
      { text: 'Faith or religion', value: 'FAITH_OR_RELIGION', kind: 'option' },
      { text: 'Feeling part of a community or giving back', value: 'COMMUNITY', kind: 'option' },
      { text: 'Medication and treatment', value: 'MEDICATION_OR_TREATMENT', kind: 'option' },
      { text: 'Money', value: 'MONEY', kind: 'option' },
      { text: 'Relationships', value: 'RELATIONSHIPS', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  {
    text: 'Give details (optional)',
    code: 'health_wellbeing_positive_factors_other_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'health_wellbeing_positive_factors',
      value: 'OTHER',
      displayInline: true,
    },
  },
]

const makeChangesOptionsWithDetails: Array<FormWizard.Field.Option> = [
  { text: 'I have already made changes and want to maintain them', value: 'MADE_CHANGES', kind: 'option' },
  { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
  { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
  { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I do not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
]

const makeChangesOptions: FormWizard.Field.Options = [
  ...makeChangesOptionsWithDetails,
  orDivider,
  { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
  { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
]

export const makeChangesFields: Array<FormWizard.Field> = [
  {
    text: 'Does [subject] want to make changes to their health and wellbeing?',
    hint: { text: 'This question must be directly answered by [subject]', kind: 'text' },
    code: 'health_wellbeing_changes',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they want to make changes to their health and wellbeing' },
    ],
    options: makeChangesOptions,
    labelClasses: mediumLabel,
  },
  ...makeChangesOptionsWithDetails.map(detailsFieldWith('health_wellbeing_changes')),
]

export const practitionerAnalysisFields: Array<FormWizard.Field> =
  createPractitionerAnalysisFieldsWith('health_wellbeing')

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the health and wellbeing section complete?',
  code: 'health_wellbeing_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the health and wellbeing analysis section complete?',
  code: 'health_wellbeing_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  physicalOrMentalHealthProblemsFields,
  physicalHealthConditionsFields,
  mentalHealthConditionsFields,
  baseHealthAndWellbeingQuestions,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
]
  .flat()
  .reduce(toFormWizardFields, {})