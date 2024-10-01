import drugsFields from '../fields/drugs'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.drugs
const stepUrls = {
  drugs: 'drugs',
  drugUse: 'drug-use',
  selectDrugs: 'select-drugs',
  drugUsageDetails: 'drug-usage-details',
  drugUseChanges: 'drug-use-changes',
  summary: 'drug-use-summary',
  analysis: 'drug-use-analysis',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.drugs,
      fields: [
        drugsFields.drugUseGroup,
        drugsFields.isUserSubmitted(stepUrls.drugs),
        drugsFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(drugsFields.drugUse, 'YES', stepUrls.drugUse),
        nextWhen(drugsFields.drugUse, 'NO', stepUrls.summary),
      ],
      navigationOrder: 4,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUse,
      fields: [
        drugsFields.drugUsageDetailsGroup,
        drugsFields.isUserSubmitted(stepUrls.drugUse),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.selectDrugs,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.selectDrugs,
      fields: [
        drugsFields.drugUseTypeGroup,
        drugsFields.isUserSubmitted(stepUrls.selectDrugs),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.drugUsageDetails,

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
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseChanges,
      fields: [
        drugsFields.wantToMakeChanges(),
        drugsFields.isUserSubmitted(stepUrls.drugUseChanges),
        drugsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      fields: [
        drugsFields.practitionerAnalysis(),
        drugsFields.isUserSubmitted(stepUrls.summary),
        drugsFields.sectionComplete(),
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
