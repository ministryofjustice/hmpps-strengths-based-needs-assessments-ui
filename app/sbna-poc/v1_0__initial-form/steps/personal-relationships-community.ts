import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  personalRelationshipsFields,
  personalRelationshipsCommunityFields,
  parentalResponsibilitiesFields,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/personal-relationships-community'

const defaultTitle = 'Personal relationships and community'
const sectionName = 'personal-relationships-community'

const whenField = (field: string) => ({
  includes: (values: string[]) => ({
    thenGoNext: (next: FormWizard.Step.NextStep | FormWizard.Step.NextStep[]) =>
      values.map(it => ({ field, value: it, next }) as FormWizard.Step.NextStep),
  }),
})

const stepOptions: FormWizard.Steps = {
  '/personal-relationships': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(personalRelationshipsFields),
    navigationOrder: 7,
    next: [
      // {
      // field: 'personal_relationships_community_important_people',
      //   value: 'CHILD/PARENTAL RESPONSIBILITIES',
      //   next: [
      //     whenField('personal_relationships_community_important_people')
      //       .includes(['CHILD/PARENTAL RESPONSIBILITIES', 'PARTNER/INTIMATE RELATIONSHIP', 'OTHER CHILDREN','FAMILY','FRIENDS','OTHER'])
      //       .thenGoNext('personal-relationships-community'),
      //     whenField('personal_relationships_community_important_people')
      //       .includes(['PARTNER/INTIMATE RELATIONSHIP', 'OTHER CHILDREN','FAMILY','FRIENDS','OTHER'])
      //       .thenGoNext('personal-relationships-community-2'),
      //   ].flat(),
      // },
      {
        field: 'personal_relationships_community_important_people',
        value: 'CHILD/PARENTAL RESPONSIBILITIES',
        next: 'personal-relationships-community',
      },
      {
        field: 'personal_relationships_community_important_people',
        value: 'PARTNER/INTIMATE RELATIONSHIP',
        next: 'personal-relationships-community-2',
      },
      {
        field: 'personal_relationships_community_important_people',
        value: 'OTHER CHILDREN',
        next: 'personal-relationships-community-2',
      },
      {
        field: 'personal_relationships_community_important_people',
        value: 'FAMILY',
        next: 'personal-relationships-community-2',
      },
      {
        field: 'personal_relationships_community_important_people',
        value: 'FRIENDS',
        next: 'personal-relationships-community-2',
      },
      {
        field: 'personal_relationships_community_important_people',
        value: 'OTHER',
        next: 'personal-relationships-community-2',
      },
    ].flat(),
    section: sectionName,
    sectionProgressRules: [
      setField('_section_complete', 'NO'), // change
      setField('_section_complete', 'NO'), // change
    ],
  },
  '/personal-relationships-community': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(personalRelationshipsCommunityFields, parentalResponsibilitiesFields, makeChangesFields),
    next: 'personal-relationships-community-2', // change, next page is summary page
    backLink: 'personal-relationships',
    section: sectionName,
    sectionProgressRules: [
      setField('_section_complete', 'NO'), // update
      setField('_section_complete', 'NO'), // update
    ],
  },
  '/personal-relationships-community-2': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(personalRelationshipsCommunityFields, makeChangesFields),
    next: '', // add
    backLink: 'personal-relationships',
    section: sectionName,
    sectionProgressRules: [
      setField('thinking_behaviours_attitudes_section_complete', 'NO'),
      setField('thinking_behaviours_attitudes_analysis_section_complete', 'NO'),
    ],
  },
  '/-summary-analysis': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(practitionerAnalysisFields, [analysisSectionComplete]),
    next: '', // add
    template: '', // add
    section: sectionName,
    sectionProgressRules: [setFieldWhenValid('', 'YES', 'NO')], // add
  },
  '/-analysis-complete': {
    // update/change
    pageTitle: defaultTitle,
    fields: [],
    next: [],
    template: '',
    section: sectionName,
  },
}

export default stepOptions
