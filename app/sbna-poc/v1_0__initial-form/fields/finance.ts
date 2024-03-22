import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  createWantToMakeChangesFields,
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
    text: 'Where does [subject] currently get their money from? ',
    code: 'finance_income',
    hint: { text: 'Select all that apply.', kind: 'text' },
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
      { text: 'Family or friends', value: 'FAMILY_OR_FRIENDS', kind: 'option' },
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
    hint: { text: 'This includes things like budgeting, prioritising bills and paying rent.', kind: 'text' },
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select how good they are at managing their money' }],
    options: [
      {
        text: 'Able to manage their money well and is a strength',
        value: 'GOOD',
        kind: 'option',
      },
      {
        text: 'Able to manage their money for everyday necessities',
        value: 'FAIRLY_GOOD',
        kind: 'option',
      },
      {
        text: 'Unable to manage their money well',
        value: 'FAIRLY_BAD',
        kind: 'option',
      },
      {
        text: 'Unable to manage their money which is creating other problems',
        value: 'BAD',
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
    hint: { text: 'Select all that apply.', kind: 'text' },
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
  ...createWantToMakeChangesFields('their finance', 'finance'),
]

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith('finance')

export default [...baseFinanceFields, ...sectionCompleteFields, ...practitionerAnalysisFields].reduce(
  toFormWizardFields,
  {},
)
