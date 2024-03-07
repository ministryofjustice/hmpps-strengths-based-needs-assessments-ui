import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  createPractitionerAnalysisFieldsWith,
  createWantToMakeChangesFields,
  fieldCodeWith,
  getMediumLabelClassFor,
  orDivider,
  smallRadios,
  toFormWizardFields,
  yesNoOptions,
} from './common'

const usageFrequencies = [
  { text: 'Daily', value: 'DAILY' },
  { text: 'Weekly', value: 'WEEKLY' },
  { text: 'Monthly', value: 'MONTHLY' },
  { text: 'Occasionally', value: 'OCCASIONALLY' },
]

export function requiredWhenContains(field: string, requiredValue: string) {
  return function validateRequiredWhenContains(value: string) {
    const persistedAnswers = this.sessionModel?.options?.req?.form?.persistedAnswers || {}
    const values = persistedAnswers[field]

    return (
      Array.isArray(values) && (!values.includes(requiredValue) || (values.includes(requiredValue) && value !== ''))
    )
  }
}

const frequencyOptions: FormWizard.Field.Options = [
  ...usageFrequencies.map(({ text, value }): FormWizard.Field.Option => ({ text, value, kind: 'option' })),
  orDivider,
  { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
]

const createFieldForDrugUsage = (option: string): FormWizard.Field => ({
  text: 'How often is [subject] using this drug?',
  code: fieldCodeWith('drug_usage', option),
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', option),
      message: 'Select how often they are using this drug',
    },
  ],
  options: frequencyOptions,
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  dependent: { field: 'drug_use_type', value: option },
})

const createFieldForInjectingDrug = (option: string, frequency: string): FormWizard.Field => ({
  text: 'Is [subject] injecting this drug?',
  code: fieldCodeWith('injecting_drug', option),
  id: fieldCodeWith(frequency, 'injecting_drug', option),
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', option),
      message: 'Select if they are injecting this drug',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: fieldCodeWith('drug_usage', option),
    value: frequency,
    displayInline: true,
  },
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  classes: smallRadios,
})

const createFieldForPastDrugUsage = (option: string): FormWizard.Field => ({
  text: 'Has [subject] used this drug in the past?',
  code: fieldCodeWith('past_drug_usage', option),
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', option),
      message: 'Select if they have used this drug in the past',
    },
  ],
  options: yesNoOptions,
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  dependent: { field: 'drug_use_type', value: option },
})

const createFieldForPastInjectingDrug = (option: string): FormWizard.Field => ({
  text: 'Was [subject] injecting this drug?',
  code: fieldCodeWith('past_injecting_drug', option),
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', option),
      message: 'Select if they were injecting this drug',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: fieldCodeWith('past_drug_usage', option),
    value: 'YES',
    displayInline: true,
  },
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  classes: smallRadios,
})

const createFieldForReceivingTreatment = (option: string, frequency: string): FormWizard.Field => ({
  text: 'Is [subject] receiving treatment?',
  code: fieldCodeWith('drug_usage_treatment', option),
  id: fieldCodeWith(frequency, 'drug_usage_treatment', option),
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', option),
      message: 'Select if they are receiving treatment',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: fieldCodeWith('drug_usage', option),
    value: frequency,
    displayInline: true,
  },
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  classes: smallRadios,
})

const createFieldForPastReceivingTreatment = (option: string): FormWizard.Field => ({
  text: 'Is [subject] receiving treatment?',
  code: fieldCodeWith('past_drug_usage_treatment', option),
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', option),
      message: 'Select if they are receiving treatment',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: fieldCodeWith('past_drug_usage', option),
    value: 'YES',
    displayInline: true,
  },
  labelClasses: getMediumLabelClassFor(FieldType.Radio),
  classes: smallRadios,
})

const createDrugUsage = (option: string): Array<FormWizard.Field> => [
  createFieldForDrugUsage(option),
  createFieldForPastDrugUsage(option),
]

