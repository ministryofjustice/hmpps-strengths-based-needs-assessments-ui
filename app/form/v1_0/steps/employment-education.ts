import { setFieldToIncomplete, setFieldToCompleteWhenValid, nextWhen } from './common'
import employmentEducationFields from '../fields/employment-education'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.employmentEducation
const stepUrls = {
  startEmploymentEducation: 'start-employment-education',
  currentEmployment: 'current-employment',
  currentEmploymentPrison: 'current-employment-prison',
  employed: 'employed',
  employedPrison: 'employed-prison',
  retired: 'retired',
  retiredPrison: 'retired-prison',
  employedBefore: 'employed-before',
  employedBeforePrison: 'employed-before-prison',
  neverEmployed: 'never-employed',
  neverEmployedPrison: 'never-employed-prison',
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

const employmentStatusPrisonGroup = [
  employmentEducationFields.employmentStatusPrison,
  employmentEducationFields.employmentTypePrison,
  employmentEducationFields.hasBeenEmployedUnavailableForWorkPrison,
  employmentEducationFields.hasBeenEmployedActivelySeekingPrison,
  employmentEducationFields.hasBeenEmployedNotActivelySeekingPrison,
]

const employmentHistoryGroup = [
  employmentEducationFields.employmentHistory,
  employmentEducationFields.employmentHistoryDetailsGroup,
].flat()

const employmentGroup = [employmentEducationFields.employmentArea]

const employmentPrisonGroup = [employmentEducationFields.employmentAreaPrison]

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

const educationPrisonGroup = [
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
      url: stepUrls.startEmploymentEducation,
      next: [
        nextWhen(employmentEducationFields.pathway, 'COMMUNITY', stepUrls.currentEmployment),
        nextWhen(employmentEducationFields.pathway, 'PRISON', stepUrls.currentEmploymentPrison),
        stepUrls.currentEmployment,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
      navigationOrder: 2,
      skip: true,
    },
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
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.currentEmploymentPrison,
      fields: [
        employmentStatusPrisonGroup,
        employmentEducationFields.isUserSubmitted(stepUrls.currentEmploymentPrison),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      next: [
        nextWhen(employmentEducationFields.employmentStatusPrison, 'EMPLOYED', stepUrls.employedPrison),
        nextWhen(employmentEducationFields.employmentStatusPrison, 'SELF_EMPLOYED', stepUrls.employedPrison),
        nextWhen(employmentEducationFields.employmentStatusPrison, 'RETIRED', stepUrls.retiredPrison),
        nextWhen(
          employmentEducationFields.employmentStatusPrison,
          ['UNAVAILABLE_FOR_WORK', 'UNEMPLOYED_LOOKING_FOR_WORK', 'UNEMPLOYED_NOT_LOOKING_FOR_WORK'],
          [
            nextWhen(employmentEducationFields.hasBeenEmployedPrototype, 'YES', stepUrls.employedBeforePrison),
            nextWhen(employmentEducationFields.hasBeenEmployedPrototype, 'NO', stepUrls.neverEmployedPrison),
          ],
        ),
      ],
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
      url: stepUrls.employedPrison,
      fields: [
        employmentPrisonGroup,
        employmentHistoryGroup,
        educationPrisonGroup,
        employmentEducationFields.experienceOfEmploymentGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(stepUrls.employedPrison),
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
      url: stepUrls.retiredPrison,
      fields: [
        employmentHistoryGroup,
        educationPrisonGroup,
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
      url: stepUrls.employedBeforePrison,
      fields: [
        employmentHistoryGroup,
        educationPrisonGroup,
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
      url: stepUrls.neverEmployedPrison,
      fields: [
        educationPrisonGroup,
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
