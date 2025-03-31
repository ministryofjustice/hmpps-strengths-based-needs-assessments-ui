import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import healthWellbeingFields from '../fields/health-wellbeing'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.healthWellbeing
const stepUrls = {
  healthWellbeing: 'health-wellbeing',
  coreQuestions: 'health-wellbeing-core',
  physicalMentalHealth: 'physical-mental-health',
  physicalHealth: 'physical-health',
  mentalHealth: 'mental-health',
  noPhysicalMentalHealth: 'no-physical-mental-health',
  summary: 'health-wellbeing-summary',
  analysis: 'health-wellbeing-analysis',
}

const mentalHealthConditionsFieldsGroup: Array<FormWizard.Field> = [
  healthWellbeingFields.healthWellbeingPrescribedMedicationMentalConditions,
  healthWellbeingFields.healthWellbeingPsychiatricTreatment,
]

const baseHealthAndWellbeingFieldsGroup: Array<FormWizard.Field> = [
  healthWellbeingFields.healthWellbeingHeadInjuryOrIllness,
  healthWellbeingFields.healthWellbeingNeurodiverseConditions,
  healthWellbeingFields.healthWellbeingNeurodiverseConditionsDetails,
  healthWellbeingFields.healthWellbeingLearningDifficulties,
  healthWellbeingFields.healthWellbeingLearningDifficultiesYesSomeDifficultiesDetails,
  healthWellbeingFields.healthWellbeingLearningDifficultiesYesSignificantDifficultiesDetails,
  healthWellbeingFields.healthWellbeingCopingDayToDayLife,
  healthWellbeingFields.healthWellbeingAttitudeTowardsSelf,
  healthWellbeingFields.healthWellbeingSelfHarmed,
  healthWellbeingFields.healthWellbeingSelfHarmedDetails,
  healthWellbeingFields.healthWellbeingAttemptedSuicideOrSuicidalThoughts,
  healthWellbeingFields.healthWellbeingAttemptedSuicideOrSuicidalThoughtsDetails,
  healthWellbeingFields.healthWellbeingOutlook,
  healthWellbeingFields.healthWellbeingPositiveFactors,
  healthWellbeingFields.healthWellbeingPositiveFactorsOtherDetails,
]

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      navigationTitle: 'Physical and mental health',
      url: stepUrls.healthWellbeing,
      fields: [
        healthWellbeingFields.healthWellbeingPhysicalHealthCondition,
        healthWellbeingFields.healthWellbeingPhysicalHealthConditionDetails,
        healthWellbeingFields.healthWellbeingMentalHealthCondition,
        healthWellbeingFields.healthWellbeingMentalHealthConditionYesOngoingSevereDetails,
        healthWellbeingFields.healthWellbeingMentalHealthConditionYesOngoingDetails,
        healthWellbeingFields.healthWellbeingMentalHealthConditionYesInThePastDetails,
        healthWellbeingFields.isUserSubmitted(stepUrls.healthWellbeing),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      navigationOrder: 6,
      next: [
        nextWhen(healthWellbeingFields.healthWellbeingPhysicalHealthCondition, 'YES', [
          nextWhen(
            healthWellbeingFields.healthWellbeingMentalHealthCondition,
            ['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'],
            stepUrls.physicalMentalHealth,
          ),
          nextWhen(
            healthWellbeingFields.healthWellbeingMentalHealthCondition,
            ['NO', 'UNKNOWN'],
            stepUrls.physicalHealth,
          ),
        ]),
        nextWhen(
          healthWellbeingFields.healthWellbeingPhysicalHealthCondition,
          ['NO', 'UNKNOWN'],
          [
            nextWhen(
              healthWellbeingFields.healthWellbeingMentalHealthCondition,
              ['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'],
              stepUrls.mentalHealth,
            ),
            nextWhen(
              healthWellbeingFields.healthWellbeingMentalHealthCondition,
              ['NO', 'UNKNOWN'],
              stepUrls.noPhysicalMentalHealth,
            ),
          ],
        ),
        stepUrls.coreQuestions,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Health and wellbeing details',
      url: stepUrls.coreQuestions,
      fields: [
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.coreQuestions),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Physical and mental health details',
      url: stepUrls.physicalMentalHealth,
      fields: [
        healthWellbeingFields.healthWellbeingPrescribedMedicationPhysicalConditions,
        mentalHealthConditionsFieldsGroup,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.physicalMentalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,

      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Physical health details',
      url: stepUrls.physicalHealth,
      fields: [
        healthWellbeingFields.healthWellbeingPrescribedMedicationPhysicalConditions,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.physicalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Mental health details',
      url: stepUrls.mentalHealth,
      fields: [
        mentalHealthConditionsFieldsGroup,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.mentalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Practitioner analysis',
      url: stepUrls.noPhysicalMentalHealth,
      fields: [
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.noPhysicalMentalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Practitioner analysis',
      url: stepUrls.summary,
      fields: [
        healthWellbeingFields.practitionerAnalysis(),
        healthWellbeingFields.isUserSubmitted(stepUrls.summary),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysis}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      navigationTitle: 'Summary',
      url: stepUrls.analysis,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
