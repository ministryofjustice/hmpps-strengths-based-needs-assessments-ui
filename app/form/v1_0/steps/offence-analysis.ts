import { contains, setFieldToCompleteWhenValid, setFieldToIncomplete } from './common'
import offenceAnalysisFields from '../fields/offence-analysis'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import CollectionController from '../../../controllers/CollectionController'

const section = sections.offenceAnalysis
const stepUrls = {
  offenceAnalysis: 'offence-analysis',
  offenceAnalysisVictim: 'offence-analysis-victim',
  offenceAnalysisVictimsSummary: 'offence-analysis-victims-summary',
  offenceAnalysisOthersInvolved: 'offence-analysis-others-involved',
  offenceAnalysisDetails: 'offence-analysis-details',
  analysisComplete: 'offence-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.offenceAnalysis,
      fields: [
        offenceAnalysisFields.offenceAnalysisDescriptionOfOffence,
        offenceAnalysisFields.offenceAnalysisElements,
        offenceAnalysisFields.victimTargetedDetails,
        offenceAnalysisFields.offenceAnalysisReason,
        offenceAnalysisFields.offenceAnalysisMotivation,
        offenceAnalysisFields.otherOffenceMotivationDetails,
        offenceAnalysisFields.offenceAnalysisWhoWasTheVictim,
        offenceAnalysisFields.offenceAnalysisOtherVictimDetails,
        offenceAnalysisFields.offenceAnalysisVictimsCollection,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysis),
        offenceAnalysisFields.sectionComplete(),
      ],
      navigationOrder: 9,
      next: [
        {
          field: offenceAnalysisFields.offenceAnalysisWhoWasTheVictim.code,
          op: contains,
          value: 'ONE_OR_MORE_PERSON',
          next: [
            {
              field: offenceAnalysisFields.offenceAnalysisVictimsCollection.code,
              op: '==',
              value: '0',
              next: stepUrls.offenceAnalysisVictim,
            },
            stepUrls.offenceAnalysisVictimsSummary,
          ],
        },
        stepUrls.offenceAnalysisOthersInvolved,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisVictim,
      controller: CollectionController,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimRelationship,
        offenceAnalysisFields.offenceAnalysisVictimRelationshipOtherDetails,
        offenceAnalysisFields.offenceAnalysisVictimAge,
        offenceAnalysisFields.offenceAnalysisVictimSex,
        offenceAnalysisFields.offenceAnalysisVictimRace,
        offenceAnalysisFields.offenceAnalysisVictimsCollection,
      ],
      next: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisVictimsSummary,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimsCollection,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
        offenceAnalysisFields.sectionComplete(),
      ],
      next: stepUrls.offenceAnalysisOthersInvolved,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisOthersInvolved,
      fields: [
        offenceAnalysisFields.offenceAnalysisHowManyInvolved,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisOthersInvolved),
        offenceAnalysisFields.sectionComplete(),
      ],
      next: stepUrls.offenceAnalysisDetails,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisDetails,
      fields: [
        offenceAnalysisFields.offenceAnalysisLeader,
        offenceAnalysisFields.offenceAnalysisLeaderYesDetails,
        offenceAnalysisFields.offenceAnalysisLeaderNoDetails,
        offenceAnalysisFields.offenceAnalysisImpactOnVictims,
        offenceAnalysisFields.offenceAnalysisImpactOnVictimsDetails,
        offenceAnalysisFields.offenceAnalysisAcceptResponsibility,
        offenceAnalysisFields.offenceAnalysisAcceptResponsibilityDetails,
        offenceAnalysisFields.offenceAnalysisPatternsOfOffending,
        offenceAnalysisFields.offenceAnalysisEscalation,
        offenceAnalysisFields.offenceAnalysisRisk,
        offenceAnalysisFields.offenceAnalysisRiskDetails,
        offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuse,
        offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuseType,
        offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuseTypeDetails,
        offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuse,
        offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuseType,
        offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuseTypeDetails,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisDetails),
        offenceAnalysisFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysisComplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
      locals: { hideAnalysis: true },
    },
  ].flat(),
}

export default sectionConfig
