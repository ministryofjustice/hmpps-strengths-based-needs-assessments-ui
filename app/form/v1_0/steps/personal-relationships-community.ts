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

const sectionConfig: SectionConfig = {
  section,
  steps: [
    {
      url: stepUrls.personalRelationships,
      fields: [
        ...personalRelationshipsFields.personalRelationships,
        ...personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationships),
        ...personalRelationshipsFields.sectionComplete(),
      ],
      navigationOrder: 7,
      next: [
        {
          field: 'personal_relationships_community_important_people',
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
        ...personalRelationshipsFields.currentRelationshipStatus,
        ...personalRelationshipsFields.intimateRelationship,
        ...personalRelationshipsFields.parentalResponsibilities,
        ...personalRelationshipsFields.personalRelationshipsCommunity,
        ...personalRelationshipsFields.wantToMakeChanges(),
        ...personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationshipsCommunity),
        ...personalRelationshipsFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.personalRelationships,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.personalRelationshipsCommunity2,
      fields: [
        ...personalRelationshipsFields.currentRelationshipStatus,
        ...personalRelationshipsFields.intimateRelationship,
        ...personalRelationshipsFields.personalRelationshipsCommunity,
        ...personalRelationshipsFields.wantToMakeChanges(),
        ...personalRelationshipsFields.isUserSubmitted(stepUrls.personalRelationshipsCommunity2),
        ...personalRelationshipsFields.sectionComplete(),
      ],
      next: stepUrls.analysis,
      backLink: stepUrls.personalRelationships,
      sectionProgressRules: [setFieldToIncomplete(section.sectionCompleteField)],
    },
    {
      url: stepUrls.analysis,
      fields: [
        ...personalRelationshipsFields.practitionerAnalysis(),
        ...personalRelationshipsFields.isUserSubmitted(stepUrls.analysis),
        ...personalRelationshipsFields.sectionComplete(),
      ],
      next: `${stepUrls.analysisComplete}#practitioner-analysis`,
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
