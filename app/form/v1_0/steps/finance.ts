import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import { baseFinanceFields, practitionerAnalysisFields, sectionCompleteFields } from '../fields/finance'

const defaultTitle = 'Finance'
const sectionName = 'finance'

const stepOptions: FormWizard.Steps = {
  '/finance': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(baseFinanceFields, sectionCompleteFields),
    navigationOrder: 3,
    next: 'finance-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldToIncomplete('finance_section_complete')],
  },
  '/finance-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, sectionCompleteFields),
    next: 'finance-analysis-complete#practitioner-analysis',
    template: 'forms/summary/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('finance_section_complete')],
  },
  '/finance-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/summary/summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
