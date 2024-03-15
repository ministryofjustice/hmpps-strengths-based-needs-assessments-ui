import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'
import {
  characterLimit,
  createPractitionerAnalysisFieldsWith,
  createWantToMakeChangesFields,
  detailsFieldWith,
  fieldCodeWith,
  getMediumLabelClassFor,
  orDivider,
  toFormWizardFields,
  visuallyHidden,
  yesNoOptions,
} from './common'

const hasBeenEmployedBeforeOptions: FormWizard.Field.Options = [
  { text: 'Yes, has been employed before', value: 'YES', kind: 'option' },
  { text: 'No, has never been employed', value: 'NO', kind: 'option' },
]

const createExperienceOfFields = (label: string, prefix: string): Array<FormWizard.Field> => {
  const parentFieldCode = fieldCodeWith(prefix, 'experience')
  const optionsWithDetails: Array<FormWizard.Field.Option> = [
    { text: 'Positive', value: 'POSITIVE', kind: 'option' },
    { text: 'Mostly positive', value: 'MOSTLY_POSITIVE', kind: 'option' },
    { text: 'Positive and negative', value: 'POSITIVE_AND_NEGATIVE', kind: 'option' },
    { text: 'Mostly negative', value: 'MOSTLY_NEGATIVE', kind: 'option' },
    { text: 'Negative', value: 'NEGATIVE', kind: 'option' },
  ]

  return [
    {
      text: label,
      code: parentFieldCode,
      type: FieldType.Radio,
      validate: [{ type: ValidationType.Required, message: `Select their experience of ${prefix}` }],
      options: [...optionsWithDetails, { text: 'Unknown', value: 'UNKNOWN', kind: 'option' }],
      labelClasses: getMediumLabelClassFor(FieldType.Radio),
    },
    ...optionsWithDetails.map(detailsFieldWith(parentFieldCode)),
  ]
}

export const employmentStatusFields: Array<FormWizard.Field> = [
  {
    text: "What is [subject]'s current employment status?",
    code: 'employment_status',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select one option' }],
    options: [
      { text: 'Employed', value: 'EMPLOYED', kind: 'option' },
      { text: 'Self-employed', value: 'SELF_EMPLOYED', kind: 'option' },
      { text: 'Retired', value: 'RETIRED', kind: 'option' },
      { text: 'Currently unavailable for work', value: 'CURRENTLY_UNAVAILABLE_FOR_WORK', kind: 'option' },
      { text: 'Unemployed - actively looking for work', value: 'UNEMPLOYED_LOOKING_FOR_WORK', kind: 'option' },
      { text: 'Unemployed - not actively looking for work', value: 'UNEMPLOYED_NOT_LOOKING_FOR_WORK', kind: 'option' },
    ],
  },
  {
    text: 'What is the type of employment?',
    code: 'employment_type',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select one option' }],
    options: [
      { text: 'Full-time', value: 'FULL_TIME', kind: 'option' },
      { text: 'Part-time', value: 'PART_TIME', kind: 'option' },
      { text: 'Temporary or casual', value: 'TEMPORARY_OR_CASUAL', kind: 'option' },
      { text: 'Apprenticeship', value: 'APPRENTICESHIP', kind: 'option' },
    ],
    dependent: {
      field: 'employment_status',
      value: 'EMPLOYED',
      displayInline: true,
    },
    labelClasses: visuallyHidden,
  },
  {
    text: 'Have they been employed before?',
    id: 'has_been_employed_unavailable_for_work',
    code: 'has_been_employed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select one option' }],
    options: hasBeenEmployedBeforeOptions,
    dependent: {
      field: 'employment_status',
      value: 'CURRENTLY_UNAVAILABLE_FOR_WORK',
      displayInline: true,
    },
  },
  {
    text: 'Have they been employed before?',
    id: 'has_been_employed_actively_seeking',
    code: 'has_been_employed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select one option' }],
    options: hasBeenEmployedBeforeOptions,
    dependent: {
      field: 'employment_status',
      value: 'UNEMPLOYED_LOOKING_FOR_WORK',
      displayInline: true,
    },
  },
  {
    text: 'Have they been employed before?',
    id: 'has_been_employed_not_actively_seeking',
    code: 'has_been_employed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select one option' }],
    options: hasBeenEmployedBeforeOptions,
    dependent: {
      field: 'employment_status',
      value: 'UNEMPLOYED_NOT_LOOKING_FOR_WORK',
      displayInline: true,
    },
  },
]

export const employmentFields: Array<FormWizard.Field> = [
  {
    text: 'What area does [subject] work in? (optional)',
    code: 'employment_area',
    type: FieldType.TextArea,
    validate: [],
    labelClasses: getMediumLabelClassFor(FieldType.TextArea),
  },
]

