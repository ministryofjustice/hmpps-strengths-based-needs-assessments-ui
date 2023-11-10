import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  inlineRadios,
  mediumLabel,
  orDivider,
  requiredWhen,
  smallRadios,
  summaryCharacterLimit,
  yesNoOptions,
} from './common'

function requiredWhenContains(field: string, requiredValue: string) {
  return function validateRequiredWhenContains(value: string) {
    const persistedAnswers = this.sessionModel?.options?.req?.form?.persistedAnswers || {}
    const values = persistedAnswers[field]?.values

    return (
      Array.isArray(values) && (!values.includes(requiredValue) || (values.includes(requiredValue) && value !== ''))
    )
  }
}

const frequencyOptions: FormWizard.Field.Options = [
  { text: 'Daily', value: 'DAILY', kind: 'option' },
  { text: 'Weekly', value: 'WEEKLY', kind: 'option' },
  { text: 'Monthly', value: 'MONTHLY', kind: 'option' },
  { text: 'Occasionally', value: 'OCCASIONALLY', kind: 'option' },
  orDivider,
  { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
]

const createReceivingTreatment = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
  dependentFieldValue: string,
): FormWizard.Field => ({
  text: 'Is [subject] receiving treatment?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', dependentFieldValue),
      message: 'Select if they are receiving treatment',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
  labelClasses: mediumLabel,
  classes: smallRadios,
})

const createInjectingDrug = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
  dependentFieldValue: string,
): FormWizard.Field => ({
  text: 'Is [subject] injecting this drug?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', dependentFieldValue),
      message: 'Select if they are injecting this drug',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
  labelClasses: mediumLabel,
  classes: smallRadios,
})

const createPastDrugUsage = (fieldCode: string, dependentFieldValue: string): FormWizard.Field => ({
  text: 'Has [subject] used this drug in the past?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', dependentFieldValue),
      message: 'Select if they have used this drug in the past',
    },
  ],
  options: yesNoOptions,
  labelClasses: mediumLabel,
  dependent: {
    field: 'drug_use_type',
    value: dependentFieldValue,
  },
})

const createPastInjectingDrug = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
  dependentFieldValue: string,
): FormWizard.Field => ({
  text: 'Was [subject] injecting this drug?',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenContains('drug_use_type', dependentFieldValue),
      message: 'Select if they were injecting this drug',
    },
  ],
  options: yesNoOptions,
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
  labelClasses: mediumLabel,
  classes: smallRadios,
})

