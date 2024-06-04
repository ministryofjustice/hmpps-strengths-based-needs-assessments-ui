import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import {
  analysisSectionComplete,
  offenceAnalysisFields,
  sectionCompleteFields,
} from '../fields/offence-analysis'

const defaultTitle = 'Offence analysis'
const sectionName = 'offence-analysis'

const stepOptions: FormWizard.Steps = {
  '/offence-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(offenceAnalysisFields, sectionCompleteFields),
    navigationOrder: 9,
    next: 'offence-analysis-summary',
    section: sectionName,
    sectionProgressRules: [
      setFieldToCompleteWhenValid('offence_analysis_section_complete'),
      setFieldToIncomplete('offence_analysis_analysis_section_complete'),
    ],
  },
  '/offence-analysis-summary': {
  pageTitle: defaultTitle,
  fields: fieldCodesFrom([analysisSectionComplete]),
  next: [],
  template: 'forms/sbna-poc/summary-analysis-incomplete',
  section: sectionName,
  sectionProgressRules: [setFieldToCompleteWhenValid('offence_analysis_analysis_section_complete')],
},
  // '/offence-analysis-summary-complete': {
  //   pageTitle: defaultTitle,
  //   fields: [],
  //   next: [],
  //   template: 'forms/sbna-poc/offence-analysis-complete',
  //   section: sectionName,
  // },
}

export default stepOptions
