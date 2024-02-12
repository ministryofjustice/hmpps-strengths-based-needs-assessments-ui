import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  detailsFieldWith,
  getMediumLabelClassFor,
  orDivider,
  toFormWizardFields,
  yesNoOptions,
} from './common'

export const personalRelationshipsCommunityFields: Array<FormWizard.Field> = [
  {
    text: "Who are the important people in [subject]'s life?",
    code: 'personal_relationships_community_important_people',
    type: FieldType.CheckBox,
    validate: [{ type: ValidationType.Required, message: 'select at least on option' }],
    options: [
      {
        text: "Partner or someone they're in an intimate relationship with",
        value: 'PARTNER/INTIMATE RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Their children or anyone they have parental responsibilities for',
        value: 'CHILD/PARENTAL RESPONSIBILITIES',
        kind: 'option',
      },
      { text: 'Other children', value: 'OTHER CHILDREN', kind: 'option' },
      { text: 'Family members', value: 'FAMILY', kind: 'option' },
      { text: 'Friends', value: 'FRIENDS', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_important_people_partner_details',
    hint: {
      text: "Include their name, age, gender and the nature of their relationship. For example, if they're in a casual or committed relationship.",
      kind: 'text',
    },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_important_people',
      value: 'PARTNER/INTIMATE RELATIONSHIP',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_important_people_child_details',
    hint: { text: 'Include their name, age, gender and the nature of their relationship.', kind: 'text' },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_important_people',
      value: 'CHILD/PARENTAL RESPONSIBILITIES',
      displayInline: true,
    },
  },
  {
    text: 'Give details about their relationship (optional)',
    code: 'personal_relationships_community_important_people_other_children_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_important_people',
      value: 'OTHER CHILDREN',
      displayInline: true,
    },
  },
  {
    text: 'Give details about their relationship (optional)',
    code: 'personal_relationships_community_important_people_family_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_important_people',
      value: 'FAMILY',
      displayInline: true,
    },
  },
  {
    text: 'Give details about their relationship (optional)',
    code: 'personal_relationships_community_important_people_friends_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_important_people',
      value: 'FRIENDS',
      displayInline: true,
    },
  },
  {
    text: 'Give details',
    code: 'personal_relationships_community_important_people_other_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Give details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_important_people',
      value: 'OTHER',
      displayInline: true,
    },
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
