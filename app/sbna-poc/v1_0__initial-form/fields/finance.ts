import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith as createPractitionerAnalysisFieldsWithPrefix,
  getMediumLabelClassFor,
  orDivider,
  toFormWizardFields,
  yesNoOptions,
} from './common'

const createDebtType = (fieldCode: string, dependentFieldCode: string, valueCode: string): FormWizard.Field => ({
  text: ' ',
  hint: { text: 'Select all that apply.', kind: 'text' },
  code: fieldCode,
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: 'Error message' }],
  options: [
    { text: 'Debt to others', value: 'DEBT_TO_OTHERS', kind: 'option' },
    { text: 'Formal debt', value: 'FORMAL_DEBT', kind: 'option' },
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
export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the finance section complete?',
  code: 'finance_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the finance analysis section complete?',
  code: 'finance_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export const baseFinanceFields: Array<FormWizard.Field> = [
  {
    text: 'Where does [subject] get their money from? ',
    code: 'finance_income',
    hint: { text: 'Select all that apply', kind: 'text' },
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: "Select where they currently get their money from, or select 'No money'",
      },
    ],
    options: [
      { text: "Carer's allowance", value: 'CARERS_ALLOWANCE', kind: 'option' },
      {
        text: 'Disability benefits',
        value: 'DISABILITY_BENEFITS',
        hint: {
          text: 'For example, Personal Independence Payment (PIP) (also known as Disability Living Allowance) or Severe Disablement Allowance.',
        },
        kind: 'option',
      },
      { text: 'Employment', value: 'EMPLOYMENT', kind: 'option' },
      { text: 'Family or Friends', value: 'FAMILY_OR_FRIENDS', kind: 'option' },
      { text: 'Offending', value: 'OFFENDING', kind: 'option' },
      { text: 'Pension', value: 'PENSION', kind: 'option' },
      { text: 'Student loan', value: 'STUDENT_LOAN', kind: 'option' },
      { text: 'Undeclared (includes cash in hand)', value: 'Undeclared', kind: 'option' },
      {
        text: 'Work related benefits',
        value: 'WORK_RELATED_BENEFITS',
        hint: { text: "For example, Universal Credit or Jobseeker's Allowance (JSA)." },
        kind: 'option',
      },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      orDivider,
      { text: 'No money', value: 'NO_MONEY', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Is [subject] over reliant on family or friends for money?',
    code: 'family_or_friends_details',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are over reliant on family or friends for money' },
    ],
    options: yesNoOptions,
    dependent: {
      field: 'finance_income',
      value: 'FAMILY_OR_FRIENDS',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'other_income_details',
    type: FieldType.TextArea,
    validate: [
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
  {
    text: 'Does [subject] have a personal bank account?',
    code: 'finance_bank_account',
    hint: { text: 'This does not include solely having a joint account.', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have a personal bank account' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'How good is [subject] at managing their money?',
    code: 'finance_money_management',
    hint: { text: 'This includes things like budgeting, prioritising bills and paying rent..', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select how good they are at managing their money' }],
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
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'good_money_management_details',
    type: FieldType.TextArea,
    validate: [
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
  {
    text: 'Give details (optional)',
    code: 'fairly_good_money_management_details',
    type: FieldType.TextArea,
    validate: [
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
  {
    text: 'Give details (optional)',
    code: 'fairly_bad_money_management_details',
    type: FieldType.TextArea,
    validate: [
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
  {
    text: 'Give details (optional)',
    code: 'bad_money_management_details',
    type: FieldType.TextArea,
    validate: [
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
  {
    text: 'Is [subject] affected by gambling?',
    code: 'finance_gambling',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select if they are affected by gambling' }],
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
      orDivider,
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
        behaviour: 'exclusive',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
        behaviour: 'exclusive',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
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
  {
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
  {
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
  {
    text: 'Is [subject] affected by debt?',
    code: 'finance_debt',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select if they are affected by debt' }],
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
      orDivider,
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
        behaviour: 'exclusive',
      },
      {
        text: 'Unknown',
        value: 'UNKNOWN',
        kind: 'option',
        behaviour: 'exclusive',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  createDebtType('yes_type_of_debt', 'finance_debt', 'YES_THEIR_DEBT'),
  createFormalDebtDetails('yes_formal_debt_details', 'yes_type_of_debt', 'FORMAL_DEBT'),
  createDebtToOthersDetails('yes_debt_to_others_details', 'yes_type_of_debt', 'DEBT_TO_OTHERS'),
  createDebtType('yes_someone_elses_type_of_debt', 'finance_debt', 'YES_SOMEONE_ELSES_DEBT'),
  createFormalDebtDetails('yes_someone_elses_formal_debt_details', 'yes_someone_elses_type_of_debt', 'FORMAL_DEBT'),
  createDebtToOthersDetails(
    'yes_someone_elses_debt_to_others_details',
    'yes_someone_elses_type_of_debt',
    'DEBT_TO_OTHERS',
  ),
  {
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
  {
    text: 'Does [subject] want to make changes to their finance?',
    hint: { text: 'This question must be directly answered by [subject].', kind: 'text' },
    code: 'changes_to_finance',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they want to make changes to their finance' }],
    options: [
      {
        text: 'I have already made positive changes and want to maintain them',
        value: 'MADE_CHANGES',
        kind: 'option',
      },
      {
        text: 'I am actively making changes',
        value: 'MAKING_CHANGES',
        kind: 'option',
      },
      {
        text: 'I want to make changes and know how to',
        value: 'WANT_TO_MAKE_CHANGES',
        kind: 'option',
      },
      {
        text: 'I want to make changes but need help',
        value: 'NEEDS_HELP_TO_MAKE_CHANGES',
        kind: 'option',
      },
      {
        text: 'I am thinking about making changes',
        value: 'THINKING_ABOUT_MAKING_CHANGES',
        kind: 'option',
      },
      {
        text: 'I do not want to make changes',
        value: 'DOES_NOT_WANT_TO_MAKE_CHANGES',
        kind: 'option',
      },
      {
        text: 'I do not want to answer',
        value: 'DOES_NOT_WANT_TO_ANSWER',
        kind: 'option',
      },
      orDivider,
      { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
      { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
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
      value: 'MADE_CHANGES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
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
      value: 'MAKING_CHANGES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
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
      value: 'WANT_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
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
      value: 'NEEDS_HELP_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
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
      value: 'THINKING_ABOUT_MAKING_CHANGES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
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
      value: 'DOES_NOT_WANT_TO_MAKE_CHANGES',
      displayInline: true,
    },
  },
]

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWithPrefix('finance')

export default [...baseFinanceFields, ...sectionCompleteFields, ...practitionerAnalysisFields].reduce(
  toFormWizardFields,
  {},
)
