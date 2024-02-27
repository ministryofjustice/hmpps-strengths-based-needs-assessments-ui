import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid, whenField } from './common'
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

const coreQuestionSet = [baseHealthAndWellbeingQuestions, makeChangesFields, sectionCompleteFields]

const stepOptions: FormWizard.Steps = {
  '/health-wellbeing': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(physicalOrMentalHealthProblemsFields, sectionCompleteFields),
    navigationOrder: 6,
    next: [
      {
        field: 'health_wellbeing_physical_health_condition',
        value: 'YES',
        next: [
          whenField('health_wellbeing_mental_health_condition')
            .includes(['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'])
            .thenGoNext('physical-and-mental-health-condition'),
          whenField('health_wellbeing_mental_health_condition')
            .includes(['NO', 'UNKNOWN'])
            .thenGoNext('physical-health-condition'),
        ].flat(),
      },
      whenField('health_wellbeing_physical_health_condition')
        .includes(['NO', 'UNKNOWN'])
        .thenGoNext(
          [
            whenField('health_wellbeing_mental_health_condition')
              .includes(['YES_ONGOING_SEVERE', 'YES_ONGOING', 'YES_IN_THE_PAST'])
              .thenGoNext('mental-health-condition'),

            whenField('health_wellbeing_mental_health_condition')
              .includes(['NO', 'UNKNOWN'])
              .thenGoNext('no-physical-or-mental-health-condition'),
          ].flat(),
        ),
    ].flat(),
    section: sectionName,
    sectionProgressRules: [
      setField('health_wellbeing_section_complete', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/physical-and-mental-health-condition': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(physicalHealthConditionsFields, mentalHealthConditionsFields, ...coreQuestionSet),
    next: 'health-wellbeing-analysis',
    backLink: 'health-wellbeing',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('health_wellbeing_section_complete', 'YES', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/physical-health-condition': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(physicalHealthConditionsFields, ...coreQuestionSet),
    next: 'health-wellbeing-analysis',
    backLink: 'health-wellbeing',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('health_wellbeing_section_complete', 'YES', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/mental-health-condition': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(mentalHealthConditionsFields, ...coreQuestionSet),
    next: 'health-wellbeing-analysis',
    backLink: 'health-wellbeing',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('health_wellbeing_section_complete', 'YES', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/no-physical-or-mental-health-condition': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(...coreQuestionSet),
    next: 'health-wellbeing-analysis',
    backLink: 'health-wellbeing',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('health_wellbeing_section_complete', 'YES', 'NO'),
      setField('health_wellbeing_analysis_section_complete', 'NO'),
    ],
  },
  '/health-wellbeing-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'health-wellbeing-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/health-wellbeing-summary-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('health_wellbeing_analysis_section_complete', 'YES', 'NO')],
  },
  '/health-wellbeing-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/health-wellbeing-summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
