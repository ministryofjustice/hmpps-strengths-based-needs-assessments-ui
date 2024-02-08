import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  createPractitionerAnalysisFieldsWith,
  getMediumLabelClassFor,
  toFormWizardFields,
  yesNoOptions,
  orDivider,
  detailsFieldWith,
} from './common'

export const personalRelationshipsCommunityFields: Array<FormWizard.Field> = [
  {
    text: 'xyz', // update
    code: '', // update
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: '' }, // update
    ],
    options: [
      { text: 'Yes, is aware of the consequences of their actions', value: 'YES', kind: 'option' }, // update
      { text: 'Sometimes is aware of the consequences of their actions', value: 'SOMETIMES', kind: 'option' }, // update
      { text: 'No, is not aware of the consequences of their actions', value: 'NO', kind: 'option' }, // update
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
]

const makeChangesOptionsWithDetails: Array<FormWizard.Field.Option> = [
  { text: 'I have already made changes and want to maintain them', value: 'MADE_CHANGES', kind: 'option' },
  { text: 'I am actively making changes', value: 'MAKING_CHANGES', kind: 'option' },
  { text: 'I want to make changes and know how to', value: 'WANT_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I want to make changes but need help', value: 'NEEDS_HELP_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I am thinking about making changes', value: 'THINKING_ABOUT_MAKING_CHANGES', kind: 'option' },
  { text: 'I do not want to make changes', value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', kind: 'option' },
  { text: 'I do not want to answer', value: 'DOES_NOT_WANT_TO_ANSWER', kind: 'option' },
]

const makeChangesOptions: FormWizard.Field.Options = [
  ...makeChangesOptionsWithDetails,
  orDivider,
  { text: '[subject] is not present', value: 'NOT_PRESENT', kind: 'option' },
  { text: 'Not applicable', value: 'NOT_APPLICABLE', kind: 'option' },
]

export const makeChangesFields: Array<FormWizard.Field> = [
  {
    text: 'Does [subject] want to make changes to their personal relationships and community?',
    hint: { text: 'This question must be directly answered by [subject]', kind: 'text' },
    code: 'personal_relationships_community_changes',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they want to make changes to their personal relationships and community',
      },
    ],
    options: makeChangesOptions,
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  ...makeChangesOptionsWithDetails.map(detailsFieldWith('personal_relationships_community_changes')),
]

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith(
  '', // update
)

export const questionSectionComplete: FormWizard.Field = {
  text: 'e section complete?', // update
  code: 'section_complete', // update
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is xyz section complete?', // update
  code: '_section_complete', // update
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  personalRelationshipsCommunityFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
  analysisSectionComplete,
  questionSectionComplete,
  makeChangesFields,
]
  .flat()
  .reduce(toFormWizardFields, {})
