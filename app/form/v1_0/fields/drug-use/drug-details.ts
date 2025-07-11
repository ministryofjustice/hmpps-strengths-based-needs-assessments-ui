import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import { FieldsFactory, utils } from '../common'
import {
  dependentOn,
  fieldCodeWith,
  getMediumLabelClassFor,
  getSmallLabelClassFor,
  requiredWhenValidator,
  yesNoOptions,
} from '../common/utils'
import addDrugs, { drugLastUsedField } from './add-drugs'
import { drugsList } from './drugs'
import characterLimits from '../../config/characterLimits'

const usedLastSixMonths: Array<FormWizard.Field> = drugsList
  .map(drug => {
    const dependsOn = drugLastUsedField(drug)
    const field: FormWizard.Field = {
      text: 'How often is [subject] using this drug?',
      code: fieldCodeWith('how_often_used_last_six_months', drug.value),
      type: FieldType.Radio,
      classes: 'govuk-radios--inline',
      validate: [
        {
          type: ValidationType.Required,
          message: "Select how often they're using this drug",
        },
      ],
      options: ['Daily', 'Weekly', 'Monthly', 'Occasionally'].map(it => ({
        text: it,
        value: it.toUpperCase(),
        kind: 'option',
      })),
      dependent: dependentOn(dependsOn, 'LAST_SIX', false),
    }
    const detailsField: FormWizard.Field = {
      text: 'Give details (optional)',
      code: fieldCodeWith(field.code, 'details'),
      type: FieldType.TextArea,
      validate: [
        {
          type: 'validateMaxLength',
          fn: utils.validateMaxLength,
          arguments: [characterLimits.default],
          message: `Details must be ${characterLimits.default} characters or less`,
        },
      ],
      dependent: dependentOn(dependsOn, 'LAST_SIX', false),
    }
    return [field, detailsField]
  })
  .flat()

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
      message: 'Enter details about their use of these drugs',
    },
    {
      type: 'validateMaxLength',
      fn: utils.validateMaxLength,
      arguments: [characterLimits.default],
      message: `Details must be ${characterLimits.default} characters or less`,
    },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
}

const injectableDrugsOptions: Array<FormWizard.Field.Option> = drugsList
  .filter(it => it.injectable)
  .map(it => ({
    text: it.text,
    value: it.value,
    kind: 'option',
  }))

const injectedDrugs: FormWizard.Field = {
  text: 'Which drugs has [subject] injected?',
  code: 'drugs_injected',
  hint: {
    kind: 'text',
    text: 'Select all that apply.',
  },
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: `Select which drugs they've injected, or select 'None'` }],
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
  classes: 'injected-drugs-checkboxes',
  labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  transform(state): FormWizard.Field {
    return {
      ...this,
      options: (this.options as FormWizard.Field.Options).map(option => {
        if (option.kind === 'divider' || option.value === 'NONE') return option
        const drug = drugsList.find(it => it.value === option.value)
        const lastUsed = state.answers[drugLastUsedField(drug).code]
        const drugName = option.value === 'OTHER_DRUG' ? state.answers[addDrugs.otherDrugNameField.code] : option.text
        if (lastUsed === undefined) {
          return {
            ...option,
            text: drugName,
            selected: false,
            checked: false,
            disabled: true,
            attributes: { 'data-hidden': true },
          }
        }
        return {
          ...option,
          text: drugName,
        }
      }),
    }
  },
}

const injectedDrugsWhen: Array<FormWizard.Field> = drugsList
  .filter(it => it.injectable)
  .map(drug => ({
    text: `When has [subject] injected this drug?`,
    hint: { text: 'Select one or both.', kind: 'text' },
    code: fieldCodeWith('drugs_injected', drug.value),
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        fn: requiredWhenValidator(drugLastUsedField(drug).code, 'assessment', 'LAST_SIX'),
        message: 'Select when they injected this drug',
      },
    ],
    options: [
      { text: 'In the last 6 months', value: 'LAST_SIX', kind: 'option' },
      { text: 'More than 6 months ago', value: 'MORE_THAN_SIX', kind: 'option' },
    ],
    labelClasses: getSmallLabelClassFor(FieldType.CheckBox),
    dependent: dependentOn(injectedDrugs, drug.value),
    transform(state): FormWizard.Field {
      const lastUsed = state.answers[drugLastUsedField(drug).code]
      if (lastUsed === 'LAST_SIX') return this
      return {
        ...this,
        formGroupClasses: `${this.formGroupClasses} hidden-conditional`,
        options: this.options.map((it: FormWizard.Field.Option) => ({
          ...it,
          selected: false,
          checked: false,
          disabled: true,
        })),
      }
    },
  }))

const drugsIsReceivingTreatment: FormWizard.Field = {
  text: `Is [subject] receiving treatment for their drug use?`,
  code: `drugs_is_receiving_treatment`,
  type: FieldType.Radio,
  validate: [{ type: ValidationType.Required, message: `Select if they're receiving treatment for their drug use` }],
  options: yesNoOptions,
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  transform(state): FormWizard.Field {
    const usedInTheLastSixMonths = addDrugs.drugLastUsedFields.some(field => state.answers[field.code] === 'LAST_SIX')
    if (usedInTheLastSixMonths) return this
    return {
      ...this,
      text: this.text.replace(
        /^Is (.+?) receiving treatment for their drug use\?$/,
        'Has $1 ever received treatment for their drug use?',
      ),
      validate: this.validate.map((it: FormWizard.Validate) => ({
        ...it,
        message:
          'type' in it && it.type === ValidationType.Required
            ? 'Select if they have ever received treatment'
            : it.message,
      })),
    }
  },
}

const drugsIsReceivingTreatmentYesDetails = FieldsFactory.detailsField({
  parentField: drugsIsReceivingTreatment,
  dependentValue: 'YES',
  required: true,
  requiredMessage: `Give details on their treatment`,
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
