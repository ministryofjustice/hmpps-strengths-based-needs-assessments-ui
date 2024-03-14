import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  educationFields,
  employmentFields,
  employmentHistory,
  employmentStatusFields,
  experienceOfEducation,
  experienceOfEmployment,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/employment-education'

const defaultTitle = 'Employment and education'
const sectionName = 'current-employment'

const stepOptions: FormWizard.Steps = {
  '/current-employment': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(employmentStatusFields, sectionCompleteFields),
    next: [
      { field: 'employment_status', value: 'EMPLOYED', next: 'employed' },
      { field: 'employment_status', value: 'SELF_EMPLOYED', next: 'employed' },
      { field: 'employment_status', value: 'RETIRED', next: 'retired' },
      {
        field: 'employment_status',
        op: 'in',
        value: ['CURRENTLY_UNAVAILABLE_FOR_WORK', 'UNEMPLOYED_LOOKING_FOR_WORK', 'UNEMPLOYED_NOT_LOOKING_FOR_WORK'],
        next: [
          { field: 'has_been_employed', value: 'YES', next: 'employed-before' },
          { field: 'has_been_employed', value: 'NO', next: 'never-employed' },
        ],
      },
    ],
    navigationOrder: 2,
    section: sectionName,
    sectionProgressRules: [
      setField('employment_education_section_complete', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/employed': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(
      employmentFields,
      employmentHistory,
      educationFields,
      experienceOfEmployment,
      experienceOfEducation,
      makeChangesFields,
      sectionCompleteFields,
    ),
    backLink: sectionName,
    next: ['employment-summary'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/retired': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(employmentHistory, educationFields, makeChangesFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['employment-summary'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/employed-before': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(
      employmentHistory,
      educationFields,
      experienceOfEmployment,
      experienceOfEducation,
      makeChangesFields,
      sectionCompleteFields,
    ),
    backLink: sectionName,
    next: ['employment-summary'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/never-employed': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(educationFields, experienceOfEducation, makeChangesFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['employment-summary'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/employment-summary': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: ['employment-analysis'],
    template: 'forms/sbna-poc/employment-education-summary-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('employment_education_analysis_section_complete', 'YES', 'NO')],
  },
  '/employment-analysis': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/employment-education-summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