export const employmentHistory: Array<FormWizard.Field> = [
  {
    text: "What is [subject]'s employment history?",
    hint: { text: 'Include their current employment.', kind: 'text' },
    code: 'employment_history',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their employment history' }],
    options: [
      {
        text: 'Continuous employment history',
        hint: {
          text: 'They may have had a break in employment due to things like redundancy, illness or caring for a family member.',
        },
        value: 'STABLE',
        kind: 'option',
      },
      { text: 'Generally in employment but changes jobs often', value: 'PERIODS_OF_INSTABILITY', kind: 'option' },
      { text: 'Unstable employment history with regular periods of unemployment', value: 'UNSTABLE', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    hint: { text: "Include what type of work they've done before.", kind: 'text' },
    code: 'employment_history_stable_details',
    id: 'employment_history_stable_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'employment_history',
      value: 'STABLE',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    hint: { text: "Include what type of work they've done before.", kind: 'text' },
    code: 'employment_history_periods_of_instability_details',
    id: 'employment_history_periods_of_instability_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'employment_history',
      value: 'PERIODS_OF_INSTABILITY',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    hint: { text: "Include what type of work they've done before.", kind: 'text' },
    code: 'employment_history_unstable_details',
    id: 'employment_history_unstable_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'employment_history',
      value: 'UNSTABLE',
      displayInline: true,
    },
  },
]

export const educationFields: Array<FormWizard.Field> = [
  {
    text: 'Does [subject] have any other responsibilities?',
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'employment_other_responsibilities',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      { type: ValidationType.Required, message: "Select if they have any other responsibilities, or select 'None'" },
    ],
    options: [
      { text: 'Carer', value: 'CARER', kind: 'option' },
      { text: 'Volunteer', value: 'VOLUNTEER', kind: 'option' },
      { text: 'Student', value: 'STUDENT', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      orDivider,
      { text: 'None', value: 'NONE', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.CheckBox),
  },
  {
    text: 'Give details (optional)',
    code: 'employment_other_responsibilities_carer_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'employment_other_responsibilities',
      value: 'CARER',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'employment_other_responsibilities_volunteer_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'employment_other_responsibilities',
      value: 'VOLUNTEER',
      displayInline: true,
    },
  },
  {
    text: 'Give details (optional)',
    code: 'employment_other_responsibilities_other_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'employment_other_responsibilities',
      value: 'OTHER',
      displayInline: true,
    },
  },
  {
    text: 'Select the highest level of education [subject] has completed',
    code: 'education_highest_level_completed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select the highest level of education completed' }],
    options: [
      {
        text: 'Entry level',
        hint: { text: 'For example, entry level diploma' },
        value: 'ENTRY_LEVEL',
        kind: 'option',
      },
      {
        text: 'Level 1',
        hint: { text: 'For example, GCSE grades 3, 2, 1 or grades D, E, F, G' },
        value: 'LEVEL_1',
        kind: 'option',
      },
      {
        text: 'Level 2',
        hint: { text: 'For example, GCSE grades 9, 8, 7, 6, 5, 4 or grades A*, A, B, C' },
        value: 'LEVEL_2',
        kind: 'option',
      },
      {
        text: 'Level 3',
        hint: { text: 'For example, A level' },
        value: 'LEVEL_3',
        kind: 'option',
      },
      {
        text: 'Level 4',
        hint: { text: 'For example, higher apprenticeship' },
        value: 'LEVEL_4',
        kind: 'option',
      },
      {
        text: 'Level 5',
        hint: { text: 'For example, foundation degree' },
        value: 'LEVEL_5',
        kind: 'option',
      },
      {
        text: 'Level 6',
        hint: { text: 'For example, degree with honours' },
        value: 'LEVEL_6',
        kind: 'option',
      },
      {
        text: 'Level 7',
        hint: { text: "For example, master's degree" },
        value: 'LEVEL_7',
        kind: 'option',
      },
      {
        text: 'Level 8',
        hint: { text: 'For example, doctorate' },
        value: 'LEVEL_8',
        kind: 'option',
      },
      orDivider,
      { text: 'None of these', value: 'NONE_OF_THESE', kind: 'option' },
      { text: 'Not sure', value: 'NOT_SURE', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Does [subject] have any professional or vocational qualifications?',
    code: 'education_professional_or_vocational_qualifications',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they have any professional or vocational qualifications' },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      orDivider,
      { text: 'Not sure', value: 'NOT_SURE', kind: 'option' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details (optional)',
    code: 'education_professional_or_vocational_qualifications_details',
    type: FieldType.TextArea,
    validate: [],
    dependent: {
      field: 'education_professional_or_vocational_qualifications',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Does [subject] have skills that could help them in a job or at work?',
    code: 'education_transferable_skills',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they have skills that could help them in a job or at work' },
    ],
    options: [
      {
        text: 'Yes',
        hint: { text: 'This includes vocational qualifications, academic qualifications or transferable skills.' },
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Yes, some skills',
        hint: {
          text: 'This includes skills that are not directly transferable, partially completed training or limited on the job experience.',
        },
        value: 'YES_SOME_SKILLS',
        kind: 'option',
      },
      {
        text: 'No',
        hint: {
          text: 'This includes having no history of working in the same industry, no completed apprenticeships or no vocational qualifications.',
        },
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Give details',
    code: 'education_transferable_skills_yes_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'education_transferable_skills',
      value: 'YES',
      displayInline: true,
    },
  },
  {
    text: 'Give details',
    code: 'education_transferable_skills_yes_some_skills_details',
    type: FieldType.TextArea,
    validate: [
      { type: ValidationType.Required, message: 'Enter details' },
      {
        type: ValidationType.MaxLength,
        arguments: [characterLimit],
        message: `Details must be ${characterLimit} characters or less`,
      },
    ],
    dependent: {
      field: 'education_transferable_skills',
      value: 'YES_SOME_SKILLS',
      displayInline: true,
    },
  },
  {
    text: 'Does [subject] have difficulties with reading, writing or numeracy?',
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'education_difficulties',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: "Select if they have difficulties with reading, writing or numeracy, or select 'No difficulties'",
      },
    ],
    options: [
      { text: 'Yes, with reading', value: 'READING', kind: 'option' },
      { text: 'Yes, with writing', value: 'WRITING', kind: 'option' },
      { text: 'Yes, with numeracy', value: 'NUMERACY', kind: 'option' },
      orDivider,
      { text: 'No difficulties', value: 'NONE', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: getMediumLabelClassFor(FieldType.Radio),
  },
  {
    text: 'Select level of difficulty',
    code: 'education_difficulties_reading_severity',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select level of difficulty' }],
    options: [
      { text: 'Significant difficulties', value: 'SIGNIFICANT_DIFFICULTIES', kind: 'option' },
      { text: 'Some difficulties', value: 'SOME_DIFFICULTIES', kind: 'option' },
    ],
    dependent: {
      field: 'education_difficulties',
      value: 'READING',
      displayInline: true,
    },
  },
  {
    text: 'Select level of difficulty',
    code: 'education_difficulties_writing_severity',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select level of difficulty' }],
    options: [
      { text: 'Significant difficulties', value: 'SIGNIFICANT_DIFFICULTIES', kind: 'option' },
      { text: 'Some difficulties', value: 'SOME_DIFFICULTIES', kind: 'option' },
    ],
    dependent: {
      field: 'education_difficulties',
      value: 'WRITING',
      displayInline: true,
    },
  },
  {
    text: 'Select level of difficulty',
    code: 'education_difficulties_numeracy_severity',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select level of difficulty' }],
    options: [
      { text: 'Significant difficulties', value: 'SIGNIFICANT_DIFFICULTIES', kind: 'option' },
      { text: 'Some difficulties', value: 'SOME_DIFFICULTIES', kind: 'option' },
    ],
    dependent: {
      field: 'education_difficulties',
      value: 'NUMERACY',
      displayInline: true,
    },
  },
]

export const experienceOfEmployment = createExperienceOfFields(
  "What is [subject]'s overall experience of employment?",
  'employment',
)
export const experienceOfEducation = createExperienceOfFields(
  "What is [subject]'s experience of education?",
  'education',
)

export const makeChangesFields = createWantToMakeChangesFields('their employment and education', 'employment_education')

export const practitionerAnalysisFields: Array<FormWizard.Field> =
  createPractitionerAnalysisFieldsWith('employment_education')

export const questionSectionComplete: FormWizard.Field = {
  text: 'Is the employment and education section complete?',
  code: 'employment_education_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const analysisSectionComplete: FormWizard.Field = {
  text: 'Is the employment and education analysis section complete?',
  code: 'employment_education_analysis_section_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export const sectionCompleteFields: Array<FormWizard.Field> = [questionSectionComplete, analysisSectionComplete]

export default [
  ...employmentStatusFields,
  ...employmentFields,
  ...employmentHistory,
  ...employmentFields,
  ...educationFields,
  ...experienceOfEmployment,
  ...experienceOfEducation,
  ...makeChangesFields,
  ...practitionerAnalysisFields,
  ...sectionCompleteFields,
].reduce(toFormWizardFields, {})
