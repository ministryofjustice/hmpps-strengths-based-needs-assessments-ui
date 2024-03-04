import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid, contains } from './common'
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
        value: 'CHILD/PARENTAL RESPONSIBILITIES',
        next: 'personal-relationships-community',
      },
      'personal-relationships-community-2',
    ],
    section: sectionName,
    sectionProgressRules: [
      setField('personal_relationships_community_section_complete', 'NO'),
      setField('personal_relationships_community_analysis_section_complete', 'NO'),
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
      setFieldWhenValid('personal_relationships_community_section_complete', 'YES', 'NO'),
      setField('personal_relationships_community_analysis_section_complete', 'NO'),
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
      setFieldWhenValid('personal_relationships_community_section_complete', 'YES', 'NO'),
      setField('personal_relationships_community_analysis_section_complete', 'NO'),
    ],
  },
  '/personal-relationships-community-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: 'personal-relationships-community-analysis-complete#practitioner-analysis',
    template: 'forms/sbna-poc/summary-analysis-incomplete',
    section: sectionName,
    sectionProgressRules: [
      setFieldWhenValid('personal_relationships_community_analysis_section_complete', 'YES', 'NO'),
    ],
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
