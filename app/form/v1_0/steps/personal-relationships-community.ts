import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setFieldToIncomplete, setFieldToCompleteWhenValid, contains } from './common'
import {
  analysisSectionComplete,
  personalRelationshipsFields,
  personalRelationshipsCommunityFields,
  parentalResponsibilitiesFields,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
  currentRelationshipStatusFields,
  intimateRelationshipFields,
} from '../fields/personal-relationships-community'

const defaultTitle = 'Personal relationships and community'
const sectionName = 'personal-relationships-community'

const stepOptions: FormWizard.Steps = {
  '/personal-relationships': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(personalRelationshipsFields, sectionCompleteFields),
    navigationOrder: 7,
    next: [
      {
        field: 'personal_relationships_community_important_people',
        op: contains,
        value: 'CHILD_PARENTAL_RESPONSIBILITIES',
        next: 'personal-relationships-community',
      },
      'personal-relationships-community-2',
    ],
    section: sectionName,
    sectionProgressRules: [
      setFieldToIncomplete('personal_relationships_community_section_complete'),
      setFieldToIncomplete('personal_relationships_community_analysis_section_complete'),
    ],
  },
  '/personal-relationships-community': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(
      currentRelationshipStatusFields,
      intimateRelationshipFields,
      parentalResponsibilitiesFields,
      personalRelationshipsCommunityFields,
      makeChangesFields,
      sectionCompleteFields,
    ),
    next: 'personal-relationships-community-analysis',
    backLink: 'personal-relationships',
    section: sectionName,
    sectionProgressRules: [
      setFieldToCompleteWhenValid('personal_relationships_community_section_complete'),
      setFieldToIncomplete('personal_relationships_community_analysis_section_complete'),
    ],
  },
  '/personal-relationships-community-2': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(
      currentRelationshipStatusFields,
      intimateRelationshipFields,
      personalRelationshipsCommunityFields,
      makeChangesFields,
      sectionCompleteFields,
    ),
    next: 'personal-relationships-community-analysis',
    backLink: 'personal-relationships',
    section: sectionName,
    sectionProgressRules: [
      setFieldToCompleteWhenValid('personal_relationships_community_section_complete'),
      setFieldToIncomplete('personal_relationships_community_analysis_section_complete'),
    ],
  },
  '/personal-relationships-community-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'personal-relationships-community-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [setFieldToCompleteWhenValid('personal_relationships_community_analysis_section_complete')],
  },
  '/personal-relationships-community-analysis-complete': {
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: 'forms/sbna-poc/summary-analysis-complete',
    section: sectionName,
  },
}

export default stepOptions
