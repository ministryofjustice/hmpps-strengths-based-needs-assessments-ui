import alcoholFields from '../fields/alcohol'
import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.alcohol
const stepUrls = {
  alcoholUse: 'alcohol-use',
  last3Months: 'alcohol-usage-last-three-months',
  notLast3Months: 'alcohol-usage-but-not-last-three-months',
  analysis: 'alcohol-use-analysis',
  analysisComplete: 'alcohol-use-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.alcoholUse,
      fields: [
        ...alcoholFields.alcoholUse,
        ...alcoholFields.isUserSubmitted(stepUrls.alcoholUse),
        ...alcoholFields.sectionComplete(),
      ],
      next: [
        { field: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS', next: stepUrls.last3Months },
        { field: 'alcohol_use', value: 'YES_NOT_IN_LAST_THREE_MONTHS', next: stepUrls.notLast3Months },
        { field: 'alcohol_use', value: 'NO', next: stepUrls.analysis },
      ],
      navigationOrder: 5,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.last3Months,
      fields: [
        ...alcoholFields.alcoholUsageWithinThreeMonths,
        ...alcoholFields.baseAlcoholUsage,
        ...alcoholFields.wantToMakeChanges(),
        ...alcoholFields.isUserSubmitted(stepUrls.last3Months),
        ...alcoholFields.sectionComplete(),
      ],
      backLink: stepUrls.alcoholUse,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.notLast3Months,
      fields: [
        ...alcoholFields.baseAlcoholUsage,
        ...alcoholFields.wantToMakeChanges(),
        ...alcoholFields.isUserSubmitted(stepUrls.notLast3Months),
        ...alcoholFields.sectionComplete(),
      ],
      backLink: sections.alcohol.code,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...alcoholFields.practitionerAnalysis(),
        ...alcoholFields.isUserSubmitted(stepUrls.analysis),
        ...alcoholFields.sectionComplete(),
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
