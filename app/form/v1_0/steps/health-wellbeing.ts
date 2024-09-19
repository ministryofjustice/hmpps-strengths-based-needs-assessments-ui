import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import healthWellbeingFields from '../fields/health-wellbeing'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.healthWellbeing
const stepUrls = {
  healthWellbeing: 'health-wellbeing',
  physicalAndMentalHealth: 'physical-and-mental-health-condition',
  physicalHealth: 'physical-health-condition',
  mentalHealth: 'mental-health-condition',
  noHealthCondition: 'no-physical-or-mental-health-condition',
  analysis: 'health-wellbeing-analysis',
  analysisComplete: 'health-wellbeing-analysis-complete',
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
            stepUrls.physicalAndMentalHealth,
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
              stepUrls.noHealthCondition,
            ),
          ],
        ),
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.physicalAndMentalHealth,
      fields: [
        healthWellbeingFields.healthWellbeingPrescribedMedicationPhysicalConditions,
        mentalHealthConditionsFieldsGroup,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.physicalAndMentalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.physicalHealth,
      fields: [
        healthWellbeingFields.healthWellbeingPrescribedMedicationPhysicalConditions,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.physicalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.mentalHealth,
      fields: [
        mentalHealthConditionsFieldsGroup,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.mentalHealth),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.noHealthCondition,
      fields: [
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(stepUrls.noHealthCondition),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        healthWellbeingFields.practitionerAnalysis(),
        healthWellbeingFields.isUserSubmitted(stepUrls.analysis),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysisComplete}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
      isLastStep: true,
    },
  ],
}

export default sectionConfig
