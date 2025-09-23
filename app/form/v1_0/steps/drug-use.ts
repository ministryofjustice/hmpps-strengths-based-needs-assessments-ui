import sections, { SectionConfig } from '../config/sections'
import { nextWhen, setFieldToCompleteWhenValid, setFieldToIncomplete } from './common'
import drugsUseFields from '../fields/drug-use'
import templates from '../config/templates'
import { drugsList } from '../fields/drug-use/drugs'

const section = sections.drugsUse
const stepUrls = {
  drugUse: 'drug-use',
  addDrugs: 'add-drugs',
  drugDetails: 'drug-details',
  drugDetailsInjected: 'drug-details-injected',
  drugDetailsMoreThanSix: 'drug-details-more-than-six-months',
  drugDetailsMoreThanSixInjected: 'drug-details-more-than-six-months-injected',
  drugUseHistory: 'drug-use-history',
  drugUseHistoryAllMoreThanSix: 'drug-use-history-more-than-six-months',
  summary: 'drug-use-summary',
  analysis: 'drug-use-analysis',
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
        nextWhen(
          drugsUseFields.addDrugs.selectMisusedDrugs,
          drugsList.filter(it => it.injectable).map(it => it.value),
          [
            drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
              nextWhen(lastUsedField, 'MORE_THAN_SIX', stepUrls.drugDetailsMoreThanSixInjected),
            ),
            stepUrls.drugDetailsInjected,
          ].flat(),
        ),
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'MORE_THAN_SIX', stepUrls.drugDetailsMoreThanSix),
        ),
        stepUrls.drugDetails,
      ].flat(),
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugDetails,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(stepUrls.drugDetails),
        drugsUseFields.sectionComplete(),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', stepUrls.drugUseHistory),
        ),
        stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugDetailsInjected,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.injectedDrugs,
        drugsUseFields.drugDetails.injectedDrugsWhen,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(stepUrls.drugDetailsInjected),
        drugsUseFields.sectionComplete(),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', stepUrls.drugUseHistory),
        ),
        stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugDetailsMoreThanSix,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.notUsedInTheLastSixMonths,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(stepUrls.drugDetailsMoreThanSix),
        drugsUseFields.sectionComplete(),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', stepUrls.drugUseHistory),
        ),
        stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugDetailsMoreThanSixInjected,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.notUsedInTheLastSixMonths,
        drugsUseFields.drugDetails.injectedDrugs,
        drugsUseFields.drugDetails.injectedDrugsWhen,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(stepUrls.drugDetailsMoreThanSixInjected),
        drugsUseFields.sectionComplete(),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', stepUrls.drugUseHistory),
        ),
        stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
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
        drugsUseFields.wantToMakeChanges(),
        drugsUseFields.isUserSubmitted(stepUrls.drugUseHistory),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.drugUseHistoryAllMoreThanSix,
      pageHeading: sectionHeading,
      fields: [
        drugsUseFields.drugUseHistory.drugsReasonsForUse,
        drugsUseFields.drugUseHistory.drugsReasonsForUseDetails,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLife,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLifeDetails,
        drugsUseFields.drugUseHistory.drugsAnythingHelpedStopOrReduceUse,
        drugsUseFields.drugUseHistory.drugsWhatCouldHelpNotUseDrugsInFuture, // This one only displays if any drugs were Used more than 6 months ago
        drugsUseFields.wantToMakeChanges(),
        drugsUseFields.isUserSubmitted(stepUrls.drugUseHistoryAllMoreThanSix),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      pageCaption: 'Drug use',
      pageHeading: sectionHeading,
      fields: [
        drugsUseFields.drugUseAnalysis.drugsPractitionerAnalysisMotivatedToStop,
        drugsUseFields.practitionerAnalysis(),
        drugsUseFields.isUserSubmitted(stepUrls.summary),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysis}#practitioner-analysis`,
      template: templates.analysis,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
