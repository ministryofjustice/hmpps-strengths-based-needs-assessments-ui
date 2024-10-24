import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, contains } from './common'
import personalRelationshipsFields from '../fields/personal-relationships-community'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.personalRelationships
const stepUrls = {
  personalRelationshipsChildrenInfo: 'personal-relationships-children-information',
  personalRelationships: 'personal-relationships',
  personalRelationshipsChildren: 'personal-relationships-children',
  personalRelationshipsCommunity: 'personal-relationships-community',
  summary: 'personal-relationships-community-summary',
  analysis: 'personal-relationships-community-analysis',
}

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
    { url: stepUrls.personalRelationshipsChildrenInfo,
      fields: [
        personalRelationshipsFields.personalRelationshipsCommunityChildrenInformation,
        personalRelationshipsFields.personalRelationshipsCommunityLivingWithChildrenDetails,
        personalRelationshipsFields.personalRelationshipsCommunityNotLivingWithChildrenDetails,
        personalRelationshipsFields.personalRelationshipsCommunityVisitingChildrenDetails,
      ].flat(),
      navigationOrder: 7,
      next: stepUrls.personalRelationships,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.personalRelationships,
      fields: [
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeople,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeoplePartnerDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleChildDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleOtherChildrenDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleFamilyDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleFriendsDetails,
        personalRelationshipsFields.personalRelationshipsCommunityImportantPeopleOtherDetails,
        personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationships),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: [
        {
          field: personalRelationshipsFields.personalRelationshipsCommunityImportantPeople.code,
          op: contains,
          value: 'CHILD_PARENTAL_RESPONSIBILITIES',
          next: stepUrls.personalRelationshipsChildren,
        },
        stepUrls.personalRelationshipsCommunity,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.personalRelationshipsChildren,
      fields: [
        currentRelationshipStatusFieldsGroup,
        intimateRelationshipFieldsGroup,
        personalRelationshipsFields.personalRelationshipsCommunityParentalResponsibilities,
        personalRelationshipsFields.personalRelationshipsCommunityGoodParentalResponsibilitiesDetails,
        personalRelationshipsFields.personalRelationshipsCommunityMixedParentalResponsibilitiesDetails,
        personalRelationshipsFields.personalRelationshipsCommunityBadParentalResponsibilitiesDetails,
        personalRelationshipsCommunityFieldsGroup,
        personalRelationshipsFields.wantToMakeChanges(),
        personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationshipsCommunity),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.personalRelationshipsCommunity,
      fields: [
        currentRelationshipStatusFieldsGroup,
        intimateRelationshipFieldsGroup,
        personalRelationshipsCommunityFieldsGroup,
        personalRelationshipsFields.wantToMakeChanges(),
        personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationshipsChildren),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.summary,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.summary,
      fields: [
        personalRelationshipsFields.practitionerAnalysis(),
        personalRelationshipsFields.isUserSubmitted(stepUrls.summary),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysis}#practitioner-analysis`,
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
