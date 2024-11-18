import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn } from './common/utils'

const createDebtType = (fieldCode: string, dependentField: FormWizard.Field, option: string): FormWizard.Field => ({
  text: ' ',
  hint: { text: 'Select all that apply.', kind: 'text' },
  code: fieldCode,
  type: FieldType.CheckBox,
  multiple: true,
  validate: [{ type: ValidationType.Required, message: 'Select type of debt' }],
  options: [
    { text: 'Debt to others', value: 'DEBT_TO_OTHERS', kind: 'option' },
    { text: 'Formal debt', value: 'FORMAL_DEBT', kind: 'option' },
  ],
  dependent: dependentOn(dependentField, option),
})

const typeOfDebtDetailsOptions = [
  ['FORMAL_DEBT', 'Includes things like credit cards, phone bills or rent arrears.'],
  ['DEBT_TO_OTHERS', 'Includes things like owing money to family, friends, other prisoners or loan sharks.'],
]

class FinanceFieldsFactory extends FieldsFactory {
  financeIncome: FormWizard.Field = {
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
      utils.orDivider,
      { text: 'No money', value: 'NO_MONEY', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  financeIncomeDetails: FormWizard.Field[] = this.financeIncome.options
    .filter(it => it.kind === 'option' && ['NO_MONEY', 'OTHER'].includes(it.value))
    .map(FieldsFactory.detailsFieldWith({ parentField: this.financeIncome }))

  familyOrFriendsDetails: FormWizard.Field = {
    text: 'Is [subject] over reliant on family or friends for money?',
    code: 'family_or_friends_details',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are over reliant on family or friends for money' },
    ],
    options: [
      {
        text: 'Yes',
        summary: { displayFn: () => 'Yes, over reliant on friends and family for money' },
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'No',
        summary: { displayFn: () => 'No, not over reliant on friends and family for money' },
        value: 'NO',
        kind: 'option',
      },
    ],
    dependent: dependentOn(this.financeIncome, 'FAMILY_OR_FRIENDS'),
  }

  financeBankAccount: FormWizard.Field = {
    text: 'Does [subject] have their own bank account?',
    code: 'finance_bank_account',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they have their own personal bank account' }],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  financeMoneyManagement: FormWizard.Field = {
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  financeMoneyManagementDetailsGroup: FormWizard.Field[] = ['GOOD', 'FAIRLY_GOOD', 'FAIRLY_BAD', 'BAD'].map(option =>
    FieldsFactory.detailsField({
      parentField: this.financeMoneyManagement,
      dependentValue: option,
    }),
  )

  financeGambling: FormWizard.Field = {
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
      utils.orDivider,
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  financeGamblingDetailsGroup: FormWizard.Field[] = ['YES_THEIR_GAMBLING', 'YES_SOMEONE_ELSES_GAMBLING', 'UNKNOWN'].map(
    option =>
      FieldsFactory.detailsField({
        parentField: this.financeGambling,
        dependentValue: option,
      }),
  )

  financeDebt: FormWizard.Field = {
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
      utils.orDivider,
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
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  yesTypeOfDebt: FormWizard.Field = createDebtType('yes_type_of_debt', this.financeDebt, 'YES_THEIR_DEBT')

  yesTypeOfDebtDetailsGroup: FormWizard.Field[] = typeOfDebtDetailsOptions.map(([option, hint]) =>
    FieldsFactory.detailsField({
      parentField: this.yesTypeOfDebt,
      dependentValue: option,
      textHint: hint,
    }),
  )

  yesSomeoneElsesTypeOfDebt: FormWizard.Field = createDebtType(
    'yes_someone_elses_type_of_debt',
    this.financeDebt,
    'YES_SOMEONE_ELSES_DEBT',
  )

  yesSomeoneElsesTypeOfDebtDetailsGroup: FormWizard.Field[] = typeOfDebtDetailsOptions.map(([option, hint]) =>
    FieldsFactory.detailsField({
      parentField: this.yesSomeoneElsesTypeOfDebt,
      dependentValue: option,
      textHint: hint,
    }),
  )

  unknownDebtDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.financeDebt,
    dependentValue: 'UNKNOWN',
  })
}

export default new FinanceFieldsFactory(sections.finance)
