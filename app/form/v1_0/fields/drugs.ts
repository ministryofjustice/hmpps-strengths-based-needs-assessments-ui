import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn } from './common/utils'
import characterLimits from '../config/characterLimits'

const usageFrequencies = [
  { text: 'Daily', value: 'DAILY' },
  { text: 'Weekly', value: 'WEEKLY' },
  { text: 'Monthly', value: 'MONTHLY' },
  { text: 'Occasionally', value: 'OCCASIONALLY' },
]

const frequencyOptions: FormWizard.Field.Options = [
  ...usageFrequencies.map(({ text, value }): FormWizard.Field.Option => ({ text, value, kind: 'option' })),
  utils.orDivider,
  { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
]

const createFieldForDrugUsage = (option: string): FormWizard.Field => ({
  text: 'How often is [subject] using this drug?',
  code: utils.fieldCodeWith('drug_usage', option),
  type: FieldType.Radio,
  validate: [
    {
      type: ValidationType.Required,
      message: 'Select how often they are using this drug',
    },
  ],
  options: frequencyOptions,
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
  dependent: { field: 'drug_use_type', value: option },
})

const createFieldForInjectingDrug = (option: string, frequency: string): FormWizard.Field => ({
  text: 'Is [subject] injecting this drug?',
  code: utils.fieldCodeWith('injecting_drug', option),
  id: utils.fieldCodeWith(frequency, 'injecting_drug', option),
  type: FieldType.Radio,
  validate: [
    {
      type: ValidationType.Required,
      message: 'Select if they are injecting this drug',
    },
  ],
  options: utils.yesNoOptions,
  dependent: {
    field: utils.fieldCodeWith('drug_usage', option),
    value: frequency,
    displayInline: true,
  },
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
  classes: utils.smallRadios,
})

const createFieldForPastDrugUsage = (option: string): FormWizard.Field => ({
  text: 'Has [subject] used this drug in the past?',
  code: utils.fieldCodeWith('past_drug_usage', option),
  type: FieldType.Radio,
  validate: [
    {
      type: ValidationType.Required,
      message: 'Select if they have used this drug in the past',
    },
  ],
  options: utils.yesNoOptions,
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
  dependent: { field: 'drug_use_type', value: option },
})

const createFieldForPastInjectingDrug = (option: string): FormWizard.Field => ({
  text: 'Was [subject] injecting this drug?',
  code: utils.fieldCodeWith('past_injecting_drug', option),
  type: FieldType.Radio,
  validate: [
    {
      type: ValidationType.Required,
      message: 'Select if they were injecting this drug',
    },
  ],
  options: utils.yesNoOptions,
  dependent: {
    field: utils.fieldCodeWith('past_drug_usage', option),
    value: 'YES',
    displayInline: true,
  },
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
  classes: utils.smallRadios,
})

const createFieldForReceivingTreatment = (option: string, frequency: string): FormWizard.Field => ({
  text: 'Is [subject] receiving treatment?',
  code: utils.fieldCodeWith('drug_usage_treatment', option),
  id: utils.fieldCodeWith(frequency, 'drug_usage_treatment', option),
  type: FieldType.Radio,
  validate: [
    {
      type: ValidationType.Required,
      message: 'Select if they are receiving treatment',
    },
  ],
  options: utils.yesNoOptions,
  dependent: {
    field: utils.fieldCodeWith('drug_usage', option),
    value: frequency,
    displayInline: true,
  },
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
  classes: utils.smallRadios,
})

const createFieldForPastReceivingTreatment = (option: string): FormWizard.Field => ({
  text: 'Was [subject] receiving treatment?',
  code: utils.fieldCodeWith('past_drug_usage_treatment', option),
  type: FieldType.Radio,
  validate: [
    {
      type: ValidationType.Required,
      message: 'Select if they were receiving treatment',
    },
  ],
  options: utils.yesNoOptions,
  dependent: {
    field: utils.fieldCodeWith('past_drug_usage', option),
    value: 'YES',
    displayInline: true,
  },
  labelClasses: utils.getSmallLabelClassFor(FieldType.Radio),
  classes: utils.smallRadios,
})

const createDrugUsage = (option: string): Array<FormWizard.Field> => [
  createFieldForDrugUsage(option),
  createFieldForPastDrugUsage(option),
]

const createFieldsForInjectableDrug = (option: string): Array<FormWizard.Field> =>
  [
    createDrugUsage(option),
    usageFrequencies.map(frequency => createFieldForInjectingDrug(option, frequency.value)),
    createFieldForPastInjectingDrug(option),
  ].flat()

const createFieldsForHeroin = (): Array<FormWizard.Field> =>
  [
    createFieldsForInjectableDrug('HEROIN'),
    usageFrequencies.map(frequency => createFieldForReceivingTreatment('HEROIN', frequency.value)),
    createFieldForPastReceivingTreatment('HEROIN'),
  ].flat()

const drugUseTypeHint = `
<p class="govuk-hint">Include current and previous drugs.</p>
<p class="govuk-hint">Select all that apply.</p>
`

const drugUseReasonsHint = `
<p class="govuk-hint">Consider their history and any triggers of drug use.</p>
<p class="govuk-hint">Select all that apply.</p>
`

class DrugsFieldsFactory extends FieldsFactory {
  drugUse: FormWizard.Field = {
    text: 'Has [subject] ever used drugs?',
    code: 'drug_use',
    type: FieldType.Radio,
    hint: {
      text: 'This refers to the misuse of prescription drugs as well as the use of illegal drugs.',
      kind: 'text',
    },
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever used drugs' }],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  drugUseType: FormWizard.Field = {
    text: 'Which drugs has [subject] used?',
    code: 'drug_use_type',
    hint: { html: drugUseTypeHint, kind: 'html' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select which drugs they have used' }],
    options: [
      { text: 'Amphetamines', value: 'AMPHETAMINES', kind: 'option' },
      { text: 'Benzodiazepines', value: 'BENZODIAZEPINES', kind: 'option' },
      { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
      { text: 'Cocaine hydrochloride', value: 'COCAINE', kind: 'option' },
      { text: 'Crack or cocaine', value: 'CRACK', kind: 'option' },
      { text: 'Ecstasy (also known as MDMA)', value: 'ECSTASY', kind: 'option' },
      { text: 'Hallucinogenics', value: 'HALLUCINOGENICS', kind: 'option' },
      { text: 'Heroin', value: 'HEROIN', kind: 'option' },
      { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
      { text: 'Misused prescribed drugs', value: 'MISUSED_PRESCRIBED_DRUGS', kind: 'option' },
      { text: 'Other opiates', value: 'OTHER_OPIATES', kind: 'option' },
      { text: 'Solvents (including gases and glues)', value: 'SOLVENTS', kind: 'option' },
      { text: 'Spice', value: 'SPICE', kind: 'option' },
      { text: 'Steroids', value: 'STEROIDS', kind: 'option' },
      { text: 'Other', value: 'OTHER_DRUG', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  otherDrugDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.drugUseType,
    dependentValue: 'OTHER_DRUG',
    required: true,
    maxChars: characterLimits.c200,
  })

  drugUseReasons: FormWizard.Field = {
    text: 'Why did [subject] start using drugs?',
    hint: { html: drugUseReasonsHint, kind: 'html' },
    code: 'drug_use_reasons',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they started using drugs' }],
    options: [
      { text: 'Cultural or religious practices', value: 'CULTURAL_OR_RELIGIOUS', kind: 'option' },
      { text: 'Curiosity or experimentation', value: 'CURIOSITY_OR_EXPERIMENTATION', kind: 'option' },
      { text: 'Enhance performance', value: 'ENHANCE_PERFORMANCE', kind: 'option' },
      { text: 'Escapism or avoidance', value: 'ESCAPISM_OR_AVOIDANCE', kind: 'option' },
      { text: 'Manage stress or emotional issues', value: 'MANAGING_EMOTIONAL_ISSUES', kind: 'option' },
      { text: 'Peer pressure or social influence', value: 'PEER_PRESSURE', kind: 'option' },
      { text: 'Recreation or pleasure', value: 'RECREATION_PLEASURE', kind: 'option' },
      { text: 'Self-medication for pain', value: 'SELF_MEDICATION', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  drugUseReasonDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.drugUseReasons,
    dependentValue: 'OTHER',
    required: true,
  })

  drugUseImpact: FormWizard.Field = {
    text: "What's the impact of [subject] using drugs?",
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'drug_use_impact',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select the impact of them using drugs' }],
    options: [
      {
        text: 'Behavioural',
        value: 'BEHAVIOURAL',
        hint: { text: 'Includes unemployment, disruption on education or lack of productivity.' },
        kind: 'option',
      },
      {
        text: 'Community',
        value: 'COMMUNITY',
        hint: { text: 'Includes limited opportunities or judgement from others.' },
        kind: 'option',
      },
      { text: 'Finances', value: 'FINANCES', hint: { text: 'Includes having no money.' }, kind: 'option' },
      { text: 'Links to offending', value: 'LINKS_TO_REOFFENDING', kind: 'option' },
      {
        text: 'Physical or mental health',
        value: 'PHYSICAL_OR_MENTAL_HEALTH',
        hint: { text: 'Includes overdose.' },
        kind: 'option',
      },
      {
        text: 'Relationships',
        value: 'RELATIONSHIPS',
        hint: { text: 'Includes isolation or neglecting responsibilities.' },
        kind: 'option',
      },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  drugUseImpactDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.drugUseImpact,
    textHint: 'Consider impact on themselves or others.',
    dependentValue: 'OTHER',
    required: true,
  })

  reducingOrStoppingDrugUse: FormWizard.Field = {
    text: 'Has anything helped [subject] to stop or reduce using drugs in the past?',
    code: 'reducing_or_stopping_drug_use',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if anything has helped them to stop or reduce using drugs in the past',
      },
    ],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  reducingOrStoppingDrugUseDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.reducingOrStoppingDrugUse,
    dependentValue: 'YES',
  })

  motivatedStoppingDrugUse: FormWizard.Field = {
    text: 'Is [subject] motivated to stop or reduce their drug use?',
    code: 'motivated_stopping_drug_use',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are motivated to stop or reduce their drug use' },
    ],
    options: [
      { text: 'Motivated to stop or reduce', value: 'MOTIVATED', kind: 'option' },
      { text: 'Shows some motivation to stop or reduce', value: 'SOME_MOTIVATION', kind: 'option' },
      { text: 'Does not show motivation to stop or reduce', value: 'NO_MOTIVATION', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  drugUseGroup = [this.drugUse]

  drugUsageDetailsGroup = [
    this.drugUseReasons,
    this.drugUseReasonDetails,
    this.drugUseImpact,
    this.drugUseImpactDetails,
    this.reducingOrStoppingDrugUse,
    this.reducingOrStoppingDrugUseDetails,
    this.motivatedStoppingDrugUse,
  ]

  drugUseTypeGroup = [this.drugUseType, this.otherDrugDetails]

  drugUseTypeDetailsGroup = [
    createFieldsForInjectableDrug('AMPHETAMINES'),
    createFieldsForInjectableDrug('BENZODIAZEPINES'),
    createDrugUsage('CANNABIS'),
    createFieldsForInjectableDrug('COCAINE'),
    createFieldsForInjectableDrug('CRACK'),
    createDrugUsage('ECSTASY'),
    createDrugUsage('HALLUCINOGENICS'),
    createFieldsForHeroin(),
    createFieldsForInjectableDrug('METHADONE_NOT_PRESCRIBED'),
    createFieldsForInjectableDrug('MISUSED_PRESCRIBED_DRUGS'),
    createFieldsForInjectableDrug('OTHER_OPIATES'),
    createDrugUsage('SOLVENTS'),
    createFieldsForInjectableDrug('STEROIDS'),
    createDrugUsage('SPICE'),
    createFieldsForInjectableDrug('OTHER_DRUG'),
  ].flat()
}

export default new DrugsFieldsFactory(sections.drugs)
