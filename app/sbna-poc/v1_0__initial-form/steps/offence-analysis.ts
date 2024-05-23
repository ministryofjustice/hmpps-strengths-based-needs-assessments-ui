import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import {
  analysisSectionComplete,
  offenceAnalysisFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/offence-analysis'

const defaultTitle = 'Offence analysis'
const sectionName = 'offence-analysis'

const stepOptions: FormWizard.Steps = {
  '/offence-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(offenceAnalysisFields, sectionCompleteFields),
    navigationOrder: 9,
    next: [],
    section: sectionName,
    sectionProgressRules: [
      setFieldToIncomplete(''),
      setFieldToIncomplete(''),
    ],
  },
  '/offence-analysis-summary-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    template: '',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('')],
  },
  '/offence-analysis-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/offence-analysis-analysis-section-complete',
    section: sectionName,
  },
}

export default stepOptions
