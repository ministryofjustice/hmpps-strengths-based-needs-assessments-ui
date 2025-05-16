import sections, { SectionConfig } from '../config/sections'
import { nextWhen, setFieldToCompleteWhenValid, setFieldToIncomplete } from './common'
import drugsUseFields from '../fields/drug-use'
import templates from '../config/templates'

const section = sections.drugsUse
// TODO: remove `temp` part when we've removed the old Drugs section
const stepUrls = {
  drugUse: 'temp-drug-use',
  addDrugs: 'temp-add-drugs',
  drugsDetail: 'temp-drug-detail',
  drugsDetailMoreThanSix: 'temp-drug-detail-more-than-six-months',
  drugUseHistory: 'temp-drug-use-history',

  summary: 'temp-drug-use-summary',
  analysis: 'temp-drug-use-analysis',
}

const sectionHeading = 'Drug use background'

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.drugUse,
      pageHeading: sectionHeading,
      fields: [
        drugsUseFields.drugUse.drugUse,
        drugsUseFields.isUserSubmitted(stepUrls.drugUse),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(drugsUseFields.drugUse.drugUse, 'YES', stepUrls.addDrugs),
        nextWhen(drugsUseFields.drugUse.drugUse, 'NO', stepUrls.summary),
      ],
      navigationOrder: 4,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.addDrugs,
      pageHeading: sectionHeading,
      fields: [
        drugsUseFields.addDrugs.selectMisusedDrugs,
        drugsUseFields.addDrugs.otherDrugNameField,
        drugsUseFields.addDrugs.drugLastUsedFields,
        drugsUseFields.isUserSubmitted(stepUrls.addDrugs),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'MORE_THAN_SIX', stepUrls.drugsDetailMoreThanSix),
        ),
        stepUrls.drugsDetail,
      ].flat(),
      sectionProgressRules: [
        setFieldToIncomplete(section.sectionCompleteField),
        setFieldToIncomplete(drugsUseFields.isUserSubmitted(stepUrls.drugsDetail).code),
        setFieldToIncomplete(drugsUseFields.isUserSubmitted(stepUrls.drugsDetailMoreThanSix).code),
      ],
    },
    {
      url: stepUrls.drugsDetail,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.injectedDrugs,
        drugsUseFields.drugDetails.injectedDrugsWhen,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(stepUrls.drugsDetail),
        drugsUseFields.sectionComplete(),
      ].flat(),
      template: templates.drugUsageNew,
      next: stepUrls.drugUseHistory,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugsDetailMoreThanSix,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.notUsedInTheLastSixMonths,
        drugsUseFields.drugDetails.injectedDrugs,
        drugsUseFields.drugDetails.injectedDrugsWhen,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(stepUrls.drugsDetailMoreThanSix),
        drugsUseFields.sectionComplete(),
      ].flat(),
      template: templates.drugUsageNew,
      next: stepUrls.drugUseHistory,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseHistory,
      pageHeading: sectionHeading,
      fields: [
        drugsUseFields.drugUseHistory.drugsReasonsForUse,
        drugsUseFields.drugUseHistory.drugsReasonsForUseDetails,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLife,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLifeDetails,
        drugsUseFields.drugUseHistory.drugsAnythingHelpedStopOrReduceUse,
        drugsUseFields.drugUseHistory.drugsWhatCouldHelpNotUseDrugsInFuture,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUse,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsPositiveChanges,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsMakingChanges,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsWantToMakeChanges,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsWantToMakeChangesHelp,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsThinkingAboutChanges,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsDoNotWantChanges,
        drugsUseFields.drugUseHistory.drugsWantToMakeChangesToDrugUseDetailsDoNotWantToAnswer,
        drugsUseFields.isUserSubmitted(stepUrls.drugUseHistory),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      pageCaption: 'Drug use',
      pageHeading: 'Practitioner analysis',
      fields: [
        drugsUseFields.drugUseAnalysis.drugsPractitionerAnalysisMotivatedToStop,
        drugsUseFields.practitionerAnalysis(),
        drugsUseFields.isUserSubmitted(stepUrls.summary),
        drugsUseFields.sectionComplete(),
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
