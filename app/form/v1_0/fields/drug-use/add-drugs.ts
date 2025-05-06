import FormWizard from 'hmpo-form-wizard'
import { utils } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import characterLimits from '../../config/characterLimits'
import { dependentOn } from '../common/utils'

const drugsList = {
  AMPHETAMINES: { value: 'AMPHETAMINES', text: 'Amphetamines (including speed, methamphetamine)' },
  BENZODIAZEPINES: { value: 'BENZODIAZEPINES', text: 'Benzodiazepines (including diazepam, xanex)' },
  CANNABIS: { value: 'CANNABIS', text: 'Cannabis' },
  COCAINE: { value: 'COCAINE', text: 'Cocaine' },
  CRACK: { value: 'CRACK', text: 'Crack cocaine' },
  ECSTASY: { value: 'ECSTASY', text: 'Ecstasy (MDMA)' },
  HALLUCINOGENICS: { value: 'HALLUCINOGENICS', text: 'Hallucinogenics (including ketamine)' },
  HEROIN: { value: 'HEROIN', text: 'Heroin' },
  METHADONE_NOT_PRESCRIBED: { value: 'METHADONE_NOT_PRESCRIBED', text: 'Methadone (not prescribed)' },
  MISUSED_PRESCRIBED_DRUGS: { value: 'MISUSED_PRESCRIBED_DRUGS', text: 'Prescribed drugs' },
  OTHER_OPIATES: { value: 'OTHER_OPIATES', text: 'Other opiates' },
  SOLVENTS: { value: 'SOLVENTS', text: 'Solvents (including gases and glues)' },
  STEROIDS: { value: 'STEROIDS', text: 'Steroids' },
  SPICE: { value: 'SPICE', text: 'Synthetic cannabinoids (spice)' },
  OTHER_DRUG: { value: 'OTHER_DRUG', text: 'Other' },
}

const selectMisusedDrugs: FormWizard.Field = {
  text: 'Which drugs has [subject] misused?',
  code: 'select_misused_drugs',
  hint: { text: 'Select all that apply.', kind: 'text' },
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: 'Select which drugs they have used' }],
  options: [
    { text: drugsList.AMPHETAMINES.text, value: drugsList.AMPHETAMINES.value, kind: 'option' },
    { text: drugsList.BENZODIAZEPINES.text, value: drugsList.BENZODIAZEPINES.value, kind: 'option' },
    { text: drugsList.CANNABIS.text, value: drugsList.CANNABIS.value, kind: 'option' },
    { text: drugsList.COCAINE.text, value: drugsList.COCAINE.value, kind: 'option' },
    { text: drugsList.CRACK.text, value: drugsList.CRACK.value, kind: 'option' },
    { text: drugsList.ECSTASY.text, value: drugsList.ECSTASY.value, kind: 'option' },
    { text: drugsList.HALLUCINOGENICS.text, value: drugsList.HALLUCINOGENICS.value, kind: 'option' },
    { text: drugsList.HEROIN.text, value: drugsList.HEROIN.value, kind: 'option' },
    { text: drugsList.METHADONE_NOT_PRESCRIBED.text, value: drugsList.METHADONE_NOT_PRESCRIBED.value, kind: 'option' },
    { text: drugsList.MISUSED_PRESCRIBED_DRUGS.text, value: drugsList.MISUSED_PRESCRIBED_DRUGS.value, kind: 'option' },
    { text: drugsList.OTHER_OPIATES.text, value: drugsList.OTHER_OPIATES.value, kind: 'option' },
    { text: drugsList.SOLVENTS.text, value: drugsList.SOLVENTS.value, kind: 'option' },
    { text: drugsList.STEROIDS.text, value: drugsList.STEROIDS.value, kind: 'option' },
    { text: drugsList.SPICE.text, value: drugsList.SPICE.value, kind: 'option' },
    { text: drugsList.OTHER_DRUG.text, value: drugsList.OTHER_DRUG.value, kind: 'option' },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
}

