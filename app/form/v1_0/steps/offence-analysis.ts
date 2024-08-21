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
        offenceAnalysisFields.offenceAnalysisDescriptionOfOffence,
        offenceAnalysisFields.offenceAnalysisDate,
        offenceAnalysisFields.offenceAnalysisElements,
        offenceAnalysisFields.victimTargetedDetails,
        offenceAnalysisFields.offenceAnalysisReason,
        offenceAnalysisFields.offenceAnalysisGain,
        offenceAnalysisFields.otherOffenceGainDetails,
        offenceAnalysisFields.offenceAnalysisVictimDetails,
        offenceAnalysisFields.offenceAnalysisImpactOnVictims,
        offenceAnalysisFields.yesImpactOnVictimsDetails,
        offenceAnalysisFields.noImpactOnVictimsDetails,
        offenceAnalysisFields.offenceAnalysisRisk,
        offenceAnalysisFields.yesOffenceRiskDetails,
        offenceAnalysisFields.noOffenceRiskDetails,
        offenceAnalysisFields.offenceAnalysisPatternsOfOffending,
        offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuse,
        offenceAnalysisFields.domesticAbusePerpetratorType,
        offenceAnalysisFields.perpetratorFamilyMemberDomesticAbuseDetails,
        offenceAnalysisFields.perpetratorIntimatePartnerDomesticAbuseDetails,
        offenceAnalysisFields.perpetratorFamilyAndIntimatePartnerDomesticAbuseDetails,
        offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuse,
        offenceAnalysisFields.domesticAbuseVictimType,
        offenceAnalysisFields.victimFamilyMemberDomesticAbuseDetails,
        offenceAnalysisFields.victimIntimatePartnerDomesticAbuseDetails,
        offenceAnalysisFields.victimFamilyAndIntimatePartnerDomesticAbuseDetails,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysis),
        offenceAnalysisFields.sectionComplete(),
      ].flat(),
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
