import drugsFields from '../fields/drugs'
import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.drugs
const stepUrls = {
  drugUse: 'drug-use',
  drugUseDetails: 'drug-use-details',
  drugUseType: 'drug-use-type',
  drugUsageDetails: 'drug-usage-details',
  drugUseChanges: 'drug-use-changes',
  analysis: 'drug-use-analysis',
  analysisComplete: 'drug-use-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.drugUse,
      fields: [
        ...drugsFields.drugUse,
        ...drugsFields.isUserSubmitted(stepUrls.drugUse),
        ...drugsFields.sectionComplete(),
      ],
      next: [
        { field: 'drug_use', value: 'YES', next: stepUrls.drugUseDetails },
        { field: 'drug_use', value: 'NO', next: stepUrls.analysis },
      ],
      navigationOrder: 4,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseDetails,
      fields: [
        ...drugsFields.drugUsageDetails,
        ...drugsFields.isUserSubmitted(stepUrls.drugUseDetails),
        ...drugsFields.sectionComplete(),
      ],
      next: stepUrls.drugUseType,
      backLink: stepUrls.drugUse,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseType,
      fields: [
        ...drugsFields.drugUseType,
        ...drugsFields.isUserSubmitted(stepUrls.drugUseType),
        ...drugsFields.sectionComplete(),
      ],
      next: stepUrls.drugUsageDetails,
      backLink: stepUrls.drugUseDetails,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUsageDetails,
      fields: [
        ...drugsFields.drugUseTypeDetails,
        ...drugsFields.isUserSubmitted(stepUrls.drugUsageDetails),
        ...drugsFields.sectionComplete(),
      ],
      next: stepUrls.drugUseChanges,
      template: templates.drugUsage,
      backLink: stepUrls.drugUseType,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseChanges,
      fields: [
        ...drugsFields.wantToMakeChanges(),
        ...drugsFields.isUserSubmitted(stepUrls.drugUseChanges),
        ...drugsFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.drugUsageDetails,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...drugsFields.practitionerAnalysis(),
        ...drugsFields.isUserSubmitted(stepUrls.analysis),
        ...drugsFields.sectionComplete(),
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