const misusedDrugsLastUsedField = (option: string, value: string): FormWizard.Field => ({
  text: `When did they last use ${value}?`,
  code: utils.fieldCodeWith('drug_last_used', option),
  type: FieldType.Radio,
  dependent: dependentOn(selectMisusedDrugs, option),
  validate: [{ type: ValidationType.Required, message: 'Select when they last used this drug' }],
  options: [
    { text: 'Used in the last 6 months', value: 'LAST_SIX', kind: 'option' },
    { text: 'Used more than 6 months ago', value: 'MORE_THAN_SIX', kind: 'option' },
  ],
  labelClasses: utils.visuallyHidden,
})

const otherDrugNameField: FormWizard.Field = {
  text: '',
  hint: { text: 'Add drug name', kind: 'text' },
  code: 'other_drug_name',
  type: FieldType.Text,
  dependent: {
    field: 'select_misused_drugs',
    value: 'OTHER_DRUG',
    displayInline: true,
  },
  validate: [
    {
      type: ValidationType.Required,
      message: "Enter which other drug they've misused",
    },
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.c200],
      message: `Drug name must be ${characterLimits.c200} characters or less`,
    },
  ],
  labelClasses: utils.getSmallLabelClassFor(FieldType.Text),
}

const drugUsageAmphetamines = misusedDrugsLastUsedField(drugsList.AMPHETAMINES.value, drugsList.AMPHETAMINES.text)
const drugUsageBenzodiazepines = misusedDrugsLastUsedField(
  drugsList.BENZODIAZEPINES.value,
  drugsList.BENZODIAZEPINES.text,
)
const drugUsageCannabis = misusedDrugsLastUsedField(drugsList.CANNABIS.value, drugsList.CANNABIS.text)
const drugUsageCocaine = misusedDrugsLastUsedField(drugsList.COCAINE.value, drugsList.COCAINE.text)
const drugUsageCrack = misusedDrugsLastUsedField(drugsList.CRACK.value, drugsList.CRACK.text)
const drugUsageEcstasy = misusedDrugsLastUsedField(drugsList.ECSTASY.value, drugsList.ECSTASY.text)
const drugUsageHallucinogenics = misusedDrugsLastUsedField(
  drugsList.HALLUCINOGENICS.value,
  drugsList.HALLUCINOGENICS.text,
)
const drugUsageHeroin = misusedDrugsLastUsedField(drugsList.HEROIN.value, drugsList.HEROIN.text)
const drugUsageMethadoneNotPrescribed = misusedDrugsLastUsedField(
  drugsList.METHADONE_NOT_PRESCRIBED.value,
  drugsList.METHADONE_NOT_PRESCRIBED.text,
)
const drugUsageMisusedPrescribedDrugs = misusedDrugsLastUsedField(
  drugsList.MISUSED_PRESCRIBED_DRUGS.value,
  drugsList.MISUSED_PRESCRIBED_DRUGS.text,
)
const drugUsageOtherOpiates = misusedDrugsLastUsedField(drugsList.OTHER_OPIATES.value, drugsList.OTHER_OPIATES.text)
const drugUsageSolvents = misusedDrugsLastUsedField(drugsList.SOLVENTS.value, drugsList.SOLVENTS.text)
const drugUsageSteroids = misusedDrugsLastUsedField(drugsList.STEROIDS.value, drugsList.STEROIDS.text)
const drugUsageSpice = misusedDrugsLastUsedField(drugsList.SPICE.value, drugsList.SPICE.text)
const drugUsageOtherDrug = misusedDrugsLastUsedField(drugsList.OTHER_DRUG.value, drugsList.OTHER_DRUG.text)

export default {
  selectMisusedDrugs,
  otherDrugNameField,
  drugUsageAmphetamines,
  drugUsageBenzodiazepines,
  drugUsageCannabis,
  drugUsageCocaine,
  drugUsageCrack,
  drugUsageEcstasy,
  drugUsageHallucinogenics,
  drugUsageHeroin,
  drugUsageMethadoneNotPrescribed,
  drugUsageMisusedPrescribedDrugs,
  drugUsageOtherOpiates,
  drugUsageSolvents,
  drugUsageSteroids,
  drugUsageSpice,
  drugUsageOtherDrug,
}
