import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import {
  analysisSectionComplete,
  baseFinanceFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/finance'

const defaultTitle = 'Finance'
const sectionName = 'finance'

const stepOptions: FormWizard.Steps = {
  '/finance': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(baseFinanceFields, sectionCompleteFields),
    navigationOrder: 3,
    next: 'finance-analysis',
    section: sectionName,
    sectionProgressRules: [
      setFieldToCompleteWhenValid('finance_section_complete'),
      setFieldToIncomplete('finance_analysis_section_complete'),
    ],
  },
  '/finance-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'finance-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('finance_analysis_section_complete')],
  },
  '/finance-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
