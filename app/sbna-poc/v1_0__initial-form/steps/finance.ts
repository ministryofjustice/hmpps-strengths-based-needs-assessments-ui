import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
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
    next: 'finance-summary',
    section: 'finance',
    sectionProgressRules: [
      setFieldWhenValid('finance_section_complete', 'YES', 'NO'),
      setField('finance_analysis_section_complete', 'NO'),
    ],
  },
  '/finance-summary': {
    pageTitle: 'Finance',
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'finance-analysis#practitioner-analysis',
    template: 'forms/sbna-poc/finance-summary-analysis',
    section: 'finance',
    sectionProgressRules: [setFieldWhenValid('finance_analysis_section_complete', 'YES', 'NO')],
  },
  '/finance-analysis': {
    pageTitle: 'Finance',
    fields: [],
    next: [],
    template: 'forms/sbna-poc/finance-analysis-complete',
    section: 'finance',
  },
}

export default stepOptions
