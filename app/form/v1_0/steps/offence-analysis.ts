import { contains, setFieldToCompleteWhenValid, setFieldToIncomplete } from './common'
import offenceAnalysisFields from '../fields/offence-analysis'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import { createCollectionController } from '../../../controllers/baseCollectionController'

const section = sections.offenceAnalysis
const stepUrls = {
  offenceAnalysis: 'offence-analysis',
  offenceAnalysisVictimCreate: offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.createUrl,
  offenceAnalysisVictimDelete: offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.deleteUrl,
  offenceAnalysisVictimUpdate: offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.updateUrl,
  offenceAnalysisVictimsSummary: offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.summaryUrl,
  offenceAnalysisOthersInvolved: 'offence-analysis-others-involved',
  offenceAnalysisDetails: 'offence-analysis-details',
  analysisComplete: 'offence-analysis-complete',
}

const VictimsCollectionController = createCollectionController(offenceAnalysisFields.offenceAnalysisVictimsCollection)

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
              fn: VictimsCollectionController.noCollectionAnswers(
                offenceAnalysisFields.offenceAnalysisVictimsCollection,
              ),
              next: `${stepUrls.offenceAnalysisVictimCreate}`,
            },
            stepUrls.offenceAnalysisVictimsSummary,
          ],
        },
        stepUrls.offenceAnalysisOthersInvolved,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisVictimCreate,
      controller: VictimsCollectionController,
      fields: offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.fields,
      next: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      autosave: false,
    },
    {
      url: stepUrls.offenceAnalysisVictimUpdate,
      controller: VictimsCollectionController,
      fields: offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.fields,
      next: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      params: '/:entryId',
    },
    {
      url: stepUrls.offenceAnalysisVictimDelete,
      controller: VictimsCollectionController,
      next: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      params: '/:entryId',
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
      secondaryActions: [
        {
          text: `Add another ${offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.subject}`,
          url: stepUrls.offenceAnalysisVictimCreate,
        },
      ],
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
