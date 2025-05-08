import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import { FieldsFactory, utils } from '../common'
import {
  dependentOn,
  fieldCodeWith,
  getMediumLabelClassFor,
  getSmallLabelClassFor, requiredWhenValidator,
  yesNoOptions,
} from '../common/utils'
import { drugLastUsedField } from './add-drugs'
import FormWizard from 'hmpo-form-wizard'
import { drugsList } from './drugs'
import characterLimits from '../../config/characterLimits'

const usedLastSixMonths: Array<FormWizard.Field> = drugsList.map(drug => {
  const dependsOn = drugLastUsedField(drug)
  const field: FormWizard.Field = {
    text: 'How often is [subject] using this drug?',
    code: fieldCodeWith('how_often_used_last_six_months', drug.value),
    type: FieldType.Radio,
    classes: 'govuk-radios--inline',
    validate: [{
      type: ValidationType.Required,
      message: 'Select how often they have used this drug', // TODO: check error message
    }],
    options: ['Daily', 'Weekly', 'Monthly', 'Occasionally']
      .map(it => ({ text: it, value: it.toUpperCase(), kind: 'option' })),
    dependent: dependentOn(dependsOn, 'LAST_SIX', false),
  }
  return [field, FieldsFactory.detailsField({ parentField: field })]
}).flat()

const notUsedInTheLastSixMonths: FormWizard.Field = {
  text: `Give details about [subject]'s use of these drugs`,
  code: 'not_used_in_last_six_months_details',
  hint: {
    text: 'For example, how often they used these drugs, when they stopped using, and if their use was an issue.',
    kind: 'text',
  },
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.Required,
      message: "asdasdsa", // TODO: add error message
    },
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.default],
      message: `Details must be ${characterLimits.default} characters or less`, // TODO: add error message
    },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
}

const injectableDrugsOptions: Array<FormWizard.Field.Option> = drugsList.filter(it => it.injectable).map(it => ({
  text: it.text,
  value: it.value,
  kind: 'option',
}))

const injectedDrugs: FormWizard.Field = {
  text: 'Which drugs has [subject] injected?',
  code: 'drugs_injected',
  type: FieldType.CheckBox,
  multiple: true,
  validate: [
    { type: ValidationType.Required, message: 'Select the highest level of academic qualification completed' },
  ],
  options: [
    {
      text: 'None',
      value: 'NONE',
      kind: 'option',
      behaviour: 'exclusive',
    },
    utils.orDivider,
    ...injectableDrugsOptions,
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
}

const injectedDrugsWhen: Array<FormWizard.Field> = drugsList.filter(it => it.injectable).map(drug => ({
  text: `When has [subject] injected this drug?`,
  hint: { text: 'Select one or both', kind: 'text' },
  code: fieldCodeWith('drugs_injected', drug.value),
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{
    fn: requiredWhenValidator(drugLastUsedField(drug).code, 'LAST_SIX'),
    message: 'Select one or both',
  }],
  options: [
    { text: 'In the last 6 months', value: 'LAST_SIX', kind: 'option' },
    { text: 'More than 6 months ago', value: 'MORE_THAN_SIX', kind: 'option' },
  ],
  labelClasses: getSmallLabelClassFor(FieldType.Radio),
  dependent: dependentOn(injectedDrugs, drug.value),
}))

const drugsIsReceivingTreatment: FormWizard.Field = {
  text: `Is [subject] receiving treatment for their drug use?`,
  code: `drugs_is_receiving_treatment`,
  type: FieldType.Radio,
  validate: [{ type: ValidationType.Required, message: 'Select if there are receiving treatment' }],
  options: yesNoOptions,
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
}

const drugsIsReceivingTreatmentYesDetails = FieldsFactory.detailsField({
  parentField: drugsIsReceivingTreatment,
  dependentValue: 'YES',
  required: true,
})

const drugsIsReceivingTreatmentNoDetails = FieldsFactory.detailsField({
  parentField: drugsIsReceivingTreatment,
  dependentValue: 'NO',
})

export default {
  usedLastSixMonths,
  notUsedInTheLastSixMonths,
  injectedDrugs,
  injectedDrugsWhen,
  drugsIsReceivingTreatment,
  drugsIsReceivingTreatmentYesDetails,
  drugsIsReceivingTreatmentNoDetails,
}
