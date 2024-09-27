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
  offenceAnalysisInvolvedParties: 'offence-analysis-involved-parties',
  offenceAnalysisImpact: 'offence-analysis-impact',
  summary: 'offence-analysis-summary',
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
        stepUrls.offenceAnalysisInvolvedParties,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisVictimCreate,
      controller: VictimsCollectionController,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.fields,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
        offenceAnalysisFields.sectionComplete(),
      ].flat(),
      next: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      autosave: false,
    },
    {
      url: stepUrls.offenceAnalysisVictimUpdate,
      controller: VictimsCollectionController,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.fields,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
        offenceAnalysisFields.sectionComplete(),
      ].flat(),
      next: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      params: '/:entryId',
    },
    {
      url: stepUrls.offenceAnalysisVictimDelete,
      controller: VictimsCollectionController,
      fields: [
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
        offenceAnalysisFields.sectionComplete(),
      ],
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
      next: stepUrls.offenceAnalysisInvolvedParties,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      secondaryActions: [
        {
          text: `Add another ${offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.subject}`,
          url: stepUrls.offenceAnalysisVictimCreate,
        },
      ],
    },
    {
      url: stepUrls.offenceAnalysisInvolvedParties,
      fields: [
        offenceAnalysisFields.offenceAnalysisHowManyInvolved,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisInvolvedParties),
        offenceAnalysisFields.sectionComplete(),
      ],
      next: stepUrls.offenceAnalysisImpact,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.offenceAnalysisImpact,
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
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisImpact),
        offenceAnalysisFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
      locals: {
        buttonText: 'Mark as complete',
      },
    },
    {
      url: stepUrls.summary,
      template: templates.analysisComplete,
      locals: { hideAnalysis: true },
    },
  ].flat(),
}

export default sectionConfig
