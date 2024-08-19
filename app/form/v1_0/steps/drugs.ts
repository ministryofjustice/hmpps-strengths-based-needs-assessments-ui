import drugsFields from '../fields/drugs'
import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import { nextWhen } from './accommodation'

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
        drugsFields.drugUseGroup,
        drugsFields.isUserSubmitted(stepUrls.drugUse),
        drugsFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(drugsFields.drugUse, 'YES', stepUrls.drugUseDetails),
        nextWhen(drugsFields.drugUse, 'NO', stepUrls.analysis),
      ],
      navigationOrder: 4,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseDetails,
      fields: [
        drugsFields.drugUsageDetailsGroup,
        drugsFields.isUserSubmitted(stepUrls.drugUseDetails),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.drugUseType,
      backLink: stepUrls.drugUse,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseType,
      fields: [
        drugsFields.drugUseTypeGroup,
        drugsFields.isUserSubmitted(stepUrls.drugUseType),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.drugUsageDetails,
      backLink: stepUrls.drugUseDetails,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUsageDetails,
      fields: [
        drugsFields.drugUseTypeDetailsGroup,
        drugsFields.isUserSubmitted(stepUrls.drugUsageDetails),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.drugUseChanges,
      template: templates.drugUsage,
      backLink: stepUrls.drugUseType,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseChanges,
      fields: [
        drugsFields.wantToMakeChanges(),
        drugsFields.isUserSubmitted(stepUrls.drugUseChanges),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.drugUsageDetails,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        drugsFields.practitionerAnalysis(),
        drugsFields.isUserSubmitted(stepUrls.analysis),
        drugsFields.sectionComplete(),
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
