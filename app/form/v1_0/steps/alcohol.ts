import FormWizard from 'hmpo-form-wizard'
import {
  alcoholUsageWithinThreeMonthsFields,
  alcoholUseFields,
  baseAlcoholUsageFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/alcohol'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'

const defaultTitle = 'Alcohol use'
const sectionName = 'alcohol-use'

const stepOptions: FormWizard.Steps = {
  '/alcohol-use': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(alcoholUseFields, sectionCompleteFields),
    next: [
      { field: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS', next: 'alcohol-usage-last-three-months' },
      { field: 'alcohol_use', value: 'YES_NOT_IN_LAST_THREE_MONTHS', next: 'alcohol-usage-but-not-last-three-months' },
      { field: 'alcohol_use', value: 'NO', next: 'alcohol-use-analysis' },
    ],
    navigationOrder: 5,
    section: sectionName,
    sectionProgressRules: [setFieldToIncomplete('alcohol_use_section_complete')],
  },
  '/alcohol-usage-last-three-months': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(alcoholUsageWithinThreeMonthsFields, baseAlcoholUsageFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['alcohol-use-analysis'],
    section: sectionName,
    sectionProgressRules: [setFieldToIncomplete('alcohol_use_section_complete')],
  },
  '/alcohol-usage-but-not-last-three-months': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(baseAlcoholUsageFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['alcohol-use-analysis'],
    section: sectionName,
    sectionProgressRules: [setFieldToIncomplete('alcohol_use_section_complete')],
  },
  '/alcohol-use-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, sectionCompleteFields),
    next: ['alcohol-use-analysis-complete#practitioner-analysis'],
    template: 'forms/summary/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('alcohol_use_section_complete')],
  },
  '/alcohol-use-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/summary/summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
