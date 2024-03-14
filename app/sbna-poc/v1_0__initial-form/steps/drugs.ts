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
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'

const stepOptions: FormWizard.Steps = {
  '/drugs': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUseFields, sectionCompleteFields),
    next: [
      { field: 'drug_use', value: 'YES', next: 'drug-use' },
      { field: 'drug_use', value: 'NO', next: 'drug-use-summary' },
    ],
    navigationOrder: 4,
    section: 'drugs',
    sectionProgressRules: [
      {
        fieldCode: 'drug_use_section_complete',
        conditionFn: (isValid: boolean, answers: Record<string, string | string[]>) =>
          isValid && answers.drug_use === 'NO' ? 'YES' : 'NO',
      },
      setField('drug_use_analysis_section_complete', 'NO'),
    ],
  },
  '/drug-use': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUsageDetailsFields, sectionCompleteFields),
    next: 'select-drugs',
    backLink: 'drugs',
    section: 'drugs',
    sectionProgressRules: [
      setField('drug_use_section_complete', 'NO'),
      setField('drug_use_analysis_section_complete', 'NO'),
    ],
  },
  '/select-drugs': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUseTypeFields, sectionCompleteFields),
    next: 'drug-usage-details',
    backLink: 'drug-use',
    section: 'drugs',
    sectionProgressRules: [
      setField('drug_use_section_complete', 'NO'),
      setField('drug_use_analysis_section_complete', 'NO'),
    ],
  },
  '/drug-usage-details': {
    pageTitle: 'Usage details',
    fields: fieldCodesFrom(drugUseTypeDetailsFields, sectionCompleteFields),
    next: 'drug-use-changes',
    template: 'forms/sbna-poc/drug-usage',
    backLink: 'select-drugs',
    section: 'drugs',
    sectionProgressRules: [
      setField('drug_use_section_complete', 'NO'),
      setField('drug_use_analysis_section_complete', 'NO'),
    ],
  },
  '/drug-use-changes': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(drugUseChangesFields, sectionCompleteFields),
    next: 'drug-use-summary',
    backLink: 'drug-usage-details',
    section: 'drugs',
    sectionProgressRules: [
      setFieldWhenValid('drug_use_section_complete', 'YES', 'NO'),
      setField('drug_use_analysis_section_complete', 'NO'),
    ],
  },
  '/drug-use-summary': {
    pageTitle: 'Drug use',
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'drug-use-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/drugs-summary-analysis',
    section: 'drugs',
    sectionProgressRules: [setFieldWhenValid('drug_use_analysis_section_complete', 'YES', 'NO')],
  },
  '/drug-use-analysis-complete': {
    pageTitle: 'Drug use',
    fields: [],
    template: 'forms/sbna-poc/drugs-summary-analysis-complete',
    section: 'drugs',
  },
}

export default stepOptions
