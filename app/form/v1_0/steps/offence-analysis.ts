import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToCompleteWhenValid } from './common'
import { offenceAnalysisFields, sectionCompleteFields } from '../fields/offence-analysis'

const defaultTitle = 'Offence analysis'
const sectionName = 'offence-analysis'

const stepOptions: FormWizard.Steps = {
  '/offence-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(offenceAnalysisFields, sectionCompleteFields),
    navigationOrder: 9,
    next: 'offence-analysis-complete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('offence_analysis_section_complete')],
  },
  '/offence-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/summary/summary-analysis-complete',
    section: sectionName,
    locals: { hideAnalysis: true },
  },
}

export default stepOptions
