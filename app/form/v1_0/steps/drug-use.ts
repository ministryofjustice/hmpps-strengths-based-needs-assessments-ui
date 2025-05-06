import sections, { SectionConfig } from '../config/sections'
import { nextWhen, setFieldToIncomplete } from './common'
import drugsUseFields from '../fields/drug-use'

const section = sections.drugsUse
// TODO: remove `temp` part when we've removed the old Drugs section
const stepUrls = {
  drugUse: 'temp-drug-use',
  addDrugs: 'temp-add-drugs',
  drugsDetail: 'temp-drug-detail',

  summary: 'temp-drug-use-summary',
  analysis: 'temp-drug-use-analysis',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.drugUse,
      fields: [
        drugsUseFields.drugUse.drugUse,
        drugsUseFields.isUserSubmitted(stepUrls.drugUse),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(drugsUseFields.drugUse.drugUse, 'YES', stepUrls.addDrugs),
        nextWhen(drugsUseFields.drugUse.drugUse, 'NO', stepUrls.summary),
      ],
      navigationOrder: 10,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.addDrugs,
      fields: [
        drugsUseFields.addDrugs.selectMisusedDrugs,
        drugsUseFields.addDrugs.otherDrugNameField,
        drugsUseFields.addDrugs.drugUsageAmphetamines,
        drugsUseFields.addDrugs.drugUsageBenzodiazepines,
        drugsUseFields.addDrugs.drugUsageCannabis,
        drugsUseFields.addDrugs.drugUsageCocaine,
        drugsUseFields.addDrugs.drugUsageCrack,
        drugsUseFields.addDrugs.drugUsageEcstasy,
        drugsUseFields.addDrugs.drugUsageHallucinogenics,
        drugsUseFields.addDrugs.drugUsageHeroin,
        drugsUseFields.addDrugs.drugUsageMethadoneNotPrescribed,
        drugsUseFields.addDrugs.drugUsageMisusedPrescribedDrugs,
        drugsUseFields.addDrugs.drugUsageOtherOpiates,
        drugsUseFields.addDrugs.drugUsageSolvents,
        drugsUseFields.addDrugs.drugUsageSteroids,
        drugsUseFields.addDrugs.drugUsageSpice,
        drugsUseFields.addDrugs.drugUsageOtherDrug,
        drugsUseFields.isUserSubmitted(stepUrls.addDrugs),
        drugsUseFields.sectionComplete(),
      ].flat(),
      next: stepUrls.drugsDetail,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
  ],
}

export default sectionConfig
