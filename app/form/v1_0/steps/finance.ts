import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import financeFields from '../fields/finance'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.finance

const groups = {
  background: 'Finance background',
  analysis: 'Practitioner Analysis',
}

const stepUrls = {
  finance: 'finance',
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

const sectionConfig: SectionConfig = {
  section,
  groups,
  steps: [
    {
      group: groups.background,
      url: stepUrls.finance,
      fields: [
        baseFinanceGroup,
        financeFields.wantToMakeChanges(),
        financeFields.isUserSubmitted(stepUrls.finance),
        financeFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      isSectionEntryPoint: true,
      isGroupEntryPoint: true,
    },
    {
      group: groups.background,
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
      group: groups.analysis,
      url: stepUrls.analysis,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
