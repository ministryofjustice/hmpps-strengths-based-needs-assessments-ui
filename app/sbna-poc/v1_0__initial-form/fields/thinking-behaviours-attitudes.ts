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
    code: 'thinking_behaviours_attitudes_sexual_preoccupation',
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
  {
    text: 'Does [subject] show evidence of offence-related sexual interests?',
    code: 'thinking_behaviours_attitudes_offence-related-sexual-interest',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
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
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
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

export const thinkingBehaviourFields: Array<FormWizard.Field> = []

export const practitionerAnalysisFields: Array<FormWizard.Field> =
  createPractitionerAnalysisFieldsWith('health_wellbeing')

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the health and wellbeing section complete?',
  code: 'health_wellbeing_section_complete',
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
]
  // .flat()
  .reduce(toFormWizardFields, {})
