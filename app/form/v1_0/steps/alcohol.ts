import alcoholFields from '../fields/alcohol'
import { setFieldToCompleteWhenValid, nextWhen } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.alcohol
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

const baseAlcoholUsageGroup = [
  alcoholFields.alcoholEvidenceOfExcessDrinking,
  alcoholFields.alcoholPastIssues,
  alcoholFields.alcoholPastIssuesDetails,
  alcoholFields.alcoholReasonsForUse,
  alcoholFields.alcoholReasonsForUseOtherDetails,
  alcoholFields.alcoholImpactOfUse,
  alcoholFields.alcoholImpactOfUseOtherDetails,
  alcoholFields.alcoholPastIssuesDetails,
  alcoholFields.alcoholStoppedOrReduced,
  alcoholFields.alcoholStoppedOrReducedDetails,
]

const alcoholUsageWithinThreeMonthsGroup = [
  alcoholFields.alcoholFrequency,
  alcoholFields.alcoholUnits,
  alcoholFields.alcoholBingeDrinking,
  alcoholFields.alcoholBingeDrinkingFrequency,
]

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: 'alcohol-use-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.alcohol,
      initialStepInSection: true,
      fields: [
        alcoholFields.alcoholUse,
        alcoholFields.isUserSubmitted(sectionBackground.stepUrls.alcohol),
        alcoholFields.backgroundSectionComplete(),
      ].flat(),
      next: [
        nextWhen(
          alcoholFields.alcoholUse,
          'YES_WITHIN_LAST_THREE_MONTHS',
          sectionBackground.stepUrls.alcoholUseLastThreeMonths,
        ),
        nextWhen(
          alcoholFields.alcoholUse,
          'YES_NOT_IN_LAST_THREE_MONTHS',
          sectionBackground.stepUrls.alcoholUseLessThreeMonths,
        ),
        nextWhen(alcoholFields.alcoholUse, 'NO', sectionBackground.stepUrls.backgroundSummary),
      ],
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.alcoholUseLastThreeMonths,
      fields: [
        alcoholUsageWithinThreeMonthsGroup,
        baseAlcoholUsageGroup,
        alcoholFields.wantToMakeChanges(),
        alcoholFields.isUserSubmitted(sectionBackground.stepUrls.alcoholUseLastThreeMonths),
        alcoholFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.alcoholUseLessThreeMonths,
      fields: [
        baseAlcoholUsageGroup,
        alcoholFields.wantToMakeChanges(),
        alcoholFields.isUserSubmitted(sectionBackground.stepUrls.alcoholUseLessThreeMonths),
        alcoholFields.backgroundSectionComplete(),
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
        alcoholFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        alcoholFields.practitionerAnalysis(),
        alcoholFields.practitionerAnalysisSectionComplete(),
        alcoholFields.sectionComplete(),
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
