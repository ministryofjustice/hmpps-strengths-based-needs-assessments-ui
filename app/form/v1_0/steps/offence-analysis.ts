import FormWizard from 'hmpo-form-wizard'
import { contains, nextWhen, setFieldToCompleteWhenValid, setFieldToIncomplete } from './common'
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
  offenceAnalysisImpactOthersInvolved: 'offence-analysis-impact-others-involved',
  summary: 'offence-analysis-summary',
}

const VictimsCollectionController = createCollectionController(offenceAnalysisFields.offenceAnalysisVictimsCollection)

const offenceAnalysisImpactGroup: FormWizard.Field[] = [
  offenceAnalysisFields.offenceAnalysisImpactOnVictims,
  offenceAnalysisFields.offenceAnalysisImpactOnVictimsDetails,
  offenceAnalysisFields.offenceAnalysisAcceptResponsibility,
  offenceAnalysisFields.offenceAnalysisAcceptResponsibilityDetails,
  offenceAnalysisFields.offenceAnalysisEscalation,
  offenceAnalysisFields.offenceAnalysisEscalationDetails,
  offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuse,
  offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuseType,
  offenceAnalysisFields.offenceAnalysisPerpetratorOfDomesticAbuseTypeDetails,
  offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuse,
  offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuseType,
  offenceAnalysisFields.offenceAnalysisVictimOfDomesticAbuseTypeDetails,
  offenceAnalysisFields.offenceAnalysisPatternsOfOffending,
  offenceAnalysisFields.offenceAnalysisRisk,
  offenceAnalysisFields.offenceAnalysisRiskDetails,
].flat()

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.offenceAnalysis,
      fields: [
        offenceAnalysisFields.offenceAnalysisDescriptionOfOffence,
        offenceAnalysisFields.offenceAnalysisElements,
        offenceAnalysisFields.victimTargetedDetails,
        offenceAnalysisFields.weaponDetailsField,
        offenceAnalysisFields.offenceAnalysisReason,
        offenceAnalysisFields.offenceAnalysisMotivation,
        offenceAnalysisFields.otherOffenceMotivationDetails,
        offenceAnalysisFields.offenceAnalysisWhoWasTheOffenceCommittedAgainst,
        offenceAnalysisFields.offenceAnalysisOtherVictimDetails,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysis),
      ],
      navigationOrder: 9,
      next: [
        {
          field: offenceAnalysisFields.offenceAnalysisWhoWasTheOffenceCommittedAgainst.code,
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
      sectionProgressRules: [],
    },
    {
      url: stepUrls.offenceAnalysisVictimCreate,
      controller: VictimsCollectionController,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.fields,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
      ].flat(),
      next: stepUrls.offenceAnalysisVictimsSummary,
      backLink: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [],
      autosave: false,
    },
    {
      url: stepUrls.offenceAnalysisVictimUpdate,
      controller: VictimsCollectionController,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimsCollection.collection.fields,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
      ].flat(),
      next: stepUrls.offenceAnalysisVictimsSummary,
      backLink: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [],
      params: '/:entryId',
    },
    {
      url: stepUrls.offenceAnalysisVictimDelete,
      controller: VictimsCollectionController,
      fields: [offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary)],
      next: stepUrls.offenceAnalysisVictimsSummary,
      backLink: stepUrls.offenceAnalysisVictimsSummary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      params: '/:entryId',
    },
    {
      url: stepUrls.offenceAnalysisVictimsSummary,
      fields: [
        offenceAnalysisFields.offenceAnalysisVictimsCollection,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisVictimsSummary),
      ],
      next: stepUrls.offenceAnalysisInvolvedParties,
      sectionProgressRules: [],
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
      ],
      next: [
        nextWhen(offenceAnalysisFields.offenceAnalysisHowManyInvolved, 'NONE', stepUrls.offenceAnalysisImpact),
        stepUrls.offenceAnalysisImpactOthersInvolved,
      ],
      sectionProgressRules: [],
    },
    {
      url: stepUrls.offenceAnalysisImpact,
      fields: [
        offenceAnalysisImpactGroup,
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
      url: stepUrls.offenceAnalysisImpactOthersInvolved,
      fields: [
        offenceAnalysisFields.offenceAnalysisLeader,
        offenceAnalysisFields.offenceAnalysisLeaderYesDetails,
        offenceAnalysisFields.offenceAnalysisLeaderNoDetails,
        offenceAnalysisImpactGroup,
        offenceAnalysisFields.isUserSubmitted(stepUrls.offenceAnalysisImpactOthersInvolved),
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
      template: templates.backgroundSummary,
      locals: { hideAnalysis: true },
    },
  ].flat(),
}

export default sectionConfig
