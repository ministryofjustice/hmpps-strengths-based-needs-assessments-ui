import FormWizard from 'hmpo-form-wizard'
import { utils } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import characterLimits from '../../config/characterLimits'
import { dependentOn } from '../common/fieldUtils'

import { Drug, drugsList } from './drugs'

const selectMisusedDrugs: FormWizard.Field = {
  text: 'Which drugs has [subject] misused?',
  code: 'select_misused_drugs',
  hint: { text: 'Select all that apply.', kind: 'text' },
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: "Select which drugs they've misused" }],
  options: drugsList.map(drug => ({
    text: drug.text,
    value: drug.value,
    kind: 'option',
  })),
  labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
}

export const drugLastUsedField = (drug: Drug): FormWizard.Field => ({
  text: `When did they last use ${drug.text}?`,
  code: utils.fieldCodeWith('drug_last_used', drug.value),
  type: FieldType.Radio,
  dependent: dependentOn(selectMisusedDrugs, drug.value),
  validate: [{ type: ValidationType.Required, message: 'Select when they last used this drug' }],
  options: [
    { text: 'Used in the last 6 months', value: 'LAST_SIX', kind: 'option' },
    { text: 'Used more than 6 months ago', value: 'MORE_THAN_SIX', kind: 'option' },
  ],
  labelClasses: utils.visuallyHidden,
})

const otherDrugNameField: FormWizard.Field = {
  text: "Enter which other drug they've misused",
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
  labelClasses: utils.visuallyHidden,
}

const drugLastUsedFields = drugsList.map(drugLastUsedField)

export default {
  selectMisusedDrugs,
  otherDrugNameField,
  drugLastUsedFields,
}
