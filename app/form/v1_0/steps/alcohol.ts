import alcoholFields from '../fields/alcohol'
import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import { nextWhen } from './accommodation'

const section = sections.alcohol
const stepUrls = {
  alcoholUse: 'alcohol-use',
  last3Months: 'alcohol-usage-last-three-months',
  notLast3Months: 'alcohol-usage-but-not-last-three-months',
  analysis: 'alcohol-use-analysis',
  analysisComplete: 'alcohol-use-analysis-complete',
}

const alcoholUseGroup = [alcoholFields.alcoholUse]

const baseAlcoholUsageGroup = [
  alcoholFields.alcoholEvidenceOfExcessDrinking,
  alcoholFields.alcoholPastIssues,
  alcoholFields.alcoholPastIssuesDetails,
  alcoholFields.alcoholReasonsForUse,
  alcoholFields.alcoholReasonsForUseOtherDetails,
  alcoholFields.alcoholImpactOfUse,
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
      url: stepUrls.alcoholUse,
      fields: [
        alcoholUseGroup,
        alcoholFields.isUserSubmitted(stepUrls.alcoholUse),
        alcoholFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(alcoholFields.alcoholUse, 'YES_WITHIN_LAST_THREE_MONTHS', stepUrls.last3Months),
        nextWhen(alcoholFields.alcoholUse, 'YES_NOT_IN_LAST_THREE_MONTHS', stepUrls.notLast3Months),
        nextWhen(alcoholFields.alcoholUse, 'NO', stepUrls.analysis),
      ],
      navigationOrder: 5,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.last3Months,
      fields: [
        alcoholUsageWithinThreeMonthsGroup,
        baseAlcoholUsageGroup,
        alcoholFields.wantToMakeChanges(),
        alcoholFields.isUserSubmitted(stepUrls.last3Months),
        alcoholFields.sectionComplete(),
      ].flat(),
      backLink: stepUrls.alcoholUse,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.notLast3Months,
      fields: [
        baseAlcoholUsageGroup,
        alcoholFields.wantToMakeChanges(),
        alcoholFields.isUserSubmitted(stepUrls.notLast3Months),
        alcoholFields.sectionComplete(),
      ].flat(),
      backLink: sections.alcohol.code,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        alcoholFields.practitionerAnalysis(),
        alcoholFields.isUserSubmitted(stepUrls.analysis),
        alcoholFields.sectionComplete(),
      ].flat(),
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
