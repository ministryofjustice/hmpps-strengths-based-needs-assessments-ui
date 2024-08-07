import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import {
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
    sectionProgressRules: [setFieldToIncomplete('thinking_behaviours_attitudes_section_complete')],
  },
  '/thinking-behaviours-attitudes-sexual-offending': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(riskOfSexualHarmFields, sectionCompleteFields),
    next: 'thinking-behaviours',
    backLink: 'thinking-behaviours-attitudes',
    section: sectionName,
    sectionProgressRules: [setFieldToIncomplete('thinking_behaviours_attitudes_section_complete')],
  },
  '/thinking-behaviours': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(thinkingBehaviourFields, makeChangesFields, sectionCompleteFields),
    next: 'thinking-behaviours-attitudes-analysis',
    backLink: 'thinking-behaviours-attitudes',
    section: sectionName,
    sectionProgressRules: [setFieldToIncomplete('thinking_behaviours_attitudes_section_complete')],
  },
  '/thinking-behaviours-attitudes-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, sectionCompleteFields),
    next: 'thinking-behaviours-attitudes-analysis-complete#practitioner-analysis',
    template: 'forms/summary/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('thinking_behaviours_attitudes_section_complete')],
  },
  '/thinking-behaviours-attitudes-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/summary/summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
