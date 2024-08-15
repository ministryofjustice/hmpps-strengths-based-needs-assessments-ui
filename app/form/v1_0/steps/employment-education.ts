import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import employmentEducationFields from '../fields/employment-education'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.employmentEducation
const stepUrls = {
  employmentEducation: 'employment-education',
  employed: 'employed',
  retired: 'retired',
  hasBeenEmployed: 'has-been-employed',
  neverBeenEmployed: 'never-been-employed',
  analysis: 'employment-education-analysis',
  analysisComplete: 'employment-education-analysis-complete',
}

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.employmentEducation,
      fields: [
        ...employmentEducationFields.employmentStatus,
        ...employmentEducationFields.isUserSubmitted(stepUrls.employmentEducation),
        ...employmentEducationFields.sectionComplete(),
      ],
      next: [
        { field: 'employment_status', value: 'EMPLOYED', next: stepUrls.employed },
        { field: 'employment_status', value: 'SELF_EMPLOYED', next: stepUrls.employed },
        { field: 'employment_status', value: 'RETIRED', next: stepUrls.retired },
        {
          field: 'employment_status',
          op: 'in',
          value: ['CURRENTLY_UNAVAILABLE_FOR_WORK', 'UNEMPLOYED_LOOKING_FOR_WORK', 'UNEMPLOYED_NOT_LOOKING_FOR_WORK'],
          next: [
            { field: 'has_been_employed', value: 'YES', next: stepUrls.hasBeenEmployed },
            { field: 'has_been_employed', value: 'NO', next: stepUrls.neverBeenEmployed },
          ],
        },
      ],
      navigationOrder: 2,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.employed,
      fields: [
        ...employmentEducationFields.employment,
        ...employmentEducationFields.employmentHistory,
        ...employmentEducationFields.education,
        ...employmentEducationFields.experienceOfEmployment,
        ...employmentEducationFields.experienceOfEducation,
        ...employmentEducationFields.wantToMakeChanges(),
        ...employmentEducationFields.isUserSubmitted(stepUrls.employed),
        ...employmentEducationFields.sectionComplete(),
      ],
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.retired,
      fields: [
        ...employmentEducationFields.employmentHistory,
        ...employmentEducationFields.education,
        ...employmentEducationFields.wantToMakeChanges(),
        ...employmentEducationFields.isUserSubmitted(stepUrls.retired),
        ...employmentEducationFields.sectionComplete(),
      ],
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.hasBeenEmployed,
      fields: [
        ...employmentEducationFields.employmentHistory,
        ...employmentEducationFields.education,
        ...employmentEducationFields.experienceOfEmployment,
        ...employmentEducationFields.experienceOfEducation,
        ...employmentEducationFields.wantToMakeChanges(),
        ...employmentEducationFields.isUserSubmitted(stepUrls.hasBeenEmployed),
        ...employmentEducationFields.sectionComplete(),
      ],
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.neverBeenEmployed,
      fields: [
        ...employmentEducationFields.education,
        ...employmentEducationFields.experienceOfEducation,
        ...employmentEducationFields.wantToMakeChanges(),
        ...employmentEducationFields.isUserSubmitted(stepUrls.neverBeenEmployed),
        ...employmentEducationFields.sectionComplete(),
      ],
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...employmentEducationFields.practitionerAnalysis(),
        ...employmentEducationFields.isUserSubmitted(stepUrls.analysis),
        ...employmentEducationFields.sectionComplete(),
      ],
      next: stepUrls.analysisComplete,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
