import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import financeFields from '../fields/finance'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.finance
const stepUrls = {
  finance: 'finance',
  summary: 'finance-summary',
  analysis: 'finance-analysis',
}

const baseFinanceGroup = [
  financeFields.financeIncome,
  financeFields.familyOrFriendsDetails,
  financeFields.otherIncomeDetails,
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
      url: stepUrls.finance,
      fields: [
        baseFinanceGroup,
        financeFields.wantToMakeChanges(),
        financeFields.isUserSubmitted(stepUrls.finance),
        financeFields.sectionComplete(),
      ].flat(),
      navigationOrder: 3,
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
      isLastStep: true,
    },
  ],
}

export default sectionConfig
