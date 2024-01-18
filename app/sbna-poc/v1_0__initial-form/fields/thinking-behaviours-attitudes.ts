import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  createPractitionerAnalysisFieldsWith,
  getMediumLabelClassFor,
  toFormWizardFields,
  yesNoOptions,
  orDivider,
  detailsFieldWith,
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
    text: 'Does [subject] engage in activities that could link to offending??',
    code: 'thinking_behaviours_attitudes_offending_activities',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they engage in activities that could link to offending' },
    ],
    options: [
      {
        text: 'Yes, regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
        value: 'YES_OFFENDING_ACTIVITIES',
        kind: 'option',
      },
      {
        text: 'Sometimes engages in  activities  linked to offending but recognises the link',
        value: 'SOMETIMES_OFFENDING_ACTIVITIES',
        kind: 'option',
      },
      {
        text: 'No, engages in pro-social activities and understand what links to their offending',
        value: 'NO_OFFENDING_ACTIVITIES',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    text: 'Does [subject] show evidence of sexual preoccupation?',
    code: 'thinking_behaviours_attitudes_sexual_preoccupation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they show evidence of sexual preoccupation' }],
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
  {
    text: 'Does [subject] show evidence of offence-related sexual interests?',
    code: 'thinking_behaviours_attitudes_offence-related-sexual-interest',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they show evidence of offence-related sexual interests' },
    ],
    options: [
      {
        text: 'There is evidence of healthy sexual interests rather than a preference for sexual activity that is illegal or harmful',
        value: 'NO_HEALTHY_INTEREST',
        hint: {
          text: 'Whilst their offending means that they have engaged in sexual activity that is illegal, their preferred route to sexual gratification is activity which is both legal and consensual. There is no evidence that they need to sexually offend to meet their sexual needs.',
        },
        kind: 'option',
      },
      {
        text: 'There is some evidence of healthy sexual activity that they are fulfilled by including consensual sex. There is also evidence of behaviour that has been recurrent and persistent or an interest in sexual activity that is illegal or harmful',
        value: 'MIXED_INTEREST',
        kind: 'option',
      },
      {
        text: 'There is no evidence that they have healthy sexual interests. There are recurrent and persistent patterns of a preference for sexual activity that is illegal or harmful',
        value: 'YES_UNHEALTHY_INTEREST',
        hint: {
          text: 'They are strongly aroused to illegal harmful sexual acts with little or no interest in consenting sex with adults..',
        },
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] show evidence of emotional compatibility with children or feel closer to children than adults?',
    code: 'thinking_behaviours_attitudes_emotional_compatibility',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message:
          'Select if they show evidence of emotional compatibility with children or feel closer to children than adults',
      },
    ],
    options: [
      {
        text: 'They have or have had a stable intimate relationship with an adult that they value or have the skills, ability and desire to form stable relationships',
        value: 'STABLE_ADULT_RELATIONSHIPS',
        kind: 'option',
      },
      {
        text: 'There is evidence of them having stable adult relationships in the past or want an adult relationship but not being able to achieve this. There is also some evidence that they find it easier or would prefer to do so with children',
        value: 'MIXED_ADULT_CHILD_RELATIONSHIP_INTEREST',
        kind: 'option',
      },
      {
        text: 'They describe having significant difficulty forming intimate relationships with adults and prefer seeking emotional intimacy with children',
        value: 'EMOTIONAL_INTIMACY_WITH_CHILDREN',
        hint: {
          text: 'They are strongly aroused to illegal harmful sexual acts with little or no interest in consenting sex with adults..',
        },
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
        text: 'No, they do not use violence, aggressive or controlling behaviour to get their own way',
        value: 'NO_VIOLENCE',
        kind: 'option',
      },
      {
        text: 'Some evidence of using violence, aggressive or controlling behaviour to get their own way',
        value: 'SOMETIMES',
        kind: 'option',
      },
      {
        text: 'Yes, there is a pattern of using violence, aggressive or controlling behaviour to get their own way',
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
        text: 'Yes, acts on impulse which causes significant problems',
        value: 'YES_IMPULSIVE_BEHAVIOUR',
        kind: 'option',
      },
      {
        text: 'Sometimes acts on impulse which causes problems',
        value: 'SOMETIMES_IMPULSIVE_BEHAVIOUR',
        kind: 'option',
      },
      {
        text: 'No, considers all aspects of a situation before acting or making a decision',
        value: 'NO_IMPULSIVE_BEHAVIOUR',
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
        text: 'Yes, there is evidence of suspicious, angry or vengeful thinking and behaviour',
        value: 'YES_HOSTILE_ORIENTATION',
        kind: 'option',
      },
      {
        text: 'Some evidence of suspicious, angry or vengeful thinking and behaviour',
        value: 'SOME_HOSTILE_ORIENTATION',
        kind: 'option',
      },
      {
        text: "No, they're able to have constructive conversations when they disagree with others and can forgive past wrongs",
        value: 'NO_HOSTILE_ORIENTATION',
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
        text: 'Yes, supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
        value: 'YES_SUPPORTS_CRIMINAL_BEHAVIOUR',
        kind: 'option',
      },
      {
        text: 'Sometimes supports or excuses criminal behaviour',
        value: 'SOMETIMES_SUPPORTS_CRIMINAL_BEHAVIOUR',
        kind: 'option',
      },
      {
        text: 'No, does not support or excuse criminal behaviour',
        value: 'NOT_SUPPORT_CRIMINAL_BEHAVIOUR',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
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
    text: 'Does [subject] want to make changes to their thinking behaviours and attitudes?',
    hint: { text: 'This question must be directly answered by [subject]', kind: 'text' },
    code: 'thinking_behaviours_attitudes_changes',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they want to make changes to their thinking, behaviours and attitudes',
      },
    ],
    options: makeChangesOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  ...makeChangesOptionsWithDetails.map(detailsFieldWith('thinking_behaviours_attitudes_changes')),
]

export const practitionerAnalysisFields: Array<FormWizard.Field> =
  createPractitionerAnalysisFieldsWith('health_wellbeing')

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
