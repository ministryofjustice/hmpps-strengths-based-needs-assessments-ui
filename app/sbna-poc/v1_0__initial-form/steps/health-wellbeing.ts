import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  baseHealthAndWellbeingQuestions,
  makeChangesFields,
  mentalHealthConditionsFields,
  physicalHealthConditionsFields,
  physicalOrMentalHealthProblemsFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/health-wellbeing'

const defaultTitle = 'Health and wellbeing'
const sectionName = 'health-wellbeing'

// const nextWhenOneOf = (values: string[], next: string) =>
//   values.map(it => ({ field: 'mental_health_condition', value: it, next }))

const stepOptions: FormWizard.Steps = {
  '/health-wellbeing': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(physicalOrMentalHealthProblemsFields, sectionCompleteFields),
    navigationOrder: 6,
    next: 'health-wellbeing-2',
    // next: [
    //   {
    //     field: 'physical_health_condition', value: 'YES', next: [
    //       ...nextWhenOneOf(['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'], ''),
    //       { field: 'mental_health_condition', value: 'NO', next: '' },
    //     ]
    //   },
    //   {
    //     field: 'physical_health_condition', value: 'NO', next: [
    //       ...nextWhenOneOf(['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'], ''),
    //       { field: 'mental_health_condition', value: 'NO', next: '' },
    //     ]
    //   },
    // ],
    section: sectionName,
    sectionProgressRules: [
      setField('health_wellbeing_section_complete', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/health-wellbeing-2': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(
      physicalHealthConditionsFields,
      mentalHealthConditionsFields,
      baseHealthAndWellbeingQuestions,
      makeChangesFields,
      sectionCompleteFields,
    ),
    next: 'health-wellbeing-summary-analysis',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('health_wellbeing_section_complete', 'YES', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/health-wellbeing-summary-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'health-wellbeing-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/health_wellbeing-summary-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('health_wellbeing_analysis_section_complete', 'YES', 'NO')],
  },
  '/health-wellbeing-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/health-wellbeing-complete',
    section: sectionName,
  },
}

export default stepOptions
