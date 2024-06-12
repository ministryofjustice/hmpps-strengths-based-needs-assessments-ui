import FormWizard from 'hmpo-form-wizard'
import {
  drugUsageDetailsFields,
  drugUseTypeDetailsFields,
  drugUseChangesFields,
  drugUseFields,
  drugUseTypeFields,
  practitionerAnalysisFields,
  analysisSectionComplete,
  sectionCompleteFields,
} from '../fields/drugs'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'

const stepOptions: FormWizard.Steps = {
  '/drug-use': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUseFields, sectionCompleteFields),
    next: [
      { field: 'drug_use', value: 'YES', next: 'drug-use-details' },
      { field: 'drug_use', value: 'NO', next: 'drug-use-analysis' },
    ],
    navigationOrder: 4,
    section: 'drug-use',
    sectionProgressRules: [
      {
        fieldCode: 'drug_use_section_complete',
        conditionFn: (isValid: boolean, answers: Record<string, string | string[]>) =>
          isValid && answers.drug_use === 'NO',
      },
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-details': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUsageDetailsFields, sectionCompleteFields),
    next: 'drug-use-type',
    backLink: 'drug-use',
    section: 'drug-use',
    sectionProgressRules: [
      setFieldToIncomplete('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-type': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUseTypeFields, sectionCompleteFields),
    next: 'drug-usage-details',
    backLink: 'drug-use-details',
    section: 'drug-use',
    sectionProgressRules: [
      setFieldToIncomplete('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-usage-details': {
    pageTitle: 'Usage details',
    fields: fieldCodesFrom(drugUseTypeDetailsFields, sectionCompleteFields),
    next: 'drug-use-changes',
    template: 'forms/summary/drug-usage',
    backLink: 'drug-use-type',
    section: 'drug-use',
    sectionProgressRules: [
      setFieldToIncomplete('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-changes': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUseChangesFields, sectionCompleteFields),
    next: 'drug-use-analysis',
    backLink: 'drug-usage-details',
    section: 'drug-use',
    sectionProgressRules: [
      setFieldToCompleteWhenValid('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-analysis': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'drug-use-analysis-complete#practitioner-analysis',
    template: 'forms/summary/drugs-summary-analysis',
    section: 'drug-use',
    sectionProgressRules: [setFieldToCompleteWhenValid('drug_use_analysis_section_complete')],
  },
  '/drug-use-analysis-complete': {
    pageTitle: 'Drug use',
    fields: [],
    template: 'forms/summary/drugs-summary-analysis-complete',
    section: 'drug-use',
  },
}

export default stepOptions
