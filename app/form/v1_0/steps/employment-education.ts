import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import employmentEducationFields from '../fields/employment-education'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.employmentEducation
const stepUrls = {
  currentEmployment: 'current-employment',
  employed: 'employed',
  retired: 'retired',
  employedBefore: 'employed-before',
  neverEmployed: 'never-employed',
  summary: 'employment-education-summary',
  analysis: 'employment-education-analysis',
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
      url: stepUrls.currentEmployment,
      fields: [
        employmentStatusGroup,
        employmentEducationFields.isUserSubmitted(stepUrls.currentEmployment),
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
            nextWhen(employmentEducationFields.hasBeenEmployedPrototype, 'YES', stepUrls.employedBefore),
            nextWhen(employmentEducationFields.hasBeenEmployedPrototype, 'NO', stepUrls.neverEmployed),
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
      next: stepUrls.summary,
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
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.employedBefore,
      fields: [
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.experienceOfEmploymentGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.employedBefore),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.neverEmployed,
      fields: [
        educationGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.neverEmployed),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      fields: [
        employmentEducationFields.practitionerAnalysis(),
        employmentEducationFields.isUserSubmitted(stepUrls.summary),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      template: templates.analysisComplete,
    },
  ],
}

export default sectionConfig
