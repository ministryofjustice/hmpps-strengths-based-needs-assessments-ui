import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import financeFields from '../fields/finance'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.finance
const stepUrls = {
  finance: 'finance',
  analysis: 'finance-analysis',
  analysisComplete: 'finance-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.finance,
      fields: [
        ...financeFields.baseFinance,
        ...financeFields.wantToMakeChanges(),
        ...financeFields.isUserSubmitted(stepUrls.finance),
        ...financeFields.sectionComplete(),
      ],
      navigationOrder: 3,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...financeFields.practitionerAnalysis(),
        ...financeFields.isUserSubmitted(stepUrls.analysis),
        ...financeFields.sectionComplete(),
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
