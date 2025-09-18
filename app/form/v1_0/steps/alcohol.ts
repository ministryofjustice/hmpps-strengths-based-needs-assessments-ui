import alcoholFields from '../fields/alcohol'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.alcohol
const stepUrls = {
  alcohol: 'alcohol',
  alcoholUseLastThreeMonths: 'alcohol-use-last-three-months',
  alcoholUseLessThreeMonths: 'alcohol-use-less-three-months',
  summary: 'alcohol-use-summary',
  analysis: 'alcohol-use-analysis',
}

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
      url: stepUrls.alcohol,
      fields: [
        alcoholFields.alcoholUse,
        alcoholFields.isUserSubmitted(stepUrls.alcohol),
        alcoholFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(alcoholFields.alcoholUse, 'YES_WITHIN_LAST_THREE_MONTHS', stepUrls.alcoholUseLastThreeMonths),
        nextWhen(alcoholFields.alcoholUse, 'YES_NOT_IN_LAST_THREE_MONTHS', stepUrls.alcoholUseLessThreeMonths),
        nextWhen(alcoholFields.alcoholUse, 'NO', stepUrls.summary),
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.alcoholUseLastThreeMonths,
      fields: [
        alcoholUsageWithinThreeMonthsGroup,
        baseAlcoholUsageGroup,
        alcoholFields.wantToMakeChanges(),
        alcoholFields.isUserSubmitted(stepUrls.alcoholUseLastThreeMonths),
        alcoholFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.alcoholUseLessThreeMonths,
      fields: [
        baseAlcoholUsageGroup,
        alcoholFields.wantToMakeChanges(),
        alcoholFields.isUserSubmitted(stepUrls.alcoholUseLessThreeMonths),
        alcoholFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      fields: [
        alcoholFields.practitionerAnalysis(),
        alcoholFields.isUserSubmitted(stepUrls.summary),
        alcoholFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysis}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
