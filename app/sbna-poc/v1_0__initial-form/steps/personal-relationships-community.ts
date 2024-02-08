import FormWizard from 'hmpo-form-wizard'
import { fieldCodesFrom, setField, setFieldWhenValid } from './common'
import {
  analysisSectionComplete,
  // add exported fields from fields.js
  personalRelationshipsCommunityFields,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
} from '../fields/personal-relationships-community'

const defaultTitle = 'Personal relationships and community'
const sectionName = 'personal-relationships-community'

const stepOptions: FormWizard.Steps = {
  '/personal-relationships-community': {
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(personalRelationshipsCommunityFields), // add
    navigationOrder: 7,
    next: [
      {
        field: 'xyz',
        value: 'YES',
        next: 'xyz',
      },
      { field: 'xyz', value: 'NO', next: 'xyz' },
    ].flat(),
    section: sectionName,
    sectionProgressRules: [
      setField('thinking_behaviours_attitudes_section_complete', 'NO'), // change
      setField('thinking_behaviours_attitudes_analysis_section_complete', 'NO'), // change
    ],
  },
  '/personal-relationships': {
    // update
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(sectionCompleteFields), // add
    next: 'personal-relationships-2', // update
    backLink: 'personal-relationships-community',
    section: sectionName,
    sectionProgressRules: [
      setField('_section_complete', 'NO'), // update
      setField('_section_complete', 'NO'), // update
    ],
  },
  '/personal-relationships-2': {
    // update
    pageTitle: defaultTitle,
    fields: fieldCodesFrom(makeChangesFields, sectionCompleteFields), // update
    next: 'personal-relationships-community', // add
    backLink: 'thinking-behaviours-attitudes',
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
