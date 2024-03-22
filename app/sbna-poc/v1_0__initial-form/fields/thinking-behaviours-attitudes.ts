import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  createPractitionerAnalysisFieldsWith,
  createWantToMakeChangesFields,
  getMediumLabelClassFor,
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
    validate: [
      { type: ValidationType.Required, message: 'Select if they are aware of the consequences of their actions' },
    ],
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
    validate: [{ type: ValidationType.Required, message: 'Select if they show stable behaviour' }],
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
    text: 'Does [subject] engage in activities that could link to offending?',
    code: 'thinking_behaviours_attitudes_offending_activities',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they engage in activities that could link to offending' },
    ],
    options: [
      {
        text: 'Engages in pro-social activities and understands the link to offending',
        value: 'NO_OFFENDING_ACTIVITIES',
        kind: 'option',
      },
      {
        text: 'Sometimes engages in activities linked to offending but recognises the link',
        value: 'SOMETIMES_OFFENDING_ACTIVITIES',
        kind: 'option',
      },
      {
        text: 'Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
        value: 'YES_OFFENDING_ACTIVITIES',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Is [subject] resilient towards peer pressure or influence by criminal associates?',
    code: 'thinking_behaviours_attitudes_peer_pressure',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they’re resilient towards peer pressure or influence by criminal associates',
      },
    ],
    options: [
      {
        text: 'Yes, resilient towards peer pressure or influence by criminal associates',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Has been peer pressured or influenced by criminal associates in the past but recognises the link to their offending',
        value: 'SOME',
        kind: 'option',
      },
      {
        text: 'No, constantly peer pressured or influenced by criminal associates which is linked to their offending',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'thinking_behaviours_attitudes_peer_pressure_yes_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'thinking_behaviours_attitudes_peer_pressure',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'thinking_behaviours_attitudes_peer_pressure_some_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'thinking_behaviours_attitudes_peer_pressure',
      value: 'SOME',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'thinking_behaviours_attitudes_peer_pressure_no_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'thinking_behaviours_attitudes_peer_pressure',
      value: 'NO',
      displayInline: true,
    },
  },
  {
    text: 'Is [subject] able to solve problems in a positive way?',
    code: 'thinking_behaviours_attitudes_problem_solving',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are able to solve problems in a positive way' },
    ],
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
    validate: [{ type: ValidationType.Required, message: 'Select if they understand other people’s views' }],
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
    validate: [
      { type: ValidationType.Required, message: 'Select if they show manipulative behaviour or a predatory lifestyle' },
    ],
    options: [
      {
        text: 'Generally gives an honest account of their lives and has no history of showing manipulative behaviour or a predatory lifestyle',
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals',
        value: 'SOME',
        kind: 'option',
      },
      {
        text: 'Shows a pattern of manipulative behaviour or a predatory lifestyle',
        value: 'YES',
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
    validate: [
      { type: ValidationType.Required, message: 'Select if there are any concerns they are a risk of sexual harm' },
    ],
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
    text: 'Is there evidence [subject] shows sexual preoccupation?',
    code: 'thinking_behaviours_attitudes_sexual_preoccupation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: "Select if there's evidence of sexual preoccupation" }],
    options: [
      {
        text: 'Yes, the amount of time they spend engaging in sexual activity or thinking about sex is unhealthy and is impacting their day-to-day life',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Shows some evidence of improving their day-to-day life but still spends a significant amount of time preoccupied with sex',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'No, the amount of time they spend engaging in sexual activity or thinking about sex is healthy and is balanced alongside all other important areas of their life',
        value: 'NO',
        hint: {
          text: 'This includes behaviours like masturbating regularly, having casual sex or using pornography to meet their needs in a healthy way.',
        },
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Is there evidence [subject] has offence-related sexual interests?',
    code: 'thinking_behaviours_attitudes_offence_related_sexual_interest',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they show evidence of offence-related sexual interests',
      },
    ],
    options: [
      {
        text: 'Yes, there are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful and no evidence of healthy sexual interests',
        value: 'YES_OFFENCE_RELATED_SEXUAL_INTEREST',
        hint: {
          text: 'They are strongly aroused by illegal harmful sexual acts with little or no interest in consensual sex.',
        },
        kind: 'option',
      },
      {
        text: 'Shows some evidence of healthy sexual activity including consensual sex but shows behaviour that is recurrent and persistent or an interest in sexual activity that is illegal or harmful',
        value: 'SOME_OFFENCE_RELATED_SEXUAL_INTEREST',
        kind: 'option',
      },
      {
        text: 'No, they have healthy sexual interests rather than a preference for sexual activity that is illegal or harmful',
        value: 'NO_OFFENCE_RELATED_SEXUAL_INTEREST',
        hint: {
          text: 'While offending, they may have engaged in sexual activity that is illegal but their preferred route to meeting their sexual needs is both legal and consensual.',
        },
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN_OFFENCE_RELATED_SEXUAL_INTEREST',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },

  {
    text: 'Is there evidence [subject] finds it easier to seek emotional intimacy with children over adults?',
    code: 'thinking_behaviours_attitudes_emotional_intimacy',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message:
          'Select if they show evidence that they find it easier to seek emotional intimacy with children over adults',
      },
    ],
    options: [
      {
        text: 'Yes, they find it easier to seek emotional intimacy with children and have significant difficulty forming intimate relationships with adults',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Shows some evidence of having or wanting stable adult relationships but finds it easier to seek emotional intimacy with children over adults',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'No, they have or have had a intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships',
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

export const thinkingBehaviourFields: Array<FormWizard.Field> = [
  {
    text: 'Is [subject] able to manage their temper?',
    code: 'thinking_behaviours_attitudes_temper_management',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they are able to manage their temper' }],
    options: [
      {
        text: 'Yes, is able to manage their temper well',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Sometimes has outbreaks of uncontrolled anger',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'No, easily loses their temper',
        value: 'NO',
        hint: {
          text: 'This may result in a loss of control or inability to stay calm until they have expressed their anger.',
        },
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] use violence, aggressive or controlling behaviour to get their own way?',
    code: 'thinking_behaviours_attitudes_violence_controlling_behaviour',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they use violence, aggressive or controlling behaviour to get their own way',
      },
    ],
    options: [
      {
        text: 'Does not use violence, aggressive or controlling behaviour to get their own way',
        value: 'NO_VIOLENCE',
        kind: 'option',
      },
      {
        text: 'Some evidence of using violence, aggressive or controlling behaviour to get their own way',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'Patterns of using violence, aggressive or controlling behaviour to get their own way',
        value: 'YES_VIOLENCE',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] act on impulse?',
    code: 'thinking_behaviours_attitudes_impulsive_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they act on impulse' }],
    options: [
      {
        text: 'Considers all aspects of a situation before acting on or making a decision',
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Sometimes acts on impulse which causes problems',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'Acts on impulse which causes significant problems',
        value: 'YES',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] have a positive attitude towards any criminal justice staff they have come into contact with?',
    code: 'thinking_behaviours_attitudes_positive_attitude',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message:
          'Select if they have a positive attitude towards any criminal justice staff they have come into contact with',
      },
    ],
    options: [
      {
        text: 'Yes, has a positive attitude',
        value: 'YES_POSITIVE',
        kind: 'option',
      },
      {
        text: 'Has a negative attitude or does not fully engage but there are no safety concerns',
        value: 'NEGATIVE_ATTITUDE_NO_CONCERNS',
        kind: 'option',
      },
      {
        text: 'No, has a negative attitude and there are safety concerns',
        value: 'NEGATIVE_ATTITUDE_AND_CONCERNS',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] have hostile orientation to others or to general rules?',
    code: 'thinking_behaviours_attitudes_hostile_orientation',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they have hostile orientation to others or to general rules',
      },
    ],
    options: [
      {
        text: "They're able to have constructive conversations when they disagree with others and can forgive past wrongs",
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Some evidence of suspicious, angry or vengeful thinking and behaviour',
        value: 'SOME',
        kind: 'option',
      },
      {
        text: 'There is evidence of suspicious, angry or vengeful thinking and behaviour',
        value: 'YES',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] accept supervision and their licence conditions?',
    code: 'thinking_behaviours_attitudes_supervision',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they accept supervision and their licence conditions' },
    ],
    options: [
      {
        text: 'Accepts supervision and has responded well to supervision in the past',
        value: 'YES_SUPERVISION',
        kind: 'option',
      },
      {
        text: 'Unsure about supervision and has put minimum effort into supervision in the past',
        value: 'UNSURE_SUPERVISION',
        kind: 'option',
      },
      {
        text: 'Not prepared to accept supervision and has failed to follow supervision in the past',
        value: 'NO_SUPERVISION',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] support or excuse criminal behaviour?',
    code: 'thinking_behaviours_attitudes_criminal_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they support or excuse criminal behaviour' }],
    options: [
      {
        text: 'Does not support or excuse criminal behaviour',
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Sometimes supports or excuses criminal behaviour',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
        value: 'YES',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

export const makeChangesFields = createWantToMakeChangesFields(
  'their thinking behaviours and attitudes',
  'thinking_behaviours_attitudes',
)

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith(
  'thinking_behaviours_attitudes',
)

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the thinking behaviours and attitude section complete?',
  code: 'thinking_behaviours_attitudes_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the thinking behaviours and attitude section complete?',
  code: 'thinking_behaviours_attitudes_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  thinkingBehavioursAttitudesFields,
  riskOfSexualHarmFields,
  thinkingBehaviourFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
  analysisSectionComplete,
  questionSectionComplete,
  makeChangesFields,
]
  .flat()
  .reduce(toFormWizardFields, {})
