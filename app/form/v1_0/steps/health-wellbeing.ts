import FormWizard from 'hmpo-form-wizard'
import { setFieldToCompleteWhenValid, nextWhen } from './common'
import healthWellbeingFields from '../fields/health-wellbeing'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.healthWellbeing
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

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
      url: 'health-wellbeing-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.healthWellbeing,
      initialStepInSection: true,
      fields: [
        healthWellbeingFields.healthWellbeingPhysicalHealthCondition,
        healthWellbeingFields.healthWellbeingPhysicalHealthConditionDetails,
        healthWellbeingFields.healthWellbeingMentalHealthCondition,
        healthWellbeingFields.healthWellbeingMentalHealthConditionYesOngoingSevereDetails,
        healthWellbeingFields.healthWellbeingMentalHealthConditionYesOngoingDetails,
        healthWellbeingFields.healthWellbeingMentalHealthConditionYesInThePastDetails,
        healthWellbeingFields.isUserSubmitted(sectionBackground.stepUrls.healthWellbeing),
        healthWellbeingFields.backgroundSectionComplete(),
      ].flat(),
      next: [
        nextWhen(healthWellbeingFields.healthWellbeingPhysicalHealthCondition, 'YES', [
          nextWhen(
            healthWellbeingFields.healthWellbeingMentalHealthCondition,
            ['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'],
            sectionBackground.stepUrls.physicalMentalHealth,
          ),
          nextWhen(
            healthWellbeingFields.healthWellbeingMentalHealthCondition,
            ['NO', 'UNKNOWN'],
            sectionBackground.stepUrls.physicalHealth,
          ),
        ]),
        nextWhen(
          healthWellbeingFields.healthWellbeingPhysicalHealthCondition,
          ['NO', 'UNKNOWN'],
          [
            nextWhen(
              healthWellbeingFields.healthWellbeingMentalHealthCondition,
              ['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'],
              sectionBackground.stepUrls.mentalHealth,
            ),
            nextWhen(
              healthWellbeingFields.healthWellbeingMentalHealthCondition,
              ['NO', 'UNKNOWN'],
              sectionBackground.stepUrls.noPhysicalMentalHealth,
            ),
          ],
        ),
      ],
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.physicalMentalHealth,
      fields: [
        healthWellbeingFields.healthWellbeingPrescribedMedicationPhysicalConditions,
        mentalHealthConditionsFieldsGroup,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(sectionBackground.stepUrls.physicalMentalHealth),
        healthWellbeingFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.physicalHealth,
      fields: [
        healthWellbeingFields.healthWellbeingPrescribedMedicationPhysicalConditions,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(sectionBackground.stepUrls.physicalHealth),
        healthWellbeingFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.mentalHealth,
      fields: [
        mentalHealthConditionsFieldsGroup,
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(sectionBackground.stepUrls.mentalHealth),
        healthWellbeingFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.noPhysicalMentalHealth,
      fields: [
        baseHealthAndWellbeingFieldsGroup,
        healthWellbeingFields.wantToMakeChanges(),
        healthWellbeingFields.isUserSubmitted(sectionBackground.stepUrls.noPhysicalMentalHealth),
        healthWellbeingFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      template: templates.backgroundSummary,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      initialStepInSection: true,
      template: templates.analysis,
      fields: [
        healthWellbeingFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        healthWellbeingFields.practitionerAnalysis(),
        healthWellbeingFields.practitionerAnalysisSectionComplete(),
        healthWellbeingFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField),
        setFieldToCompleteWhenValid(section.sectionCompleteField),
      ],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
