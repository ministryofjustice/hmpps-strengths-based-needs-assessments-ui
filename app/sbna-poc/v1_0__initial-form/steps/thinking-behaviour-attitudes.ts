import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  thinkingBehavioursAttitudesFields,
  riskOfSexualHarmFields,
  thinkingBehaviourFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/thinking-behaviours-attitudes'

const defaultTitle = 'Thinking behaviours and attitudes'
const sectionName = 'thinking-behaviours-attitudes'

const whenField = (field: string) => ({
  includes: (values: string[]) => ({
    thenGoNext: (next: FormWizard.Step.NextStep | FormWizard.Step.NextStep[]) =>
      values.map(it => ({ field, value: it, next }) as FormWizard.Step.NextStep),
  }),
})

const stepOptions: FormWizard.Steps = {
  '/thinking-behaviours-attitudes': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(thinkingBehavioursAttitudesFields, sectionCompleteFields),
    navigationOrder: 7,
    next: [
      {
        field: 'thinking_behaviours_attitudes_risk_sexual_harm',
        value: 'YES',
        next: [
          whenField('thinking_behaviours_attitudes_risk_sexual_harm')
            .includes(['YES'])
            .thenGoNext('thinking-behaviours-attitudes-sexual-offending'),
          whenField('thinking_behaviours_attitudes_risk_sexual_harm')
            .includes(['NO'])
            .thenGoNext('thinking-behaviours'),
        ].flat(),
      },
    ].flat(),
    section: sectionName,
    sectionProgressRules: [
      setField('thinking-behaviours-attitudes_section_complete', 'NO'),
      setField('thinking-behaviours-attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/thinking-behaviours-attitudes-sexual-offending': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(riskOfSexualHarmFields, sectionCompleteFields),
    next: '/thinking-behaviours',
    backLink: 'thinking-behaviours-attitudes',
    section: sectionName,
    sectionProgressRules: [
      setField('thinking-behaviours-attitudes_section_complete', 'NO'),
      setField('thinking-behaviours-attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/thinking-behaviours': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(thinkingBehaviourFields, sectionCompleteFields),
    next: '/thinking-behaviours-attitudes-continued',
    backLink: 'thinking-behaviours-attitudes',
    section: sectionName,
    sectionProgressRules: [
      setField('thinking-behaviours-attitudes_section_complete', 'NO'),
      setField('thinking-behaviours-attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/thinking-behaviours-attitudes-summary-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: '',
    template: '',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('', 'YES', 'NO')],
  },
  '/thinking-behaviours-attitudes-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: '',
    section: sectionName,
  },
}

export default stepOptions
