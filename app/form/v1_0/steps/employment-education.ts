import { setFieldToIncomplete, setFieldToCompleteWhenValid } from './common'
import employmentEducationFields from '../fields/employment-education'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'
import { nextWhen } from './accommodation'

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

const employmentStatusGroup = [
  employmentEducationFields.employmentStatus,
  employmentEducationFields.employmentType,
  employmentEducationFields.hasBeenEmployedUnavailableForWork,
  employmentEducationFields.hasBeenEmployedActivelySeeking,
  employmentEducationFields.hasBeenEmployedNotActivelySeeking,
]

const employmentHistoryGroup = [
  employmentEducationFields.employmentHistory,
  employmentEducationFields.employmentHistoryDetailsGroup,
].flat()

const employmentGroup = [employmentEducationFields.employmentArea]

const educationGroup = [
  employmentEducationFields.employmentOtherResponsibilities,
  employmentEducationFields.employmentOtherResponsibilitiesGroup,
  employmentEducationFields.educationHighestLevelCompleted,
  employmentEducationFields.educationProfessionalOrVocationalQualifications,
  employmentEducationFields.educationProfessionalOrVocationalQualificationsDetails,
  employmentEducationFields.educationTransferableSkills,
  employmentEducationFields.educationTransferableSkillsDetailsGroup,
  employmentEducationFields.educationDifficulties,
  employmentEducationFields.educationDifficultiesReadingSeverity,
  employmentEducationFields.educationDifficultiesWritingSeverity,
  employmentEducationFields.educationDifficultiesNumeracySeverity,
].flat()

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.employmentEducation,
      fields: [
        employmentStatusGroup,
        employmentEducationFields.isUserSubmitted(stepUrls.employmentEducation),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(employmentEducationFields.employmentStatus, 'EMPLOYED', stepUrls.employed),
        nextWhen(employmentEducationFields.employmentStatus, 'SELF_EMPLOYED', stepUrls.employed),
        nextWhen(employmentEducationFields.employmentStatus, 'RETIRED', stepUrls.retired),
        nextWhen(
          employmentEducationFields.employmentStatus,
          ['CURRENTLY_UNAVAILABLE_FOR_WORK', 'UNEMPLOYED_LOOKING_FOR_WORK', 'UNEMPLOYED_NOT_LOOKING_FOR_WORK'],
          [
            nextWhen(employmentEducationFields.hasBeenEmployedPrototype, 'YES', stepUrls.hasBeenEmployed),
            nextWhen(employmentEducationFields.hasBeenEmployedPrototype, 'NO', stepUrls.neverBeenEmployed),
          ],
        ),
      ],
      navigationOrder: 2,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.employed,
      fields: [
        employmentGroup,
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.experienceOfEmploymentGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.employed),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.retired,
      fields: [
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.retired),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.hasBeenEmployed,
      fields: [
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.experienceOfEmploymentGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.hasBeenEmployed),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.neverBeenEmployed,
      fields: [
        educationGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.neverBeenEmployed),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      backLink: stepUrls.employmentEducation,
      next: stepUrls.analysis,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        employmentEducationFields.practitionerAnalysis(),
        employmentEducationFields.isUserSubmitted(stepUrls.analysis),
        employmentEducationFields.sectionComplete(),
      ].flat(),
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
