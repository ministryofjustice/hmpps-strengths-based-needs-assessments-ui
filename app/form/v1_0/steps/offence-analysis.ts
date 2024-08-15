import { setFieldToCompleteWhenValid } from './common'
import offenceAnalysisFields from '../fields/offence-analysis'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.offenceAnalysis
const stepUrls = {
  offenceAnalysis: 'offence-analysis',
  analysisComplete: 'offence-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.offenceAnalysis,
      fields: [
        ...offenceAnalysisFields.offenceAnalysis,
        ...offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysis),
        ...offenceAnalysisFields.sectionComplete(),
      ],
      navigationOrder: 9,
      next: stepUrls.analysisComplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
      locals: { hideAnalysis: true },
    },
  ],
}

export default sectionConfig
