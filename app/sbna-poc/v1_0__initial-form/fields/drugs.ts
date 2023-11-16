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

const usageFrequencies = [
  { text: 'Daily', value: 'DAILY' },
  { text: 'Weekly', value: 'WEEKLY' },
  { text: 'Monthly', value: 'MONTHLY' },
  { text: 'Occasionally', value: 'OCCASIONALLY' },
]

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
  ...usageFrequencies.map(({ text, value }): FormWizard.Field.Option => ({ text, value, kind: 'option' })),
  orDivider,
  { text: 'Not currently using this drug', value: 'NO_CURRENT_USAGE', kind: 'option' },
]

const fieldCodeWith = (...parts: string[]) => parts.map(it => it.toLowerCase()).join('_')

const createFieldForDrugUsage = (option: string) => ({
  [fieldCodeWith('drug_usage', option)]: {
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
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: option },
  },
})

const createFieldForInjectingDrug = (option: string, frequency: string) => ({
  [fieldCodeWith(frequency, 'injecting_drug', option)]: {
    text: 'Is [subject] injecting this drug?',
    code: fieldCodeWith('injecting_drug', option),
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
    labelClasses: mediumLabel,
    classes: smallRadios,
  },
})

const createFieldForPastDrugUsage = (option: string) => ({
  [fieldCodeWith('past_drug_usage', option)]: {
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
    labelClasses: mediumLabel,
    dependent: { field: 'drug_use_type', value: option },
  },
})

const createFieldForPastInjectingDrug = (option: string) => ({
  [fieldCodeWith('past_injecting_drug', option)]: {
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
    labelClasses: mediumLabel,
    classes: smallRadios,
  },
})

const createFieldForReceivingTreatment = (option: string, frequency: string) => ({
  [fieldCodeWith(frequency, 'drug_usage_treatment', option)]: {
    text: 'Is [subject] receiving treatment?',
    code: fieldCodeWith('drug_usage_treatment', option),
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
    labelClasses: mediumLabel,
    classes: smallRadios,
  },
})

const createFieldForPastReceivingTreatment = (option: string) => ({
  [fieldCodeWith('past_drug_usage_treatment', option)]: {
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
    labelClasses: mediumLabel,
    classes: smallRadios,
  },
})

const flattenFields = (acc: FormWizard.Fields, it: FormWizard.Fields) => ({ ...acc, ...it })

const createFieldsForHeroin = () =>
  [
    createFieldsForInjectableDrug('HEROIN'),
    createFieldForPastReceivingTreatment('HEROIN'),
    ...usageFrequencies.map(frequency => createFieldForReceivingTreatment('HEROIN', frequency.value)),
  ].reduce(flattenFields, {})

const createFieldsForInjectableDrug = (option: string) =>
  [
    createDrugUsage(option),
    createFieldForPastInjectingDrug(option),
    ...usageFrequencies.map(frequency => createFieldForInjectingDrug(option, frequency.value)),
  ].reduce(flattenFields, {})

const createDrugUsage = (option: string) =>
  [createFieldForDrugUsage(option), createFieldForPastDrugUsage(option)].reduce(flattenFields, {})

export const drugUsageDetailsFields = [
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
].reduce(flattenFields, {})

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
    labelClasses: mediumLabel,
  },
  ...drugUsageDetailsFields,
  other_drug_details: {
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
