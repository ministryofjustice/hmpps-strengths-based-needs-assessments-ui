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

const defaultTitle = 'Drug use'
const sectionName = 'drug-use'

const stepOptions: FormWizard.Steps = {
  '/drug-use': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(drugUseFields, sectionCompleteFields),
    next: [
      { field: 'drug_use', value: 'YES', next: 'drug-use-details' },
      { field: 'drug_use', value: 'NO', next: 'drug-use-analysis' },
    ],
    navigationOrder: 4,
    section: sectionName,
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
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(drugUsageDetailsFields, sectionCompleteFields),
    next: 'drug-use-type',
    backLink: 'drug-use',
    section: sectionName,
    sectionProgressRules: [
      setFieldToIncomplete('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-type': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(drugUseTypeFields, sectionCompleteFields),
    next: 'drug-usage-details',
    backLink: 'drug-use-details',
    section: sectionName,
    sectionProgressRules: [
      setFieldToIncomplete('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-usage-details': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(drugUseTypeDetailsFields, sectionCompleteFields),
    next: 'drug-use-changes',
    template: 'forms/summary/drug-usage',
    backLink: 'drug-use-type',
    section: sectionName,
    sectionProgressRules: [
      setFieldToIncomplete('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-changes': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(drugUseChangesFields, sectionCompleteFields),
    next: 'drug-use-analysis',
    backLink: 'drug-usage-details',
    section: sectionName,
    sectionProgressRules: [
      setFieldToCompleteWhenValid('drug_use_section_complete'),
      setFieldToIncomplete('drug_use_analysis_section_complete'),
    ],
  },
  '/drug-use-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'drug-use-analysis-complete#practitioner-analysis',
    template: 'forms/summary/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('drug_use_analysis_section_complete')],
  },
  '/drug-use-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    template: 'forms/summary/summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
