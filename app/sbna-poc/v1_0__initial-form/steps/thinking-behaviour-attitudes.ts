import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  makeChangesFields,
  thinkingBehavioursAttitudesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/thinking-behaviours-attitudes'

const defaultTitle = 'Thinking behaviours and attitudes'
const sectionName = 'thinking-behaviours-attitudes'

const coreQuestionSet = [makeChangesFields, sectionCompleteFields]

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
            .thenGoNext('thinking_behaviours_attitudes_sexual_preoccupation'),
          whenField('health_wellbeing_mental_health_condition').includes(['NO']).thenGoNext(''),
        ].flat(),
      },
    ].flat(),
    section: sectionName,
    sectionProgressRules: [
      setField('thinking-behaviours-attitudes_section_complete', 'NO'),
      setField('thinking-behaviours-attitudes_analysis_section_complete', 'NO'),
    ],
  },
}

export default stepOptions
