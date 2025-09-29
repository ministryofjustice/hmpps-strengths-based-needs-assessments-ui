import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import financeFields from '../fields/finance'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import employmentEducationFields from '../fields/employment-education'

const section = sections.finance
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

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
  steps: [
    {
      url: 'finance-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.finance,
      initialStepInSection: true,
      fields: [
        baseFinanceGroup,
        financeFields.wantToMakeChanges(),
        financeFields.isUserSubmitted(sectionBackground.stepUrls.finance),
        financeFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      template: templates.backgroundSummary,
      pageTitle: `${sectionBackground.title} summary`,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      initialStepInSection: true,
      template: templates.analysis,
      fields: [
        financeFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        financeFields.practitionerAnalysis(),
        financeFields.practitionerAnalysisSectionComplete(),
        financeFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField),
        setFieldToCompleteWhenValid(section.sectionCompleteField),
      ],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
