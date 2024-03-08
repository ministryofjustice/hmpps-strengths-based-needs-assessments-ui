import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  createWantToMakeChangesFields,
  getMediumLabelClassFor,
  toFormWizardFields,
  yesNoOptions,
} from './common'

export const personalRelationshipsFields: Array<FormWizard.Field> = [
  {
    text: "Who are the important people in [subject]'s life?",
    hint: { text: 'Select all that apply', kind: 'text' },
    code: 'personal_relationships_community_important_people',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select at least one option' }],
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
    text: 'Give details about their friendship (optional)',
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

export const currentRelationshipStatusFields: Array<FormWizard.Field> = [
  {
    text: 'Is [subject] happy with their current relationship status?',
    code: 'personal_relationships_community_current_relationship',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they are happy with their current relationship status' },
    ],
    options: [
      {
        text: 'Happy and positive about their relationship status or their relationship is likely to act as a protective factor',
        value: 'HAPPY_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Has some concerns about their relationship status but is overall happy',
        value: 'CONCERNS_HAPPY_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Unhappy about their relationship status or their relationship is unhealthy and directly linked to offending',
        value: 'UNHAPPY_RELATIONSHIP',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_happy_relationship',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_current_relationship',
      value: 'HAPPY_RELATIONSHIP',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_concerned_relationship',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_current_relationship',
      value: 'CONCERNS_HAPPY_RELATIONSHIP',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_unhappy_relationship',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_current_relationship',
      value: 'UNHAPPY_RELATIONSHIP',
      displayInline: true,
    },
  },
]

export const intimateRelationshipFields: Array<FormWizard.Field> = [
  {
    text: "What is [subject]'s history of intimate relationships?",
    code: 'personal_relationships_community_intimate_relationship',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their history of intimate relationships' }],
    options: [
      {
        text: 'History of stable, supportive, positive and rewarding relationships',
        hint: {
          text: 'This includes if they do not have a history of relationships but appear capable of starting and maintaining one.',
        },
        value: 'STABLE_RELATIONSHIPS',
        kind: 'option',
      },
      {
        text: 'History of both positive and negative relationships',
        value: 'POSITIVE_AND_NEGATIVE_RELATIONSHIPS',
        kind: 'option',
      },
      {
        text: 'History of unstable, unsupportive and destructive relationships',
        hint: { text: 'This includes if they are single and have never had a relationship but would like one.' },
        value: 'UNSTABLE_RELATIONSHIPS',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_stable_intimate_relationship',
    hint: {
      text: 'Consider patterns and quality of any significant relationships.',
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
      field: 'personal_relationships_community_intimate_relationship',
      value: 'STABLE_RELATIONSHIPS',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_mixed_intimate_relationship',
    hint: {
      text: 'Consider patterns and quality of any significant relationships.',
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
      field: 'personal_relationships_community_intimate_relationship',
      value: 'POSITIVE_AND_NEGATIVE_RELATIONSHIPS',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_unstable_intimate_relationship',
    hint: {
      text: 'Consider patterns and quality of any significant relationships.',
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
      field: 'personal_relationships_community_intimate_relationship',
      value: 'UNSTABLE_RELATIONSHIPS',
      displayInline: true,
    },
  },
  {
    text: 'Is [subject] able to resolve any challenges in their intimate relationships?',
    code: 'personal_relationships_community_challenges_intimate_relationship',
    hint: {
      text: 'Consider any healthy and appropriate skills or strengths they may have.',
      kind: 'text',
    },
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
      { type: ValidationType.Required, message: 'Enter details' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
  },
]

export const personalRelationshipsCommunityFields: Array<FormWizard.Field> = [
  {
    text: "What is [subject]'s current relationship like with their family?",
    code: 'personal_relationships_community_family_relationship',
    hint: {
      text: 'Consider any relationships that may act like family support.',
      kind: 'text',
    },
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select what their current relationship is like with their family' },
    ],
    options: [
      {
        text: 'Stable, supportive, positive and rewarding relationship',
        value: 'STABLE_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Both positive and negative relationship',
        value: 'MIXED_RELATIONSHIP',
        kind: 'option',
      },
      {
        text: 'Unstable and unsupportive relationship',
        hint: { text: 'This includes those who have little or no contact with their family.' },
        value: 'UNSTABLE_RELATIONSHIP',
        kind: 'option',
      },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_stable_family_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_family_relationship',
      value: 'STABLE_RELATIONSHIP',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_mixed_family_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_family_relationship',
      value: 'MIXED_RELATIONSHIP',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_unstable_family_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_family_relationship',
      value: 'UNSTABLE_RELATIONSHIP',
      displayInline: true,
    },
  },
  {
    text: 'What was [subject]’s experience of their childhood?',
    code: 'personal_relationships_community_childhood',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their experience of childhood' }],
    options: [
      {
        text: 'Positive experience',
        value: 'POSITIVE_CHILDHOOD',
        kind: 'option',
      },
      {
        text: 'Both positive and negative experience',
        value: 'MIXED_CHILDHOOD',
        kind: 'option',
      },
      {
        text: 'Negative experience',
        hint: {
          text: 'This includes things like permanent or long-term separation from their parents or guardians, inconsistent care, neglect or abuse.',
        },
        value: 'NEGATIVE_CHILDHOOD',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_positive_childhood_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_childhood',
      value: 'POSITIVE_CHILDHOOD',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_mixed_childhood_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_childhood',
      value: 'MIXED_CHILDHOOD',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_negative_childhood_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_childhood',
      value: 'NEGATIVE_CHILDHOOD',
      displayInline: true,
    },
  },
  {
    text: 'Did [subject] have any childhood behavioural problems?',
    code: 'personal_relationships_community_childhood_behaviour',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select if they had childhood behavioural problems' }],
    options: [
      {
        text: 'Yes',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'No',
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_yes_childhood_behaviour_problems_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_childhood_behaviour',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_no_childhood_behaviour_problems_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_childhood_behaviour',
      value: 'NO',
      displayInline: true,
    },
  },
  {
    text: 'Is [subject] part of any groups or communities that gives them a sense of belonging? (optional)',
    code: 'personal_relationships_community_belonging',
    hint: { text: 'For example, online social media or community groups.', kind: 'text' },
    type: FieldType.TextArea,
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
  },
]

export const parentalResponsibilitiesFields: Array<FormWizard.Field> = [
  {
    text: 'Is [subject] able to manage their parental responsibilities? ',
    code: 'personal_relationships_community_parental_responsibilities',
    hint: {
      text: 'If there are parenting concerns, it does not always mean there are child wellbeing concerns. They may just require some help or support.',
      kind: 'text',
    },
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they’re able to manage their parental responsibilities' },
    ],
    options: [
      {
        text: 'Yes, manages parenting responsibilities well',
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Sometimes manages parenting responsibilities well',
        value: 'SOMETIMES',
        kind: 'option',
      },
      { text: 'No, is not able to manage parenting responsibilities', value: 'NO', kind: 'option' },
      { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_good_parental_responsibilities_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_parental_responsibilities',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_mixed_parental_responsibilities_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_parental_responsibilities',
      value: 'SOMETIMES',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'personal_relationships_community_bad_parental_responsibilities_details',
    type: FieldType.TextArea,
    validate: [
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'personal_relationships_community_parental_responsibilities',
      value: 'NO',
      displayInline: true,
    },
  },
]

export const makeChangesFields = createWantToMakeChangesFields(
  'their personal relationships and community',
  'personal_relationships_community',
)

export const practitionerAnalysisFields: Array<FormWizard.Field> = createPractitionerAnalysisFieldsWith(
  'personal_relationships_community',
)

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the personal relationships and community section complete?',
  code: 'personal_relationships_community_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the personal relationships and community analysis section complete?',
  code: 'personal_relationships_community_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  analysisSectionComplete,
  personalRelationshipsFields,
  personalRelationshipsCommunityFields,
  parentalResponsibilitiesFields,
  makeChangesFields,
  practitionerAnalysisFields,
  sectionCompleteFields,
  currentRelationshipStatusFields,
  intimateRelationshipFields,
]
  .flat()
  .reduce(toFormWizardFields, {})
