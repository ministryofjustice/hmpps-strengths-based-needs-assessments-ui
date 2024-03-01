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
const sectionName = 'employment-education'

const stepOptions: FormWizard.Steps = {
  '/employment-education': {
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
          { field: 'has_been_employed', value: 'YES', next: 'has-been-employed' },
          { field: 'has_been_employed', value: 'NO', next: 'never-been-employed' },
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
    next: ['employment-education-analysis'],
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
    next: ['employment-education-analysis'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/has-been-employed': {
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
    next: ['employment-education-analysis'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/never-been-employed': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(educationFields, experienceOfEducation, makeChangesFields, sectionCompleteFields),
    backLink: sectionName,
    next: ['employment-education-analysis'],
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('employment_education_section_complete', 'YES', 'NO'),
      setField('employment_education_analysis_section_complete', 'NO'),
    ],
  },
  '/employment-education-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: ['employment-education-analysis-complete'],
    template: 'forms/sbna-poc/employment-education-summary-analysis',
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('employment_education_analysis_section_complete', 'YES', 'NO')],
  },
  '/employment-education-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/employment-education-summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
