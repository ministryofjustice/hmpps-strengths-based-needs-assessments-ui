import FormWizard from 'hmpo-form-wizard'
import { setFieldToCompleteWhenValid, contains } from './common'
import personalRelationshipsFields from '../fields/personal-relationships-community'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.personalRelationships
const sectionBackground = section.subsections.background
const sectionPractitionerAnalysis = section.subsections.practitionerAnalysis

const personalRelationshipsCommunityFieldsGroup: Array<FormWizard.Field> = [
  personalRelationshipsFields.personalRelationshipsCommunityFamilyRelationship,
  personalRelationshipsFields.personalRelationshipsCommunityStableFamilyDetails,
  personalRelationshipsFields.personalRelationshipsCommunityMixedFamilyDetails,
  personalRelationshipsFields.personalRelationshipsCommunityUnstableFamilyDetails,
  personalRelationshipsFields.personalRelationshipsCommunityChildhood,
  personalRelationshipsFields.personalRelationshipsCommunityPositiveChildhoodDetails,
  personalRelationshipsFields.personalRelationshipsCommunityMixedChildhoodDetails,
  personalRelationshipsFields.personalRelationshipsCommunityNegativeChildhoodDetails,
  personalRelationshipsFields.personalRelationshipsCommunityChildhoodBehaviour,
  personalRelationshipsFields.personalRelationshipsCommunityYesChildhoodBehaviourProblemsDetails,
  personalRelationshipsFields.personalRelationshipsCommunityNoChildhoodBehaviourProblemsDetails,
  personalRelationshipsFields.personalRelationshipsCommunityBelonging,
]

const currentRelationshipStatusFieldsGroup: Array<FormWizard.Field> = [
  personalRelationshipsFields.personalRelationshipsCommunityCurrentRelationship,
  personalRelationshipsFields.personalRelationshipsCommunityHappyRelationshipDetails,
  personalRelationshipsFields.personalRelationshipsCommunityConcernedRelationshipDetails,
  personalRelationshipsFields.personalRelationshipsCommunityUnhappyRelationshipDetails,
]

const intimateRelationshipFieldsGroup: Array<FormWizard.Field> = [
  personalRelationshipsFields.personalRelationshipsCommunityIntimateRelationship,
  personalRelationshipsFields.personalRelationshipsCommunityStableIntimateRelationship,
  personalRelationshipsFields.personalRelationshipsCommunityMixedIntimateRelationshipDetails,
  personalRelationshipsFields.personalRelationshipsCommunityUnstableIntimateRelationshipDetails,
  personalRelationshipsFields.personalRelationshipsCommunityChallengesIntimateRelationship,
]

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: 'personal-relationships-community-tasks',
      template: templates.sectionTasks,
    },
    {
      url: sectionBackground.stepUrls.personalRelationshipsChildrenInfo,
      initialStepInSection: true,
      fields: [
        personalRelationshipsFields.personalRelationshipsCommunityChildrenInformation,
        personalRelationshipsFields.personalRelationshipsCommunityLivingWithChildrenDetails,
        personalRelationshipsFields.personalRelationshipsCommunityNotLivingWithChildrenDetails,
        personalRelationshipsFields.personalRelationshipsCommunityVisitingChildrenDetails,
        personalRelationshipsFields.isUserSubmitted(sectionBackground.stepUrls.personalRelationshipsChildrenInfo),
        personalRelationshipsFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.personalRelationships,
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.personalRelationships,
      fields: [
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeople,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeoplePartnerDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleChildDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleOtherChildrenDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleFamilyDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleFriendsDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleOtherDetails,
        personalRelationshipsFields.isUserSubmitted(sectionBackground.stepUrls.personalRelationships),
        personalRelationshipsFields.backgroundSectionComplete(),
      ].flat(),
      next: [
        {
          field: personalRelationshipsFields.personalRelationshipsCommunityImportantPeople.code,
          op: contains,
          value: 'CHILD_PARENTAL_RESPONSIBILITIES',
          next: sectionBackground.stepUrls.personalRelationshipsChildren,
        },
        sectionBackground.stepUrls.personalRelationshipsCommunity,
      ],
      sectionProgressRules: [],
    },
    {
      url: sectionBackground.stepUrls.personalRelationshipsChildren,
      fields: [
        currentRelationshipStatusFieldsGroup,
        intimateRelationshipFieldsGroup,
        personalRelationshipsFields.personalRelationshipsCommunityParentalResponsibilities,
        personalRelationshipsFields.personalRelationshipsCommunityGoodParentalResponsibilitiesDetails,
        personalRelationshipsFields.personalRelationshipsCommunityMixedParentalResponsibilitiesDetails,
        personalRelationshipsFields.personalRelationshipsCommunityBadParentalResponsibilitiesDetails,
        personalRelationshipsCommunityFieldsGroup,
        personalRelationshipsFields.wantToMakeChanges(),
        personalRelationshipsFields.isUserSubmitted(sectionBackground.stepUrls.personalRelationshipsCommunity),
        personalRelationshipsFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.personalRelationshipsCommunity,
      fields: [
        currentRelationshipStatusFieldsGroup,
        intimateRelationshipFieldsGroup,
        personalRelationshipsCommunityFieldsGroup,
        personalRelationshipsFields.wantToMakeChanges(),
        personalRelationshipsFields.isUserSubmitted(sectionBackground.stepUrls.personalRelationshipsChildren),
        personalRelationshipsFields.backgroundSectionComplete(),
      ].flat(),
      next: sectionBackground.stepUrls.backgroundSummary,
      sectionProgressRules: [setFieldToCompleteWhenValid(sectionBackground.sectionCompleteField)],
    },
    {
      url: sectionBackground.stepUrls.backgroundSummary,
      template: templates.backgroundSummary,
    },
    {
      url: sectionPractitionerAnalysis.stepUrls.analysis,
      initialStepInSection: true,
      template: templates.analysis,
      fields: [
        personalRelationshipsFields.isUserSubmitted(sectionPractitionerAnalysis.stepUrls.analysis),
        personalRelationshipsFields.practitionerAnalysis(),
        personalRelationshipsFields.practitionerAnalysisSectionComplete(),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: sectionPractitionerAnalysis.stepUrls.analysisSummary,
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
