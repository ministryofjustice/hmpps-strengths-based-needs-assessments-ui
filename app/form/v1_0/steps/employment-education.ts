import { setFieldToCompleteWhenValid, nextWhen } from './common'
import employmentEducationFields from '../fields/employment-education'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.employmentEducation
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

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
      url: 'employment-education-tasks',
      template: templates.sectionTasks,
    },
    {
      initialStepInSection: true,
      url: sectionBackground.stepUrls.currentEmployment,
      fields: [
        employmentStatusGroup,
        employmentEducationFields.isUserSubmitted(sectionBackground.stepUrls.currentEmployment),
      ].flat(),
      next: [
        nextWhen(employmentEducationFields.employmentStatus, 'EMPLOYED', sectionBackground.stepUrls.employed),
        nextWhen(employmentEducationFields.employmentStatus, 'SELF_EMPLOYED', sectionBackground.stepUrls.employed),
        nextWhen(employmentEducationFields.employmentStatus, 'RETIRED', sectionBackground.stepUrls.retired),
        nextWhen(
          employmentEducationFields.employmentStatus,
          ['CURRENTLY_UNAVAILABLE_FOR_WORK', 'UNEMPLOYED_LOOKING_FOR_WORK', 'UNEMPLOYED_NOT_LOOKING_FOR_WORK'],
          [
            nextWhen(
              employmentEducationFields.hasBeenEmployedPrototype,
              'YES',
              sectionBackground.stepUrls.employedBefore,
            ),
            nextWhen(
              employmentEducationFields.hasBeenEmployedPrototype,
              'NO',
              sectionBackground.stepUrls.neverEmployed,
            ),
          ],
        ),
      ],
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.employed,
      fields: [
        employmentGroup,
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.experienceOfEmploymentGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(sectionBackground.stepUrls.employed),
        employmentEducationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.retired,
      fields: [
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(sectionBackground.stepUrls.retired),
        employmentEducationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.employedBefore,
      fields: [
        employmentHistoryGroup,
        educationGroup,
        employmentEducationFields.experienceOfEmploymentGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(sectionBackground.stepUrls.employedBefore),
        employmentEducationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.neverEmployed,
      fields: [
        educationGroup,
        employmentEducationFields.experienceOfEducationGroup,
        employmentEducationFields.wantToMakeChanges(),
        employmentEducationFields.isUserSubmitted(sectionBackground.stepUrls.neverEmployed),
        employmentEducationFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      template: templates.backgroundSummary,
      pageTitle: `${sectionBackground.title} summary`,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      fields: [
        employmentEducationFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        employmentEducationFields.practitionerAnalysis(),
        employmentEducationFields.practitionerAnalysisSectionComplete(),
        employmentEducationFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysis,
      initialStepInSection: true,
      sectionProgressRules: [
        setFieldToCompleteWhenValid(sectionPractitionerAnalysis.sectionCompleteField),
        setFieldToCompleteWhenValid(section.sectionCompleteField),
      ],
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysisSummary,
      template: templates.analysisSummary,
    },
  ],
}

export default sectionConfig
