import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  thinkingBehavioursAttitudesFields,
  riskOfSexualHarmFields,
  thinkingBehaviourFields,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/thinking-behaviours-attitudes'

const defaultTitle = 'Thinking, behaviours and attitudes'
const sectionName = 'thinking-behaviours-attitudes'

const stepOptions: FormWizard.Steps = {
  '/thinking-behaviours-attitudes': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(thinkingBehavioursAttitudesFields, sectionCompleteFields),
    navigationOrder: 8,
    next: [
      {
        field: 'thinking_behaviours_attitudes_risk_sexual_harm',
        value: 'YES',
        next: 'thinking-behaviours-attitudes-sexual-offending',
      },
      { field: 'thinking_behaviours_attitudes_risk_sexual_harm', value: 'NO', next: 'thinking-behaviours' },
    ].flat(),
    section: sectionName,
    sectionProgressRules: [
      setField('thinking_behaviours_attitudes_section_complete', 'NO'),
      setField('thinking_behaviours_attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/thinking-behaviours-attitudes-sexual-offending': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(riskOfSexualHarmFields, sectionCompleteFields),
    next: 'thinking-behaviours',
    backLink: 'thinking-behaviours-attitudes',
    section: sectionName,
    sectionProgressRules: [
      setField('thinking_behaviours_attitudes_section_complete', 'NO'),
      setField('thinking_behaviours_attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/thinking-behaviours': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(thinkingBehaviourFields, makeChangesFields, sectionCompleteFields),
    next: 'thinking-behaviours-attitudes-summary-analysis',
    backLink: 'thinking-behaviours-attitudes',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('thinking_behaviours_attitudes_section_complete', 'YES', 'NO'),
      setField('thinking_behaviours_attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/thinking-behaviours-attitudes-summary-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'thinking-behaviours-attitudes-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/thinking-behaviours-attitudes-summary-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('thinking_behaviours_attitudes_analysis_section_complete', 'YES', 'NO')],
  },
  '/thinking-behaviours-attitudes-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/thinking-behaviours-attitudes-summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
