import { setFieldToIncomplete, setFieldToCompleteWhenValid, whenField } from './common'
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

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.healthWellbeing,
      fields: [
        ...healthWellbeingFields.physicalOrMentalHealthProblems,
        ...healthWellbeingFields.isUserSubmitted(stepUrls.healthWellbeing),
        ...healthWellbeingFields.sectionComplete(),
      ],
      navigationOrder: 6,
      next: [
        {
          field: 'health_wellbeing_physical_health_condition',
          value: 'YES',
          next: [
            whenField('health_wellbeing_mental_health_condition')
              .includes(['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'])
              .thenGoNext(stepUrls.physicalAndMentalHealth),
            whenField('health_wellbeing_mental_health_condition')
              .includes(['NO', 'UNKNOWN'])
              .thenGoNext(stepUrls.physicalHealth),
          ].flat(),
        },
        whenField('health_wellbeing_physical_health_condition')
          .includes(['NO', 'UNKNOWN'])
          .thenGoNext(
            [
              whenField('health_wellbeing_mental_health_condition')
                .includes(['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'])
                .thenGoNext(stepUrls.mentalHealth),

              whenField('health_wellbeing_mental_health_condition')
                .includes(['NO', 'UNKNOWN'])
                .thenGoNext(stepUrls.noHealthCondition),
            ].flat(),
          ),
      ].flat(),
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.physicalAndMentalHealth,
      fields: [
        ...healthWellbeingFields.physicalHealthConditions,
        ...healthWellbeingFields.mentalHealthConditions,
        ...healthWellbeingFields.baseHealthAndWellbeing,
        ...healthWellbeingFields.wantToMakeChanges(),
        ...healthWellbeingFields.isUserSubmitted(stepUrls.physicalAndMentalHealth),
        ...healthWellbeingFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.physicalHealth,
      fields: [
        ...healthWellbeingFields.physicalHealthConditions,
        ...healthWellbeingFields.baseHealthAndWellbeing,
        ...healthWellbeingFields.wantToMakeChanges(),
        ...healthWellbeingFields.isUserSubmitted(stepUrls.physicalHealth),
        ...healthWellbeingFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.mentalHealth,
      fields: [
        ...healthWellbeingFields.mentalHealthConditions,
        ...healthWellbeingFields.baseHealthAndWellbeing,
        ...healthWellbeingFields.wantToMakeChanges(),
        ...healthWellbeingFields.isUserSubmitted(stepUrls.mentalHealth),
        ...healthWellbeingFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.noHealthCondition,
      fields: [
        ...healthWellbeingFields.baseHealthAndWellbeing,
        ...healthWellbeingFields.wantToMakeChanges(),
        ...healthWellbeingFields.isUserSubmitted(stepUrls.noHealthCondition),
        ...healthWellbeingFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.healthWellbeing,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...healthWellbeingFields.practitionerAnalysis(),
        ...healthWellbeingFields.isUserSubmitted(stepUrls.analysis),
        ...healthWellbeingFields.sectionComplete(),
      ],
      next: `${stepUrls.analysisComplete}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
