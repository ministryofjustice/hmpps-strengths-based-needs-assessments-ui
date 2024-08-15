import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import thinkingBehavioursFields from '../fields/thinking-behaviours-attitudes'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.thinkingBehaviours
const stepUrls = {
  thinkingBehavioursAttitudes: 'thinking-behaviours-attitudes',
  sexualOffending: 'thinking-behaviours-attitudes-sexual-offending',
  thinkingBehaviours: 'thinking-behaviours',
  analysis: 'thinking-behaviours-attitudes-analysis',
  analysisComplete: 'thinking-behaviours-attitudes-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.thinkingBehavioursAttitudes,
      fields: [
        ...thinkingBehavioursFields.thinkingBehavioursAttitudes,
        ...thinkingBehavioursFields.isUserSubmitted(stepUrls.thinkingBehavioursAttitudes),
        ...thinkingBehavioursFields.sectionComplete(),
      ],
      navigationOrder: 8,
      next: [
        {
          field: 'thinking_behaviours_attitudes_risk_sexual_harm',
          value: 'YES',
          next: stepUrls.sexualOffending,
        },
        {
          field: 'thinking_behaviours_attitudes_risk_sexual_harm',
          value: 'NO',
          next: stepUrls.thinkingBehaviours,
        },
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.sexualOffending,
      pageTitle: 'Risk of sexual harm',
      pageSubHeading: section.title,
      fields: [
        ...thinkingBehavioursFields.riskOfSexualHarm,
        ...thinkingBehavioursFields.isUserSubmitted(stepUrls.sexualOffending),
        ...thinkingBehavioursFields.sectionComplete(),
      ],
      next: stepUrls.thinkingBehaviours,
      backLink: stepUrls.thinkingBehavioursAttitudes,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.thinkingBehaviours,
      fields: [
        ...thinkingBehavioursFields.thinkingBehaviour,
        ...thinkingBehavioursFields.wantToMakeChanges(),
        ...thinkingBehavioursFields.isUserSubmitted(stepUrls.thinkingBehaviours),
        ...thinkingBehavioursFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.thinkingBehavioursAttitudes,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...thinkingBehavioursFields.practitionerAnalysis(),
        ...thinkingBehavioursFields.isUserSubmitted(stepUrls.analysis),
        ...thinkingBehavioursFields.sectionComplete(),
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
