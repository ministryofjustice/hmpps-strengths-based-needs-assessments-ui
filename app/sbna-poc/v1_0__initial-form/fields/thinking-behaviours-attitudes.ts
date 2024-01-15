import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  detailsFieldWith,
  getMediumLabelClassFor,
  orDivider,
  toFormWizardFields,
  yesNoOptions,
} from './common'

const sexualHarmWarningText = `
<div class="govuk-warning-text">
  <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong class="govuk-warning-text__text">
    <span class="govuk-visually-hidden">Warning</span>
    [subject] does not have any current or previous sexual or sexually motivated offences
  </strong>
</div>
`
export const thinkingBehavioursAttitudesFields: Array<FormWizard.Field> = [
  {
    text: 'Is [subject] aware of the consequences of their actions?',
    hint: { text: 'This includes towards themselves and to others.', kind: 'text' },
    code: 'thinking_behaviours_attitudes_consequences',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      { text: 'Yes, is aware of the consequences of their actions', value: 'YES', kind: 'option' },
      { text: 'Sometimes is aware of the consequences of their actions', value: 'SOMETIMES', kind: 'option' },
      { text: 'No, is not aware of the consequences of their actions', value: 'NO', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] show stable behaviour?',
    code: 'thinking_behaviours_attitudes_stable_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      { text: 'Yes, shows stable behaviour', value: 'YES', kind: 'option' },
      {
        text: 'Sometimes shows stable behaviour but can show reckless or risk taking behaviours',
        value: 'SOMETIMES',
        kind: 'option',
      },
      { text: 'No, shows reckless or risk taking behaviours', value: 'NO', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Is [subject] able to solve problems in a positive way?',
    code: 'thinking_behaviours_attitudes_problem_solving',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      { text: 'Yes, is able to solve problems and identify appropriate solutions', value: 'YES', kind: 'option' },
      { text: 'Has limited problem solving skills', value: 'LIMITED_PROBLEM_SOLVING', kind: 'option' },
      {
        text: 'No, has poor problem solving skills and is unable to identify what steps to take to solve a problem',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: "Does [subject] understand other people's views?",
    code: 'thinking_behaviours_attitudes_peoples_views',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      {
        text: "Yes, understands other people's views and is able to distinguish between their own feelings and those of others",
        value: 'YES',
        kind: 'option',
      },
      {
        text: "Assumes all views are the same as theirs at first but does consider other people's views to an extent",
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: "No, unable to understand other people's views and distinguish between their own feelings and those of others",
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] show manipulative behaviour or a predatory lifestyle?',
    code: 'thinking_behaviours_attitudes_manipulative_predatory_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      { text: 'Yes, shows a pattern of manipulative behaviour or a predatory lifestyle', value: 'YES', kind: 'option' },
      {
        text: 'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'No, generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Are there any concerns that [subject] is a risk of sexual harm?',
    hint: { html: sexualHarmWarningText, kind: 'html' },
    code: 'thinking_behaviours_attitudes_risk_sexual_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      {
        text: 'Yes',
        hint: {
          text: 'Information suggests that there is evidence of sexual behaviour that could present a risk of sexual harm.',
        },
        value: 'YES',
        kind: 'option',
      },
      { text: 'No', value: 'NO', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

export const riskOfSexualHarmFields: Array<FormWizard.Field> = [
  {
    text: 'Does [subject] show evidence of sexual preoccupation?',
    code: 'thinking_behaviours_attitudes_sexual_preoccupation?',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      {
        text: 'There is evidence that they spend a healthy amount of time engaging in sexual activity and thinking about sex, alongside all other important areas of their life',
        value: 'YES',
        hint: {
          text: 'This may include behaviours such as masturbating regularly, having casual sex outside of a relationship and use of pornography to meet their sexual needs in a healthy way.',
        },
        kind: 'option',
      },
      {
        text: 'There is evidence that while they spend a significant amount of time during the day being preoccupied with sex. They are also trying to improve the balance in their day-to-day life to spend more time engaging in other activities',
        value: 'SOMETIMES',
        hint: {
          text: 'There is also evidence of other interests in their life such as spending time with others, working and other things which are not sex-related.',
        },
        kind: 'option',
      },
      {
        text: 'They describe an unhealthy amount of time in their daily life thinking about or engaging in sexual activity',
        value: 'YES_UNHEALTHY',
        hint: { text: 'It is a major activity each day which impacts on their daily functioning.' },
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
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
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Has [subject] had a head injury or any illness effecting the brain?',
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Has [subject] ever self-harmed?',
    hint: { text: "Consider what factors or circumstances are associated and if it's recurring.", kind: 'text' },
    code: 'health_wellbeing_self_harmed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever self harmed' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details',
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details',
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: "What's helped [subject] during periods of good health and wellbeing?",
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
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
  thinkingBehavioursAttitudesFields,
  riskOfSexualHarmFields,
  physicalHealthConditionsFields,
  mentalHealthConditionsFields,
  baseHealthAndWellbeingQuestions,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
]
  .flat()
  .reduce(toFormWizardFields, {})
