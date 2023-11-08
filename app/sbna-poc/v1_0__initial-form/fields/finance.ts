import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import { characterLimit, mediumLabel, orDivider, summaryCharacterLimit, yesNoOptions } from './common'

const createDebtType = (fieldCode: string, dependentFieldCode: string, valueCode: string): FormWizard.Field => ({
  text: 'Select type of debt',
  code: fieldCode,
  type: FieldType.Radio,
  validate: [{ type: ValidationType.Required, message: 'Error message' }],
  options: [
    { text: 'Formal debt', value: 'FORMAL_DEBT', kind: 'option' },
    { text: 'Debt to others', value: 'DEBT_TO_OTHERS', kind: 'option' },
    { text: 'Formal debt and debt to others', value: 'FORMAL_AND_DEBT_TO_OTHERS', kind: 'option' },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createFormalDebtDetails = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
): FormWizard.Field => ({
  text: 'Give details (optional)',
  hint: { text: 'Includes things like credit cards, phone bills or rent arrears.', kind: 'text' },
  code: fieldCode,
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.MaxLength,
      arguments: [characterLimit],
      message: `Details must be ${characterLimit} characters or less`,
    },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createDebtToOthersDetails = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
): FormWizard.Field => ({
  text: 'Give details (optional)',
  hint: { text: 'Includes things like owing money to family, friends, other prisoners or loan sharks.', kind: 'text' },
  code: fieldCode,
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.MaxLength,
      arguments: [characterLimit],
      message: `Details must be ${characterLimit} characters or less`,
    },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const createFormalAndDebtOthersDetails = (
  fieldCode: string,
  dependentFieldCode: string,
  valueCode: string,
): FormWizard.Field => ({
  text: 'Give details (optional)',
  hint: { text: 'Includes things like rent arrears and owing others money.', kind: 'text' },
  code: fieldCode,
  type: FieldType.TextArea,
  validate: [
    {
      type: ValidationType.MaxLength,
      arguments: [characterLimit],
      message: `Details must be ${characterLimit} characters or less`,
    },
  ],
  dependent: {
    field: dependentFieldCode,
    value: valueCode,
    displayInline: true,
  },
})

const fields: FormWizard.Fields = {
  finance_section_complete: {
    text: 'Is the finance section complete?',
    code: 'finance_section_complete',
    type: FieldType.Radio,
    options: yesNoOptions,
  },
  finance_analysis_section_complete: {
    text: 'Is the finance analysis section complete?',
    code: 'finance_analysis_section_complete',
    type: FieldType.Radio,
    options: yesNoOptions,
  },
  finance_income: {
    text: 'Where does [subject] get their money from? ',
    code: 'finance_income',
    hint: { text: 'Select all that apply', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'error message' }],
    options: [
      { text: 'Employment', value: 'EMPLOYMENT', kind: 'option' },
      { text: 'Student loan', value: 'STUDENT_LOAN', kind: 'option' },
      { text: 'Pension', value: 'PENSION', kind: 'option' },
      {
        text: 'Work related benefits',
        value: 'WORK_RELATED_BENEFITS',
        hint: { text: "For example, Universal Credit or Jobseeker's Allowance (JSA)." },
        kind: 'option',
      },
      {
        text: 'Disability benefits',
        value: 'DISABILITY_BENEFITS',
        hint: {
          text: 'For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.',
        },
        kind: 'option',
      },
      { text: "Carer's allowance", value: 'CARERS_ALLOWANCE', kind: 'option' },
      { text: 'Family or Friends', value: 'FAMILY_OR_FRIENDS', kind: 'option' },
      { text: 'Undeclared (includes cash in hand)', value: 'Undeclared', kind: 'option' },
      { text: 'Offending', value: 'OFFENDING', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      orDivider,
      { text: 'No money', value: 'NO_MONEY', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  family_or_friends_details: {
    text: 'Is [subject] over reliant on family or friends for money?',
    code: 'family_or_friends_details',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: yesNoOptions,
    dependent: {
      field: 'finance_income',
      value: 'FAMILY_OR_FRIENDS',
      displayInline: true,
    },
  },
  other_income_details: {
    text: 'Give details',
    code: 'other_income_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_income',
      value: 'OTHER',
      displayInline: true,
    },
  },
  finance_bank_account: {
    text: 'Does [subject] have a personal bank account?',
    code: 'finance_bank_account',
    hint: { text: 'This does not include solely having a joint account.', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_money_management: {
    text: 'How good is [subject] at managing their money?',
    code: 'finance_money_management',
    hint: { text: 'This includes things like budgeting, prioritising bills and paying rent..', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'Good',
        value: 'GOOD',
        hint: { text: 'Able to manage their money well and is a strength.' },
        kind: 'option',
      },
      {
        text: 'Fairly good',
        value: 'FAIRLY_GOOD',
        hint: { text: 'Able to manage their money for everyday necessities.' },
        kind: 'option',
      },
      {
        text: 'Fairly bad',
        value: 'FAIRLY_BAD',
        hint: { text: 'Unable to manage their money well.' },
        kind: 'option',
      },
      {
        text: 'Bad',
        value: 'BAD',
        hint: { text: 'Unable to manage their money which is creating other problems.' },
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  good_money_management_details: {
    text: 'Give details',
    code: 'good_money_management_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_money_management',
      value: 'GOOD',
      displayInline: true,
    },
  },
  fairly_good_money_management_details: {
    text: 'Give details',
    code: 'fairly_good_money_management_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_money_management',
      value: 'FAIRLY_GOOD',
      displayInline: true,
    },
  },
  fairly_bad_money_management_details: {
    text: 'Give details',
    code: 'fairly_bad_money_management_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_money_management',
      value: 'FAIRLY_BAD',
      displayInline: true,
    },
  },
  bad_money_management_details: {
    text: 'Give details',
    code: 'bad_money_management_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_money_management',
      value: 'BAD',
      displayInline: true,
    },
  },
  finance_gambling: {
    text: 'Is [subject] affected by gambling?',
    code: 'finance_gambling',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'Yes, their own gambling',
        value: 'YES_THEIR_GAMBLING',
        kind: 'option',
      },
      {
        text: "Yes, someone else's gambling",
        value: 'YES_SOMEONE_ELSES_GAMBLING',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  yes_their_gambling_details: {
    text: 'Give details (optional)',
    code: 'yes_their_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'YES_THEIR_GAMBLING',
      displayInline: true,
    },
  },
  yes_someone_elses_gambling_details: {
    text: 'Give details (optional)',
    code: 'yes_someone_elses_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'YES_SOMEONE_ELSES_GAMBLING',
      displayInline: true,
    },
  },
  no_gambling_details: {
    text: 'Give details (optional)',
    code: 'no_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'NO',
      displayInline: true,
    },
  },
  unknown_gambling_details: {
    text: 'Give details (optional)',
    code: 'unknown_gambling_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_gambling',
      value: 'UNKNOWN',
      displayInline: true,
    },
  },
  finance_debt: {
    text: 'Is [subject] affected by debt?',
    code: 'finance_debt',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'Yes, their own debt',
        value: 'YES_THEIR_DEBT',
        kind: 'option',
      },
      {
        text: "Yes, someone else's debt",
        value: 'YES_SOMEONE_ELSES_DEBT',
        kind: 'option',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: mediumLabel,
  },
  yes_type_of_debt: createDebtType('yes_type_of_debt', 'finance_debt', 'YES_THEIR_DEBT'),
  yes_formal_debt_details: createFormalDebtDetails('yes_formal_debt_details', 'yes_type_of_debt', 'FORMAL_DEBT'),
  yes_debt_to_others_details: createDebtToOthersDetails(
    'yes_debt_to_others_details',
    'yes_type_of_debt',
    'DEBT_TO_OTHERS',
  ),
  yes_formal_debt_to_others_details: createFormalAndDebtOthersDetails(
    'yes_formal_debt_to_others_details',
    'yes_type_of_debt',
    'FORMAL_AND_DEBT_TO_OTHERS',
  ),
  yes_someone_elses_type_of_debt: createDebtType(
    'yes_someone_elses_type_of_debt',
    'finance_debt',
    'YES_SOMEONE_ELSES_DEBT',
  ),
  yes_someone_elses_formal_debt_details: createFormalDebtDetails(
    'yes_someone_elses_formal_debt_details',
    'yes_someone_elses_type_of_debt',
    'FORMAL_DEBT',
  ),
  yes_someone_elses_debt_to_others_details: createDebtToOthersDetails(
    'yes_someone_elses_debt_to_others_details',
    'yes_someone_elses_type_of_debt',
    'DEBT_TO_OTHERS',
  ),
  yes_someone_elses_formal_debt_to_others_details: createFormalAndDebtOthersDetails(
    'yes_someone_elses_formal_debt_to_others_details',
    'yes_someone_elses_type_of_debt',
    'FORMAL_AND_DEBT_TO_OTHERS',
  ),
  unknown_debt_details: {
    text: 'Give details (optional)',
    code: 'unknown_debt_details',
    hint: { text: "Consider if they might have debt due to a partner or family member's finances.", kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'finance_debt',
      value: 'UNKNOWN',
      displayInline: true,
    },
  },
  changes_to_finance: {
    text: 'Does [subject] want to make changes to their finance?',
    hint: { text: 'This question must be directly answered by [subject].', kind: 'text' },
    code: 'changes_to_finance',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Error message' }],
    options: [
      {
        text: 'I have already made positive changes and want to maintain them',
        value: 'POSITIVE_CHANGES',
        kind: 'option',
      },
      {
        text: 'I am actively making changes',
        value: 'ACTIVE_CHANGE',
        kind: 'option',
      },
      {
        text: 'I want to make changes and know how to',
        value: 'KNOWN_CHANGES',
        kind: 'option',
      },
      {
        text: 'I want to make changes but need help',
        value: 'MAKE_CHANGES_HELP',
        kind: 'option',
      },
      {
        text: 'I am thinking about making changes',
        value: 'THINKING_CHANGES',
        kind: 'option',
      },
      {
        text: 'I do not want to make changes',
        value: 'NO_CHANGES',
        kind: 'option',
      },
      {
        text: 'I do not want to answer',
        value: 'NO_ANSWER',
        kind: 'option',
      },
      orDivider,
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: mediumLabel,
  },
  finance_positive_change_details: {
    text: 'Give details',
    code: 'finance_positive_change_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'changes_to_finance',
      value: 'POSITIVE_CHANGES',
      displayInline: true,
    },
  },
  finance_active_change_details: {
    text: 'Give details',
    code: 'finance_active_change_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'changes_to_finance',
      value: 'ACTIVE_CHANGE',
      displayInline: true,
    },
  },
  finance_known_change_details: {
    text: 'Give details',
    code: 'finance_known_change_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'changes_to_finance',
      value: 'KNOWN_CHANGES',
      displayInline: true,
    },
  },
  finance_help_change_details: {
    text: 'Give details',
    code: 'finance_help_change_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'changes_to_finance',
      value: 'MAKE_CHANGES_HELP',
      displayInline: true,
    },
  },
  finance_thinking_change_details: {
    text: 'Give details',
    code: 'finance_thinking_change_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'changes_to_finance',
      value: 'THINKING_CHANGES',
      displayInline: true,
    },
  },
  finance_no_change_details: {
    text: 'Give details',
    code: 'finance_no_change_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'changes_to_finance',
      value: 'NO_CHANGES',
      displayInline: true,
    },
  },
  finance_practitioner_analysis_patterns_of_behaviour: {
    text: 'Are there any patterns of behaviours related to this area?',
    hint: {
      text: 'Include repeated circumstances or behaviours.',
      kind: 'text',
    },
    code: 'finance_practitioner_analysis_patterns_of_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any patterns of behaviours' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: 'govuk-radios--inline',
  },
  finance_practitioner_analysis_patterns_of_behaviour_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_patterns_of_behaviour_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_strengths_or_protective_factors: {
    text: 'Are there any strengths or protective factors related to this area?',
    hint: {
      text: 'Include any strategies, people or support networks that helped.',
      kind: 'text',
    },
    code: 'finance_practitioner_analysis_strengths_or_protective_factors',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: 'govuk-radios--inline',
  },
  finance_practitioner_analysis_strengths_or_protective_factors_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_strengths_or_protective_factors_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_risk_of_serious_harm: {
    text: 'Is this an area linked to risk of serious harm?',
    code: 'finance_practitioner_analysis_risk_of_serious_harm',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of serious harm' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: 'govuk-radios--inline',
  },
  finance_practitioner_analysis_risk_of_serious_harm_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_risk_of_serious_harm_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_risk_of_reoffending: {
    text: 'Is this an area linked to risk of reoffending?',
    code: 'finance_practitioner_analysis_risk_of_reoffending',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if linked to risk of reoffending' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: 'govuk-radios--inline',
  },
  finance_practitioner_analysis_risk_of_reoffending_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_risk_of_reoffending_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [summaryCharacterLimit],
        message: `Details must be ${summaryCharacterLimit} characters or less`,
      },
    ],
    characterCountMax: summaryCharacterLimit,
  },
  finance_practitioner_analysis_related_to_risk: {
    text: 'Is this an area of need which is not related to risk?',
    code: 'finance_practitioner_analysis_related_to_risk',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if an area of need which is not related to risk' }],
    options: yesNoOptions,
    labelClasses: mediumLabel,
    classes: 'govuk-radios--inline',
  },
  finance_practitioner_analysis_related_to_risk_details: {
    text: 'Give details',
    code: 'finance_practitioner_analysis_related_to_risk_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
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
