import FormWizard from 'hmpo-form-wizard'
import { setFieldToIncomplete, setFieldToCompleteWhenValid, contains } from './common'
import personalRelationshipsFields from '../fields/personal-relationships-community'
import sections, { SectionConfig } from '../config/sections'
import templates from '../config/templates'

const section = sections.personalRelationships
const stepUrls = {
  personalRelationships: 'personal-relationships',
  personalRelationshipsCommunity: 'personal-relationships-community',
  personalRelationshipsCommunity2: 'personal-relationships-community-2',
  analysis: 'personal-relationships-community-analysis',
  analysisComplete: 'personal-relationships-community-analysis-complete',
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
      navigationOrder: 7,
      next: [
        {
          field: personalRelationshipsFields.personalRelationshipsCommunityImportantPeople.code,
          op: contains,
          value: 'CHILD_PARENTAL_RESPONSIBILITIES',
          next: stepUrls.personalRelationshipsCommunity,
        },
        stepUrls.personalRelationshipsCommunity2,
      ],
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.personalRelationshipsCommunity,
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
      next: stepUrls.analysis,
      backLink: stepUrls.personalRelationships,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.personalRelationshipsCommunity2,
      fields: [
        currentRelationshipStatusFieldsGroup,
        intimateRelationshipFieldsGroup,
        personalRelationshipsCommunityFieldsGroup,
        personalRelationshipsFields.wantToMakeChanges(),
        personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationshipsCommunity2),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: stepUrls.analysis,
      backLink: stepUrls.personalRelationships,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        personalRelationshipsFields.practitionerAnalysis(),
        personalRelationshipsFields.isUserSubmitted(stepUrls.analysis),
        personalRelationshipsFields.sectionComplete(),
      ].flat(),
      next: `${stepUrls.analysisComplete}#practitioner-analysis`,
      template: templates.analysisIncomplete,
      sectionProgressRules: [setFieldToCompleteWhenValid(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysisComplete,
      template: templates.analysisComplete,
      isLastStep: true,
    },
  ],
}

export default sectionConfig
