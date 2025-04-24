import drugsFields from '../fields/drugs'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import sections from '../config/sections'
import templates from '../config/templates'
import { SectionConfig } from '../../common/section';

const section = sections.drugs
const backgroundUrls = section.subSections.background.stepUrls
const practitionerAnalysisUrls = section.subSections.practitionerAnalysis.stepUrls

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: backgroundUrls.drugs,
      fields: [
        drugsFields.drugUseGroup,
        drugsFields.isUserSubmitted(backgroundUrls.drugs),
        drugsFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(drugsFields.drugUse, 'YES', backgroundUrls.drugUse),
        nextWhen(drugsFields.drugUse, 'NO', backgroundUrls.summary),
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: backgroundUrls.drugUse,
      fields: [
        drugsFields.drugUsageDetailsGroup,
        drugsFields.isUserSubmitted(backgroundUrls.drugUse),
        drugsFields.sectionComplete(),
      ].flat(),
      next: backgroundUrls.selectDrugs,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: backgroundUrls.selectDrugs,
      fields: [
        drugsFields.drugUseTypeGroup,
        drugsFields.isUserSubmitted(backgroundUrls.selectDrugs),
        drugsFields.sectionComplete(),
      ].flat(),
      next: backgroundUrls.drugUsageDetails,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: backgroundUrls.drugUsageDetails,
      fields: [
        drugsFields.drugUseTypeDetailsGroup,
        drugsFields.isUserSubmitted(backgroundUrls.drugUsageDetails),
        drugsFields.sectionComplete(),
      ].flat(),
      next: backgroundUrls.drugUseChanges,
      template: templates.drugUsage,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: backgroundUrls.drugUseChanges,
      fields: [
        drugsFields.wantToMakeChanges(),
        drugsFields.isUserSubmitted(backgroundUrls.drugUseChanges),
        drugsFields.sectionComplete(),
      ].flat(),
      next: backgroundUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: backgroundUrls.summary,
      next: practitionerAnalysisUrls.analysis,
      template: templates.summary,
      locals: {
        nextStep: practitionerAnalysisUrls.analysis
      }
    },
    {
      url: practitionerAnalysisUrls.analysis,
      fields: [
        drugsFields.practitionerAnalysis(),
        drugsFields.isUserSubmitted(practitionerAnalysisUrls.analysis),
        drugsFields.sectionComplete(),
      ].flat(),
      next: practitionerAnalysisUrls.analysisSummary,
      template: templates.practitionerAnalysisIncomplete,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: practitionerAnalysisUrls.analysisSummary,
      template: templates.practitionerAnalysisComplete,
      fields: [
        drugsFields.isUserSubmitted(practitionerAnalysisUrls.analysisSummary),
        drugsFields.sectionComplete(),
      ].flat(),
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
  ],
}

export default sectionConfig
