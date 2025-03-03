import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import characterLimits from '../config/characterLimits'

const headInjuryOrIllnessHint = `
<div class="govuk-grid-width-full">
  <p class="govuk-hint">This includes:</p>
  <ul class="govuk-hint govuk-list govuk-list--bullet">
    <li>traumatic brain injury</li>
    <li>acquired brain injury</li>
    <li>having fits</li>
    <li>significant episodes of unconsciousness as a result of a head injury</li>
  </ul>
</div>
`

const positiveFactorsHint = `
<p class="govuk-hint">Consider what's helped them feel more hopeful.</p>
<p class="govuk-hint">Select all that apply.</p>
`
const skipQuestionText = `
<p class="govuk-body govuk-!-padding-top-3">Before you submit the assessment, you'll need to answer this question</p>
`

class HealthWellbeingFieldsFactory extends FieldsFactory {
  healthWellbeingPhysicalHealthCondition: FormWizard.Field = {
    text: 'Does [subject] have any physical health conditions?',
    code: 'health_wellbeing_physical_health_condition',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any physical health conditions' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
      utils.orDivider,
      {
        text: 'Skip this question for now',
        value: 'SKIP',
        hint: { html: skipQuestionText },
        kind: 'option',
        behaviour: 'exclusive',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingPhysicalHealthConditionDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingPhysicalHealthCondition,
    dependentValue: 'YES',
  })

