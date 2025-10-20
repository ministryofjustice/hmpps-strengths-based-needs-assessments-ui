import sections, { SectionConfig } from '../config/sections'
import { nextWhen, setFieldToCompleteWhenValid, setFieldToIncomplete } from './common'
import drugsUseFields from '../fields/drug-use'
import templates from '../config/templates'
import { drugsList } from '../fields/drug-use/drugs'

const section = sections.drugsUse
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: 'drug-use-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.drugUse,
      initialStepInSection: true,
      fields: [
        drugsUseFields.drugUse.drugUse,
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugUse),
        drugsUseFields.backgroundSectionComplete(),
        drugsUseFields.practitionerAnalysisSectionComplete(),
      ].flat(),
      next: [
        nextWhen(drugsUseFields.drugUse.drugUse, 'YES', sectionBackground.stepUrls.addDrugs),
        nextWhen(drugsUseFields.drugUse.drugUse, 'NO', sectionBackground.stepUrls.backgroundSummary),
      ],
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField),
        setFieldToIncomplete(sectionPractitionerAnalysis.sectionCompleteField),
      ],
    },
    {
      url: sectionBackground.stepUrls.addDrugs,
      fields: [
        drugsUseFields.addDrugs.selectMisusedDrugs,
        drugsUseFields.addDrugs.otherDrugNameField,
        drugsUseFields.addDrugs.drugLastUsedFields,
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.addDrugs),
      ].flat(),
      next: [
        nextWhen(
          drugsUseFields.addDrugs.selectMisusedDrugs,
          drugsList.filter(it => it.injectable).map(it => it.value),
          [
            drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
              nextWhen(lastUsedField, 'MORE_THAN_SIX', sectionBackground.stepUrls.drugDetailsMoreThanSixInjected),
            ),
            sectionBackground.stepUrls.drugDetailsInjected,
          ].flat(),
        ),
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'MORE_THAN_SIX', sectionBackground.stepUrls.drugDetailsMoreThanSix),
        ),
        sectionBackground.stepUrls.drugDetails,
      ].flat(),
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.drugDetails,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugDetails),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', sectionBackground.stepUrls.drugUseHistory),
        ),
        sectionBackground.stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.drugDetailsInjected,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.injectedDrugs,
        drugsUseFields.drugDetails.injectedDrugsWhen,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugDetailsInjected),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', sectionBackground.stepUrls.drugUseHistory),
        ),
        sectionBackground.stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.drugDetailsMoreThanSix,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.notUsedInTheLastSixMonths,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugDetailsMoreThanSix),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', sectionBackground.stepUrls.drugUseHistory),
        ),
        sectionBackground.stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.drugDetailsMoreThanSixInjected,
      fields: [
        drugsUseFields.drugDetails.usedLastSixMonths,
        drugsUseFields.drugDetails.notUsedInTheLastSixMonths,
        drugsUseFields.drugDetails.injectedDrugs,
        drugsUseFields.drugDetails.injectedDrugsWhen,
        drugsUseFields.drugDetails.drugsIsReceivingTreatment,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentYesDetails,
        drugsUseFields.drugDetails.drugsIsReceivingTreatmentNoDetails,
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugDetailsMoreThanSixInjected),
      ].flat(),
      template: templates.drugUsageNew,
      next: [
        drugsUseFields.addDrugs.drugLastUsedFields.map(lastUsedField =>
          nextWhen(lastUsedField, 'LAST_SIX', sectionBackground.stepUrls.drugUseHistory),
        ),
        sectionBackground.stepUrls.drugUseHistoryAllMoreThanSix,
      ].flat(),
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.drugUseHistory,
      fields: [
        drugsUseFields.drugUseHistory.drugsReasonsForUse,
        drugsUseFields.drugUseHistory.drugsReasonsForUseDetails,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLife,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLifeDetails,
        drugsUseFields.drugUseHistory.drugsAnythingHelpedStopOrReduceUse,
        drugsUseFields.wantToMakeChanges(),
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugUseHistory),
        drugsUseFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.drugUseHistoryAllMoreThanSix,
      fields: [
        drugsUseFields.drugUseHistory.drugsReasonsForUse,
        drugsUseFields.drugUseHistory.drugsReasonsForUseDetails,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLife,
        drugsUseFields.drugUseHistory.drugsAffectedTheirLifeDetails,
        drugsUseFields.drugUseHistory.drugsAnythingHelpedStopOrReduceUse,
        drugsUseFields.drugUseHistory.drugsWhatCouldHelpNotUseDrugsInFuture, // This one only displays if any drugs were Used more than 6 months ago
        drugsUseFields.wantToMakeChanges(),
        drugsUseFields.isUserSubmitted(sectionBackground.stepUrls.drugUseHistoryAllMoreThanSix),
        drugsUseFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      pageCaption: 'Drug use',
      template: templates.backgroundSummary,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      initialStepInSection: true,
      template: templates.analysis,
      fields: [
        drugsUseFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        drugsUseFields.drugUseAnalysis.drugsPractitionerAnalysisMotivatedToStop,
        drugsUseFields.practitionerAnalysis(),
        drugsUseFields.practitionerAnalysisSectionComplete(),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField),
        setFieldToCompleteWhenValid(section.sectionCompleteField),
      ],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