const fields: FormWizard.Fields = {
  drug_use_section_complete: {
    text: 'Is the drug use section complete?',
    code: 'drug_use_section_complete',
    type: FieldType.Radio,
    options: yesNoOptions,
  },
  drug_use_analysis_section_complete: {
    text: 'Is the drug use analysis section complete?',
    code: 'drug_use_analysis_section_complete',
    type: FieldType.Radio,
    options: yesNoOptions,
  },
  drug_use: {
    text: 'Has [subject] ever used drugs?',
    code: 'drug_use',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have ever used drugs' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
  },
  drug_use_changes: {
    text: 'Does [subject] want to make changes to their drug use?',
    code: 'drug_use_changes',
    hint: { text: 'This question must be directly answered by [subject] ', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they want to make changes to their drug use' }],
    options: [
      { text: 'I have already made positive changes', value: 'MADE_CHANGES', kind: 'option' },
      { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
      { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
      { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
      { text: 'I do not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_positive_change: {
    text: 'Give details',
    code: 'drug_use_positive_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'MADE_CHANGES',
      displayInline: true,
    },
  },
  drug_use_active_change: {
    text: 'Give details',
    code: 'drug_use_active_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'MAKING_CHANGES',
      displayInline: true,
    },
  },
  drug_use_known_change: {
    text: 'Give details',
    code: 'drug_use_known_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'WANT_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  drug_use_help_change: {
    text: 'Give details',
    code: 'drug_use_help_change',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'NEEDS_HELP_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  drug_use_think_change: {
    text: 'Give details',
    code: 'drug_use_think_change:',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'THINKING_ABOUT_MAKING_CHANGES',
      displayInline: true,
    },
  },
  drug_use_no_change: {
    text: 'Give details',
    code: 'drug_use_no_change:',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'drug_use_changes',
      value: 'DOES_NOT_WANT_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  drug_use_type: {
    text: 'Which drugs have [subject] used?',
    code: 'drug_use_type',
    hint: { text: 'Include current and previous drugs. Select all that apply.', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select which drugs they have used' }],
    options: [
      { text: 'Amphetamines', value: 'AMPHETAMINES', kind: 'option' },
      { text: 'Benzodiazepines', value: 'BENZODIAZEPINES', kind: 'option' },
      { text: 'Cannabis', value: 'CANNABIS', kind: 'option' },
      { text: 'Cocaine', value: 'COCAINE', kind: 'option' },
      { text: 'Crack', value: 'CRACK', kind: 'option' },
      { text: 'Ecstasy', value: 'ECSTASY', kind: 'option' },
      { text: 'Heroin', value: 'HEROIN', kind: 'option' },
      { text: 'Ketamine', value: 'KETAMINE', kind: 'option' },
      { text: 'Methadone (not prescribed)', value: 'METHADONE_NOT_PRESCRIBED', kind: 'option' },
      { text: 'Methadone (prescribed)', value: 'METHADONE_PRESCRIBED', kind: 'option' },
      { text: 'Non-prescribed medication', value: 'NON_PRESCRIBED_MEDICATION', kind: 'option' },
      { text: 'Psychoactive substances (spice)', value: 'PSYCHOACTIVE_SUBSTANCES', kind: 'option' },
      { text: 'Other', value: 'OTHER_DRUG_TYPE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  other_drug_details: {
    text: 'Enter drug name',
    code: 'other_drug_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter drug name' }],
    dependent: {
      field: 'drug_use_type',
      value: 'OTHER_DRUG_TYPE',
      displayInline: true,
    },
  },
  drug_usage_heroin: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_heroin',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'HEROIN'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'HEROIN' },
  },
  daily_injecting_drug_heroin: createInjectingDrug('injecting_drug_heroin', 'drug_usage_heroin', 'DAILY', 'HEROIN'),
  weekly_injecting_drug_heroin: createInjectingDrug('injecting_drug_heroin', 'drug_usage_heroin', 'WEEKLY', 'HEROIN'),
  monthly_injecting_drug_heroin: createInjectingDrug('injecting_drug_heroin', 'drug_usage_heroin', 'MONTHLY', 'HEROIN'),
  occasionally_injecting_drug_heroin: createInjectingDrug(
    'injecting_drug_heroin',
    'drug_usage_heroin',
    'OCCASIONALLY',
    'HEROIN',
  ),
  daily_drug_usage_treatment_heroin: createReceivingTreatment(
    'drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'DAILY',
    'HEROIN',
  ),
  weekly_drug_usage_treatment_heroin: createReceivingTreatment(
    'drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'WEEKLY',
    'HEROIN',
  ),
  monthly_drug_usage_treatment_heroin: createReceivingTreatment(
    'drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'MONTHLY',
    'HEROIN',
  ),
  occasionally_drug_usage_treatment: createReceivingTreatment(
    'drug_usage_treatment_heroin',
    'drug_usage_heroin',
    'OCCASIONALLY',
    'HEROIN',
  ),
  past_drug_usage_heroin: createPastDrugUsage('past_drug_usage_heroin', 'HEROIN'),
  past_injecting_drug_heroin: createPastInjectingDrug(
    'past_injecting_drug_heroin',
    'past_drug_usage_heroin',
    'YES',
    'HEROIN',
  ),
  past_receiving_treatment_heroin: createReceivingTreatment(
    'past_receiving_treatment_heroin',
    'past_drug_usage_heroin',
    'YES',
    'HEROIN',
  ),
  drug_usage_methadone_not_prescribed: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_methadone_not_prescribed',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'METHADONE_NOT_PRESCRIBED'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'METHADONE_NOT_PRESCRIBED' },
  },
  daily_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'DAILY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  weekly_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'WEEKLY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  monthly_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'MONTHLY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  occasionally_injecting_drug_methadone_not_prescribed: createInjectingDrug(
    'injecting_drug_methadone_not_prescribed',
    'drug_usage_methadone_not_prescribed',
    'OCCASIONALLY',
    'METHADONE_NOT_PRESCRIBED',
  ),
  past_drug_usage_methadone_not_prescribed: createPastDrugUsage(
    'past_drug_usage_methadone_not_prescribed',
    'METHADONE_NOT_PRESCRIBED',
  ),
  past_injecting_drug_methadone_not_prescribed: createPastInjectingDrug(
    'past_injecting_drug_methadone_not_prescribed',
    'past_drug_usage_methadone_not_prescribed',
    'YES',
    'METHADONE_NOT_PRESCRIBED',
  ),
  drug_usage_crack: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_crack',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'CRACK'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'CRACK' },
  },
  daily_injecting_drug_crack: createInjectingDrug('injecting_drug_crack', 'drug_usage_crack', 'DAILY', 'CRACK'),
  weekly_injecting_drug_crack: createInjectingDrug('injecting_drug_crack', 'drug_usage_crack', 'WEEKLY', 'CRACK'),
  monthly_injecting_drug_crack: createInjectingDrug('injecting_drug_crack', 'drug_usage_crack', 'MONTHLY', 'CRACK'),
  occasionally_injecting_drug_crack: createInjectingDrug(
    'injecting_drug_crack',
    'drug_usage_crack',
    'OCCASIONALLY',
    'CRACK',
  ),
  past_drug_usage_crack: createPastDrugUsage('past_drug_usage_crack', 'CRACK'),
  past_injecting_drug_crack: createPastInjectingDrug(
    'past_injecting_drug_crack',
    'past_drug_usage_crack',
    'YES',
    'CRACK',
  ),
  drug_usage_amphetamines: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_amphetamines',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'AMPHETAMINES'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'AMPHETAMINES' },
  },
  daily_injecting_drug_amphetamines: createInjectingDrug(
    'injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'DAILY',
    'AMPHETAMINES',
  ),
  weekly_injecting_drug_amphetamines: createInjectingDrug(
    'injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'WEEKLY',
    'AMPHETAMINES',
  ),
  monthly_injecting_drug_amphetamines: createInjectingDrug(
    'injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'MONTHLY',
    'AMPHETAMINES',
  ),
  occasionally_injecting_drug_amphetamines: createInjectingDrug(
    'injecting_drug_amphetamines',
    'drug_usage_amphetamines',
    'OCCASIONALLY',
    'AMPHETAMINES',
  ),
  past_drug_usage_amphetamines: createPastDrugUsage('past_drug_usage_amphetamines', 'AMPHETAMINES'),
  past_injecting_drug_amphetamines: createPastInjectingDrug(
    'past_injecting_drug_amphetamines',
    'past_drug_usage_amphetamines',
    'YES',
    'AMPHETAMINES',
  ),
  drug_usage_benzodiazepines: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_benzodiazepines',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'BENZODIAZEPINES'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'BENZODIAZEPINES' },
  },
  daily_injecting_drug_benzodiazepines: createInjectingDrug(
    'injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'DAILY',
    'BENZODIAZEPINES',
  ),
  weekly_injecting_drug_benzodiazepines: createInjectingDrug(
    'injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'WEEKLY',
    'BENZODIAZEPINES',
  ),
  monthly_injecting_drug_benzodiazepines: createInjectingDrug(
    'injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'MONTHLY',
    'BENZODIAZEPINES',
  ),
  occasionally_injecting_drug_benzodiazepines: createInjectingDrug(
    'injecting_drug_benzodiazepines',
    'drug_usage_benzodiazepines',
    'OCCASIONALLY',
    'BENZODIAZEPINES',
  ),
  past_drug_usage_benzodiazepines: createPastDrugUsage('past_drug_usage_benzodiazepines', 'BENZODIAZEPINES'),
  past_injecting_drug_benzodiazepines: createPastInjectingDrug(
    'past_injecting_drug_benzodiazepines',
    'past_drug_usage_benzodiazepines',
    'YES',
    'BENZODIAZEPINES',
  ),
  drug_usage_other_drug: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_other_drug',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'OTHER_DRUG_TYPE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'OTHER_DRUG_TYPE' },
  },
  daily_injecting_drug_other_drug: createInjectingDrug(
    'injecting_drug_other_drug',
    'drug_usage_other_drug',
    'DAILY',
    'OTHER_DRUG_TYPE',
  ),
  weekly_injecting_drug_other_drug: createInjectingDrug(
    'injecting_drug_other_drug',
    'drug_usage_other_drug',
    'WEEKLY',
    'OTHER_DRUG_TYPE',
  ),
  monthly_injecting_drug_other_drug: createInjectingDrug(
    'injecting_drug_other_drug',
    'drug_usage_other_drug',
    'MONTHLY',
    'OTHER_DRUG_TYPE',
  ),
  occasionally_injecting_drug_other_drug: createInjectingDrug(
    'injecting_drug_other_drug',
    'drug_usage_other_drug',
    'OCCASIONALLY',
    'OTHER_DRUG_TYPE',
  ),
  past_drug_usage_other_drug: createPastDrugUsage('past_drug_usage_other_drug', 'OTHER_DRUG_TYPE'),
  past_injecting_drug_other_drug: createPastInjectingDrug(
    'past_injecting_drug_other_drug',
    'past_drug_usage_other_drug',
    'YES',
    'OTHER_DRUG_TYPE',
  ),
  drug_usage_cannabis: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_cannabis',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'CANNABIS'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'CANNABIS' },
  },
  past_drug_usage_cannabis: createPastDrugUsage('past_drug_usage_cannabis', 'CANNABIS'),
  drug_usage_cocaine: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_cocaine',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'COCAINE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'COCAINE' },
  },
  past_drug_usage_cocaine: createPastDrugUsage('past_drug_usage_cocaine', 'COCAINE'),
  drug_usage_ecstasy: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_ecstasy',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'ECSTASY'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'ECSTASY' },
  },
  past_drug_usage_ecstasy: createPastDrugUsage('past_drug_usage_ecstasy', 'ECSTASY'),
  drug_usage_ketamine: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_ketamine',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'KETAMINE'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'KETAMINE' },
  },
  past_drug_usage_ketamine: createPastDrugUsage('past_drug_usage_ketamine', 'KETAMINE'),
  drug_usage_methadone_prescribed: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_methadone_prescribed',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'METHADONE_PRESCRIBED'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'METHADONE_PRESCRIBED' },
  },
  past_drug_usage_methadone_prescribed: createPastDrugUsage(
    'past_drug_usage_methadone_prescribed',
    'METHADONE_PRESCRIBED',
  ),
  drug_usage_non_prescribed_medication: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_non_prescribed_medication',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'NON_PRESCRIBED_MEDICATION'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'NON_PRESCRIBED_MEDICATION' },
  },
  past_drug_usage_non_prescribed_medication: createPastDrugUsage(
    'past_drug_usage_non_prescribed_medication',
    'NON_PRESCRIBED_MEDICATION',
  ),
  drug_usage_psychoactive_substances: {
    text: 'How often is [subject] using this drug?',
    code: 'drug_usage_psychoactive_substances',
    type: FieldType.Radio,
    validate: [
      {
        fn: requiredWhenContains('drug_use_type', 'PSYCHOACTIVE_SUBSTANCES'),
        message: 'Select how often they are using this drug',
      },
    ],
    options: frequencyOptions,
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: 'PSYCHOACTIVE_SUBSTANCES' },
  },
  past_drug_usage_psychoactive_substances: createPastDrugUsage(
    'past_drug_usage_psychoactive_substances',
    'PSYCHOACTIVE_SUBSTANCES',
  ),
  drug_use_reasons: {
    text: 'Why did [subject] start using drugs?',
    hint: { text: 'Consider their history and any triggers of drug use. Select all that apply', kind: 'text' },
    code: 'drug_use_reasons',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they started using drugs' }],
    options: [
      { text: 'Recreation or pleasure', value: 'RECREATION_PLEASURE', kind: 'option' },
      { text: 'Curiosity or experimentation', value: 'CURIOSITY_OR_EXPERIMENTATION', kind: 'option' },
      { text: 'Manage stress or emotional issues', value: 'MANAGING_EMOTIONAL_ISSUES', kind: 'option' },
      { text: 'Self-medication for pain', value: 'SELF_MEDICATION', kind: 'option' },
      { text: 'Manage withdrawal symptoms', value: 'MANAGE_WITHDRAWAL', kind: 'option' },
      { text: 'Peer pressure or social influence', value: 'PEER_PRESSURE', kind: 'option' },
      { text: 'Enhance performance', value: 'ENHANCE_PERFORMANCE', kind: 'option' },
      { text: 'Escapism or avoidance', value: 'ESCAPISM_OR_AVOIDANCE', kind: 'option' },
      { text: 'Cultural or religious practices', value: 'CULTURAL_OR_RELIGIOUS', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_reason_details: {
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
  drug_use_impact: {
    text: "What's the impact of [subject] using drugs?",
    hint: { text: 'Select all that apply', kind: 'text' },
    code: 'drug_use_impact',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select the impact of them using drugs' }],
    options: [
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
      { text: 'Finances', value: 'FINANCES', hint: { text: 'Includes having no money.' }, kind: 'option' },
      {
        text: 'Community',
        value: 'COMMUNITY',
        hint: { text: 'Includes limited opportunities or judgement from others.' },
        kind: 'option',
      },
      {
        text: 'Behavioural',
        value: 'BEHAVIOURAL',
        hint: { text: 'Includes unemployment, disruption on education or lack of productivity.' },
        kind: 'option',
      },
      { text: 'Links to offending', value: 'LINKS_TO_REOFFENDING', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drug_use_impact_details: {
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
  reducing_or_stopping_drug_use: {
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
    labelClasses: mediumLabel,
  },
  reducing_or_stopping_drug_use_details: {
    text: 'Give details',
    code: 'reducing_or_stopping_drug_use_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Enter details' }],
    dependent: {
      field: 'reducing_or_stopping_drug_use',
      value: 'YES',
      displayInline: true,
    },
  },
  motivated_stopping_drug_use: {
    text: 'Is [subject] motivated to stop or reduce their drug use?',
    code: 'motivated_stopping_drug_use',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are motivated to stop or reduce their drug use' },
    ],
    options: [
      { text: 'Does not show motivation to stop or reduce', value: 'NO_MOTIVATION', kind: 'option' },
      { text: 'Shows some motivation to stop or reduce', value: 'SOME_MOTIVATION', kind: 'option' },
      { text: 'Motivated to stop or reduce', value: 'MOTIVATED', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  drugs_practitioner_analysis_patterns_of_behaviour: {
    text: 'Are there any patterns or behaviours related to this area?',
    hint: { text: 'Include repeated circumstances or behaviours.', kind: 'text' },
    code: 'drugs_practitioner_analysis_patterns_of_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  drugs_practitioner_analysis_patterns_of_behaviour_details: {
    text: 'Give details',
    code: 'drugs_practitioner_analysis_patterns_of_behaviour_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('drugs_practitioner_analysis_patterns_of_behaviour', 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  drugs_practitioner_analysis_strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: { text: 'Include any strategies, people or support networks that helped.', kind: 'text' },
    code: 'drugs_practitioner_analysis_strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  drugs_practitioner_analysis_strengths_or_protective_factors_details: {
    text: 'Give details',
    code: 'drugs_practitioner_analysis_strengths_or_protective_factors_details',
    type: FieldType.TextArea,
    validate: [
      {
        fn: requiredWhen('drugs_practitioner_analysis_strengths_or_protective_factors', 'YES'),
        message: 'Enter details',
      },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  drugs_practitioner_analysis_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'drugs_practitioner_analysis_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  drugs_practitioner_analysis_risk_of_serious_harm_details: {
    text: 'Give details',
    code: 'drugs_practitioner_analysis_risk_of_serious_harm_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('drugs_practitioner_analysis_risk_of_serious_harm', 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  drugs_practitioner_analysis_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffending?',
    code: 'drugs_practitioner_analysis_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  drugs_practitioner_analysis_risk_of_reoffending_details: {
    text: 'Give details',
    code: 'drugs_practitioner_analysis_risk_of_reoffending_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('drugs_practitioner_analysis_risk_of_reoffending', 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  drugs_practitioner_analysis_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'drugs_practitioner_analysis_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: inlineRadios,
  },
  drugs_practitioner_analysis_related_to_risk_details: {
    text: 'Give details',
    code: 'drugs_practitioner_analysis_related_to_risk_details',
    type: FieldType.TextArea,
    validate: [
      { fn: requiredWhen('drugs_practitioner_analysis_related_to_risk', 'YES'), message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
}

export default fields
