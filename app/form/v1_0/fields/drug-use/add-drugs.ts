import FormWizard from 'hmpo-form-wizard'
import { utils } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import characterLimits from '../../config/characterLimits'
import { dependentOn } from '../common/utils'

const drugUseTypeHint = `
  <p class="govuk-hint">Select all that apply.</p>`

const selectMisusedDrugs: FormWizard.Field = {
  text: 'Which drugs has [subject] misused?',
  code: 'select_misused_drugs',
  hint: { html: drugUseTypeHint, kind: 'html' },
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: 'Select which drugs they have used' }],
  options: [
    { text: 'Amphetamines (including speed, methamphetamine)', value: 'AMPHETAMINES', kind: 'option' },
    { text: 'Benzodiazepines (including diazepam, xanex)', value: 'BENZODIAZEPINES', kind: 'option' },
    { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
    { text: 'Cocaine', value: 'COCAINE', kind: 'option' },
    { text: 'Crack cocaine', value: 'CRACK', kind: 'option' },
    { text: 'Ecstasy (MDMA)', value: 'ECSTASY', kind: 'option' },
    { text: 'Hallucinogenics (including ketamine)', value: 'HALLUCINOGENICS', kind: 'option' },
    { text: 'Heroin', value: 'HEROIN', kind: 'option' },
    { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
    { text: 'Prescribed drugs', value: 'MISUSED_PRESCRIBED_DRUGS', kind: 'option' },
    { text: 'Other opiates', value: 'OTHER_OPIATES', kind: 'option' },
    { text: 'Solvents (including gases and glues)', value: 'SOLVENTS', kind: 'option' },
    { text: 'Steroids', value: 'STEROIDS', kind: 'option' },
    { text: 'Synthetic cannabinoids (spice)', value: 'SPICE', kind: 'option' },
    { text: 'Other', value: 'OTHER_DRUG', kind: 'option' },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
}

const misusedDrugsLastUsedField = (option: string): FormWizard.Field => ({
  text: '',
  code: utils.fieldCodeWith('drug_usage', option),
  type: FieldType.Radio,
  dependent: dependentOn(selectMisusedDrugs, option),
  validate: [{ type: ValidationType.Required, message: 'Select when they last used this drug' }],
  options: [
    { text: 'Used in the last 6 months', value: 'LAST_SIX', kind: 'option' },
    { text: 'Used more than 6 months ago', value: 'MORE_THAN_SIX', kind: 'option' },
  ],
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
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

const misusedDrugsLastUsed: FormWizard.Field[] = [
  misusedDrugsLastUsedField('AMPHETAMINES'),
  misusedDrugsLastUsedField('BENZODIAZEPINES'),
  misusedDrugsLastUsedField('CANNABIS'),
  misusedDrugsLastUsedField('COCAINE'),
  misusedDrugsLastUsedField('CRACK'),
  misusedDrugsLastUsedField('ECSTASY'),
  misusedDrugsLastUsedField('HALLUCINOGENICS'),
  misusedDrugsLastUsedField('HEROIN'),
  misusedDrugsLastUsedField('METHADONE_NOT_PRESCRIBED'),
  misusedDrugsLastUsedField('MISUSED_PRESCRIBED_DRUGS'),
  misusedDrugsLastUsedField('OTHER_OPIATES'),
  misusedDrugsLastUsedField('SOLVENTS'),
  misusedDrugsLastUsedField('STEROIDS'),
  misusedDrugsLastUsedField('SPICE'),
  misusedDrugsLastUsedField('OTHER_DRUG'),
]

export default {
  selectMisusedDrugs,
  otherDrugNameField,
  misusedDrugsLastUsed,
}