  healthWellbeingMentalHealthCondition: FormWizard.Field = {
    text: 'Does [subject] have any diagnosed or documented mental health problems?',
    code: 'health_wellbeing_mental_health_condition',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they have any diagnosed or documented mental health problems',
      },
    ],
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingMentalHealthConditionYesOngoingSevereDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingMentalHealthCondition,
    dependentValue: 'YES_ONGOING_SEVERE',
  })

  healthWellbeingMentalHealthConditionYesOngoingDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingMentalHealthCondition,
    dependentValue: 'YES_ONGOING',
  })

  healthWellbeingMentalHealthConditionYesInThePastDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingMentalHealthCondition,
    dependentValue: 'YES_IN_THE_PAST',
  })

  healthWellbeingPrescribedMedicationPhysicalConditions: FormWizard.Field = {
    text: 'Give details if [subject] is on prescribed medication or treatment for physical health conditions (optional)',
    code: 'health_wellbeing_prescribed_medication_physical_conditions',
    type: FieldType.TextArea,
    validate: [
      {
        type: 'validateMaxLength',
        fn: utils.validateMaxLength,
        arguments: [characterLimits.default],
        message: `Details must be ${characterLimits.default} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  healthWellbeingPrescribedMedicationMentalConditions: FormWizard.Field = {
    text: 'Give details if [subject] is on prescribed medication or treatment for mental health problems (optional)',
    code: 'health_wellbeing_prescribed_medication_mental_conditions',
    type: FieldType.TextArea,
    validate: [
      {
        type: 'validateMaxLength',
        fn: utils.validateMaxLength,
        arguments: [characterLimits.default],
        message: `Details must be ${characterLimits.default} characters or less`,
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  healthWellbeingPsychiatricTreatment: FormWizard.Field = {
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingHeadInjuryOrIllness: FormWizard.Field = {
    text: 'Has [subject] had a head injury or any illness affecting the brain?',
    hint: { html: headInjuryOrIllnessHint, kind: 'html' },
    code: 'health_wellbeing_head_injury_or_illness',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they have had a head injury or any illness affecting the brain',
      },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingNeurodiverseConditions: FormWizard.Field = {
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingNeurodiverseConditionsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingNeurodiverseConditions,
    dependentValue: 'YES',
  })

  healthWellbeingLearningDifficulties: FormWizard.Field = {
    text: 'Does [subject] have any conditions or disabilities that impact their ability to learn?',
    code: 'health_wellbeing_learning_difficulties',
    hint: {
      text: 'This refers to both learning disabilities (reduced intellectual ability) and learning difficulties (such as dyslexia or ADHD).',
      kind: 'text',
    },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have any learning difficulties' }],
    options: [
      {
        text: 'Yes, their ability to learn is significantly impacted',
        value: 'YES_SIGNIFICANT_DIFFICULTIES',
        kind: 'option',
      },
      { text: 'Yes, their ability to learn is slightly impacted', value: 'YES_SOME_DIFFICULTIES', kind: 'option' },
      {
        text: 'No, they do not have any conditions or disabilities that impact their ability to learn',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingLearningDifficultiesYesSomeDifficultiesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingLearningDifficulties,
    dependentValue: 'YES_SOME_DIFFICULTIES',
  })

  healthWellbeingLearningDifficultiesYesSignificantDifficultiesDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingLearningDifficulties,
    dependentValue: 'YES_SIGNIFICANT_DIFFICULTIES',
  })

  healthWellbeingCopingDayToDayLife: FormWizard.Field = {
    text: 'Is [subject] able to cope with day-to-day life?',
    code: 'health_wellbeing_coping_day_to_day_life',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they are able to cope with day-to-day life' }],
    options: [
      { text: 'Yes, able to cope well', value: 'YES', kind: 'option' },
      { text: 'Has some difficulties coping', value: 'YES_SOME_DIFFICULTIES', kind: 'option' },
      { text: 'Not able to cope', value: 'NO', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingAttitudeTowardsSelf: FormWizard.Field = {
    text: "What is [subject]'s attitude towards themselves?",
    code: 'health_wellbeing_attitude_towards_self',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their attitude towards themselves' }],
    options: [
      { text: 'Positive and reasonably happy', value: 'POSITIVE', kind: 'option' },
      {
        text: 'There are some aspects they would like to change or do not like',
        value: 'SOME_NEGATIVE_ASPECTS',
        kind: 'option',
      },
      {
        text: 'Negative self-image and unhappy',
        hint: {
          text: 'This includes if they have an overly positive or unrealistic self-image which in reality is not true.',
        },
        value: 'NEGATIVE',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingSelfHarmed: FormWizard.Field = {
    text: 'Has [subject] ever self-harmed?',
    hint: { text: "Consider what factors or circumstances are associated and if it's recurring.", kind: 'text' },
    code: 'health_wellbeing_self_harmed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever self-harmed' }],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingSelfHarmedDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingSelfHarmed,
    dependentValue: 'YES',
    required: true,
  })

  healthWellbeingAttemptedSuicideOrSuicidalThoughts: FormWizard.Field = {
    text: 'Has [subject] ever attempted suicide or had suicidal thoughts?',
    hint: { text: "Consider what factors or circumstances are associated and if it's recurring.", kind: 'text' },
    code: 'health_wellbeing_attempted_suicide_or_suicidal_thoughts',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they have ever attempted suicide or had suicidal thoughts' },
    ],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingAttemptedSuicideOrSuicidalThoughtsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingAttemptedSuicideOrSuicidalThoughts,
    dependentValue: 'YES',
    required: true,
  })

  healthWellbeingOutlook: FormWizard.Field = {
    text: 'How does [subject] feel about their future?',
    code: 'health_wellbeing_outlook',
    hint: { text: 'This question must be directly answered by [subject].', kind: 'text' },
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
      utils.orDivider,
      { text: '[subject] does not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  healthWellbeingPositiveFactors: FormWizard.Field = {
    text: "What's helped [subject] during periods of good health and wellbeing? (optional)",
    hint: { html: positiveFactorsHint, kind: 'html' },
    code: 'health_wellbeing_positive_factors',
    type: FieldType.CheckBox,
    multiple: true,
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  healthWellbeingPositiveFactorsOtherDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.healthWellbeingPositiveFactors,
    dependentValue: 'OTHER',
    required: true,
  })
}

export default new HealthWellbeingFieldsFactory(sections.healthWellbeing)