const createFieldsForInjectableDrug = (option: string): Array<FormWizard.Field> => [
  ...createDrugUsage(option),
  ...usageFrequencies.map(frequency => createFieldForInjectingDrug(option, frequency.value)),
  createFieldForPastInjectingDrug(option),
]

const createFieldsForHeroin = (): Array<FormWizard.Field> => [
  ...createFieldsForInjectableDrug('HEROIN'),
  ...usageFrequencies.map(frequency => createFieldForReceivingTreatment('HEROIN', frequency.value)),
  createFieldForPastReceivingTreatment('HEROIN'),
]

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the drug use section complete?',
  code: 'drug_use_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the drug use analysis section complete?',
  code: 'drug_use_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export const drugUseFields: Array<FormWizard.Field> = [
  {
    text: 'Has [subject] ever used drugs?',
    code: 'drug_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever used drugs' }],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

export const drugUseTypeFields: Array<FormWizard.Field> = [
  {
    text: 'Which drugs has [subject] used?',
    code: 'drug_use_type',
    hint: { text: 'Include current and previous drugs. Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select which drugs they have used' }],
    options: [
      { text: 'Amphetamines', value: 'AMPHETAMINES', kind: 'option' },
      { text: 'Benzodiazepines', value: 'BENZODIAZEPINES', kind: 'option' },
      { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
      { text: 'Cocaine hydrochloride', value: 'COCAINE', kind: 'option' },
      { text: 'Crack cocaine', value: 'CRACK', kind: 'option' },
      { text: 'Ecstasy (also known as MDMA)', value: 'ECSTASY', kind: 'option' },
      { text: 'Hallucinogenics', value: 'HALLUCINOGENICS', kind: 'option' },
      { text: 'Heroin', value: 'HEROIN', kind: 'option' },
      { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
      { text: 'Misused prescribed drugs', value: 'MISUSED_PRESCRIBED_DRUGS', kind: 'option' },
      { text: 'Other opiates', value: 'OTHER_OPIATES', kind: 'option' },
      { text: 'Solvents (including gases and glues)', value: 'SOLVENTS', kind: 'option' },
      { text: 'Steroids', value: 'STEROIDS', kind: 'option' },
      { text: 'Spice', value: 'SPICE', kind: 'option' },
      { text: 'Other', value: 'OTHER_DRUG', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Enter drug name',
    code: 'other_drug_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter drug name' }],
    dependent: {
      field: 'drug_use_type',
      value: 'OTHER_DRUG',
      displayInline: true,
    },
  },
]

export const drugUsageDetailsFields: Array<FormWizard.Field> = [
  {
    text: 'Why did [subject] start using drugs?',
    hint: { text: 'Consider their history and any triggers of drug use. Select all that apply', kind: 'text' },
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
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details',
    code: 'drug_use_reason_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_reasons',
      value: 'OTHER',
      displayInline: true,
    },
  },
  {
    text: "What's the impact of [subject] using drugs?",
    hint: { text: 'Select all that apply', kind: 'text' },
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
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details',
    hint: { text: 'Consider impact on themselves or others.', kind: 'text' },
    code: 'drug_use_impact_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_impact',
      value: 'OTHER',
      displayInline: true,
    },
  },
  {
    text: 'Has anything helped [subject] to stop or reduce using drugs in the past?',
    code: 'reducing_or_stopping_drug_use',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if anything has helped them to stop or reduce using drugs in the past',
      },
    ],
    options: yesNoOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'reducing_or_stopping_drug_use_details',
    type: FieldType.TextArea,
    dependent: {
      field: 'reducing_or_stopping_drug_use',
      value: 'YES',
      displayInline: true,
    },
  },
  {
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

export const drugUseChangesFields = createWantToMakeChangesFields('their drug use', 'drug_use')

export const drugUseTypeDetailsFields = [
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

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith('drugs')

export default [
  ...drugUseFields,
  ...drugUsageDetailsFields,
  ...drugUseChangesFields,
  ...drugUseTypeFields,
  ...drugUseTypeDetailsFields,
  ...sectionCompleteFields,
  ...practitionerAnalysisFields,
].reduce(toFormWizardFields, {})
