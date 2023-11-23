import FormWizard from 'hmpo-form-wizard'
import {
  alcoholUsageWithinThreeMonthsFields,
  alcoholUseFields,
  analysisSectionComplete,
  baseAlcoholUsageFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/alcohol'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'

const defaultTitle = 'Alcohol use'
const sectionName = 'alcohol-use'

const stepOptions: FormWizard.Steps = {
  '/alcohol-use': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(alcoholUseFields, sectionCompleteFields),
    next: [
      { field: 'alcohol_use', value: 'YES_WITHIN_LAST_THREE_MONTHS', next: 'alcohol-usage-last-three-months' },
      { field: 'alcohol_use', value: 'YES_NOT_IN_LAST_THREE_MONTHS', next: 'alcohol-usage-but-not-last-three-months' },
      { field: 'alcohol_use', value: 'NO', next: 'alcohol-analysis' },
    ],
    navigationOrder: 5,
    section: sectionName,
    sectionProgressRules: [
      {
        fieldCode: 'alcohol_use_section_complete',
        conditionFn: (isValid: boolean, answers: Record<string, string | string[]>) =>
          isValid && answers.alcohol_use === 'NO' ? 'YES' : 'NO',
      },
      setField('alcohol_use_analysis_section_complete', 'NO'),
    ],
  },
  '/alcohol-usage-last-three-months': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(alcoholUsageWithinThreeMonthsFields, baseAlcoholUsageFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['alcohol-analysis'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('alcohol_use_section_complete', 'YES', 'NO'),
      setField('alcohol_use_analysis_section_complete', 'NO'),
    ],
  },
  '/alcohol-usage-but-not-last-three-months': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(baseAlcoholUsageFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['alcohol-analysis'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('alcohol_use_section_complete', 'YES', 'NO'),
      setField('alcohol_use_analysis_section_complete', 'NO'),
    ],
  },
  '/alcohol-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: ['alcohol-analysis-complete'],
    template: 'forms/sbna-poc/alcohol-summary-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('alcohol_use_analysis_section_complete', 'YES', 'NO')],
  },
  '/alcohol-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/alcohol-summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
