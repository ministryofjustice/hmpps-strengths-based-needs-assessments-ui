import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import financeFields from '../fields/finance'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.finance
const stepUrls = {
  startFinance: 'start-finance',
  finance: 'finance',
  financePrison: 'finance-prison',
  summary: 'finance-summary',
  analysis: 'finance-analysis',
}

const baseFinanceGroup = [
  financeFields.financeIncome,
  financeFields.financeIncomeDetails,
  financeFields.familyOrFriendsDetails,
  financeFields.financeBankAccount,
  financeFields.financeMoneyManagement,
  financeFields.financeMoneyManagementDetailsGroup,
  financeFields.financeGambling,
  financeFields.financeGamblingDetailsGroup,
  financeFields.financeDebt,
  financeFields.yesTypeOfDebt,
  financeFields.yesTypeOfDebtDetailsGroup,
  financeFields.yesSomeoneElsesTypeOfDebt,
  financeFields.yesSomeoneElsesTypeOfDebtDetailsGroup,
  financeFields.unknownDebtDetails,
].flat()

const baseFinancePrisonGroup = [
  financeFields.financeIncome,
  financeFields.financeIncomeDetails,
  financeFields.familyOrFriendsDetails,
  financeFields.financeIncomeInCustody,
  financeFields.financeIncomeInCustodyDetails,
  financeFields.financeBankAccount,
  financeFields.financeMoneyManagement,
  financeFields.financeMoneyManagementDetailsGroup,
  financeFields.financeGambling,
  financeFields.financeGamblingDetailsGroup,
  financeFields.financeDebt,
  financeFields.yesTypeOfDebt,
  financeFields.yesTypeOfDebtDetailsGroup,
  financeFields.yesSomeoneElsesTypeOfDebt,
  financeFields.yesSomeoneElsesTypeOfDebtDetailsGroup,
  financeFields.unknownDebtDetails,
].flat()

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.startFinance,
      next: [
        nextWhen(financeFields.pathway, 'COMMUNITY', stepUrls.finance),
        nextWhen(financeFields.pathway, 'PRISON', stepUrls.financePrison),
        stepUrls.finance,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      navigationOrder: 3,
      skip: true,
    },
    {
      url: stepUrls.finance,
      fields: [
        baseFinanceGroup,
        financeFields.wantToMakeChanges(),
        financeFields.isUserSubmitted(stepUrls.finance),
        financeFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.financePrison,
      fields: [
        baseFinancePrisonGroup,
        financeFields.wantToMakeChanges(),
        financeFields.isUserSubmitted(stepUrls.financePrison),
        financeFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      fields: [
        financeFields.practitionerAnalysis(),
        financeFields.isUserSubmitted(stepUrls.summary),
        financeFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysis}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
