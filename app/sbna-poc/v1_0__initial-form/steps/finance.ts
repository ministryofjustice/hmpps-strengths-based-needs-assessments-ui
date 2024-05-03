import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import {
  analysisSectionComplete,
  baseFinanceFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/finance'

const stepOptions: FormWizard.Steps = {
  '/finance': {
    pageTitle: 'Finance',
    fields: fieldCodesFrom(baseFinanceFields, sectionCompleteFields),
    navigationOrder: 3,
    next: 'finance-summary-analysis',
    section: 'finance',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('finance_section_complete'),
      setFieldToIncomplete('finance_analysis_section_complete'),
    ],
  },
  '/finance-summary-analysis': {
    pageTitle: 'Finance',
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'finance-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/finance-summary-analysis',
    section: 'finance',
    sectionProgressRules: [setFieldToCompleteWhenValid('finance_analysis_section_complete')],
  },
  '/finance-analysis-complete': {
    pageTitle: 'Finance',
    fields: [],
    next: [],
    template: 'forms/sbna-poc/finance-analysis-complete',
    section: 'finance',
  },
}

export default stepOptions
