import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from './common'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../config/sections'
import { dependentOn } from './common/utils'

const hasBeenEmployedBeforeOptions: FormWizard.Field.Options = [
  {
    text: 'Yes, has been employed before',
    summary: { displayFn: () => 'Has been employed before' },
    value: 'YES',
    kind: 'option',
  },
  {
    text: 'No, has never been employed',
    summary: { displayFn: () => 'Has never been employed' },
    value: 'NO',
    kind: 'option',
  },
]

const createErrorForExperienceOfFields = (subject: string, prefix?: string) =>
  ['Select their', prefix, 'experience of', subject].filter(it => it !== undefined && it !== null).join(' ')

const createExperienceOfFields = (label: string, subject: string, prefix?: string): Array<FormWizard.Field> => {
  const parentFieldCode = utils.fieldCodeWith(subject, 'experience')
  const optionsWithDetails: Array<FormWizard.Field.Option> = [
    { text: 'Positive', value: 'POSITIVE', kind: 'option' },
    { text: 'Mostly positive', value: 'MOSTLY_POSITIVE', kind: 'option' },
    { text: 'Positive and negative', value: 'POSITIVE_AND_NEGATIVE', kind: 'option' },
    { text: 'Mostly negative', value: 'MOSTLY_NEGATIVE', kind: 'option' },
    { text: 'Negative', value: 'NEGATIVE', kind: 'option' },
  ]

  const parentField: FormWizard.Field = {
    text: label,
    code: parentFieldCode,
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: createErrorForExperienceOfFields(subject, prefix) }],
    options: [...optionsWithDetails, { text: 'Unknown', value: 'UNKNOWN', kind: 'option' }],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  return [parentField, ...optionsWithDetails.map(FieldsFactory.detailsFieldWith({ parentField }))]
}

class EmploymentEducationFieldsFactory extends FieldsFactory {
  employmentStatus: FormWizard.Field = {
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
  }

  employmentType: FormWizard.Field = {
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
    dependent: dependentOn(this.employmentStatus, 'EMPLOYED'),
    labelClasses: utils.visuallyHidden,
  }

  hasBeenEmployedPrototype: FormWizard.Field = {
    text: 'Have they been employed before?',
    code: 'has_been_employed',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select one option' }],
    options: hasBeenEmployedBeforeOptions,
  }

  hasBeenEmployedUnavailableForWork: FormWizard.Field = {
    ...this.hasBeenEmployedPrototype,
    id: 'has_been_employed_unavailable_for_work',
    dependent: dependentOn(this.employmentStatus, 'CURRENTLY_UNAVAILABLE_FOR_WORK'),
  }

  hasBeenEmployedActivelySeeking: FormWizard.Field = {
    ...this.hasBeenEmployedPrototype,
    id: 'has_been_employed_actively_seeking',
    dependent: dependentOn(this.employmentStatus, 'UNEMPLOYED_LOOKING_FOR_WORK'),
  }

  hasBeenEmployedNotActivelySeeking: FormWizard.Field = {
    ...this.hasBeenEmployedPrototype,
    id: 'has_been_employed_not_actively_seeking',
    dependent: dependentOn(this.employmentStatus, 'UNEMPLOYED_NOT_LOOKING_FOR_WORK'),
  }

  employmentArea: FormWizard.Field = {
    text: 'What job sector does [subject] work in? (optional)',
    code: 'employment_area',
    type: FieldType.TextArea,
    validate: [],
    labelClasses: utils.getMediumLabelClassFor(FieldType.TextArea),
  }

  static employmentHistoryOptions: FormWizard.Field.Options = [
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
  ]

  employmentHistory: FormWizard.Field = {
    text: "What is [subject]'s employment history?",
    hint: { text: 'Include their current employment.', kind: 'text' },
    code: 'employment_history',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select their employment history' }],
    options: EmploymentEducationFieldsFactory.employmentHistoryOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  employmentHistoryDetailsGroup: FormWizard.Field[] = EmploymentEducationFieldsFactory.employmentHistoryOptions.map(
    FieldsFactory.detailsFieldWith({
      parentField: this.employmentHistory,
      textHint: "Include what type of work they've done before.",
    }),
  )

  employmentOtherResponsibilities: FormWizard.Field = {
    text: 'Does [subject] have any additional day-to-day commitments?',
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'employment_other_responsibilities',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they have any additional day-to-day commitments, or select ‘None’',
      },
    ],
    options: [
      { text: 'Caring responsibilities', value: 'CARER', kind: 'option' },
      { text: 'Child responsibilities', value: 'CHILD', kind: 'option' },
      { text: 'Studying', value: 'STUDYING', kind: 'option' },
      { text: 'Volunteering', value: 'VOLUNTEER', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
      utils.orDivider,
      { text: 'None', value: 'NONE', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  employmentOtherResponsibilitiesGroup = ['CARER', 'CHILD', 'VOLUNTEER', 'OTHER'].map(option =>
    FieldsFactory.detailsField({
      parentField: this.employmentOtherResponsibilities,
      dependentValue: option,
    }),
  )

  educationHighestLevelCompleted: FormWizard.Field = {
    text: 'Select the highest level of academic qualification [subject] has completed',
    code: 'education_highest_level_completed',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select the highest level of academic qualification completed' },
    ],
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
      utils.orDivider,
      { text: 'None of these', value: 'NONE_OF_THESE', kind: 'option' },
      { text: 'Unknown', value: 'NOT_SURE', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  educationProfessionalOrVocationalQualifications: FormWizard.Field = {
    text: 'Does [subject] have any professional or vocational qualifications?',
    code: 'education_professional_or_vocational_qualifications',
    type: FieldType.Radio,
    validate: [
      { type: ValidationType.Required, message: 'Select if they have any professional or vocational qualifications' },
    ],
    options: [
      { text: 'Yes', value: 'YES', kind: 'option' },
      { text: 'No', value: 'NO', kind: 'option' },
      utils.orDivider,
      { text: 'Unknown', value: 'NOT_SURE', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  educationProfessionalOrVocationalQualificationsDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.educationProfessionalOrVocationalQualifications,
    dependentValue: 'YES',
    required: true,
  })

  educationTransferableSkills: FormWizard.Field = {
    text: 'Does [subject] have any skills that could help them in a job or to get a job?',
    code: 'education_transferable_skills',
    type: FieldType.Radio,
    validate: [
      {
        type: ValidationType.Required,
        message: 'Select if they have any skills that could help them in a job or to get a job',
      },
    ],
    options: [
      {
        text: 'Yes',
        hint: { text: 'This includes any completed training, qualifications, work experience or transferable skills.' },
        value: 'YES',
        kind: 'option',
      },
      {
        text: 'Some skills',
        hint: {
          text: 'This includes partially completed training or qualifications, limited on the job experience or skills that are not directly transferable.',
        },
        value: 'YES_SOME_SKILLS',
        kind: 'option',
      },
      {
        text: 'No',
        hint: {
          text: 'This includes having no other qualifications, incomplete apprenticeships or no history of working in the same industry.',
        },
        value: 'NO',
        kind: 'option',
      },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  educationTransferableSkillsDetailsGroup: FormWizard.Field[] = ['YES', 'YES_SOME_SKILLS'].map(option =>
    FieldsFactory.detailsField({
      parentField: this.educationTransferableSkills,
      dependentValue: option,
    }),
  )

  educationDifficulties: FormWizard.Field = {
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
      utils.orDivider,
      { text: 'No difficulties', value: 'NONE', kind: 'option', behaviour: 'exclusive' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  }

  educationDifficultiesReadingSeverity: FormWizard.Field = {
    text: 'Select level of difficulty',
    code: 'education_difficulties_reading_severity',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select level of difficulty' }],
    options: [
      { text: 'Significant difficulties', value: 'SIGNIFICANT_DIFFICULTIES', kind: 'option' },
      { text: 'Some difficulties', value: 'SOME_DIFFICULTIES', kind: 'option' },
    ],
    dependent: dependentOn(this.educationDifficulties, 'READING'),
  }

  educationDifficultiesWritingSeverity: FormWizard.Field = {
    text: 'Select level of difficulty',
    code: 'education_difficulties_writing_severity',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select level of difficulty' }],
    options: [
      { text: 'Significant difficulties', value: 'SIGNIFICANT_DIFFICULTIES', kind: 'option' },
      { text: 'Some difficulties', value: 'SOME_DIFFICULTIES', kind: 'option' },
    ],
    dependent: dependentOn(this.educationDifficulties, 'WRITING'),
  }

  educationDifficultiesNumeracySeverity: FormWizard.Field = {
    text: 'Select level of difficulty',
    code: 'education_difficulties_numeracy_severity',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Select level of difficulty' }],
    options: [
      { text: 'Significant difficulties', value: 'SIGNIFICANT_DIFFICULTIES', kind: 'option' },
      { text: 'Some difficulties', value: 'SOME_DIFFICULTIES', kind: 'option' },
    ],
    dependent: dependentOn(this.educationDifficulties, 'NUMERACY'),
  }

  experienceOfEmploymentGroup: FormWizard.Field[] = createExperienceOfFields(
    "What is [subject]'s overall experience of employment?",
    'employment',
    'overall',
  )

  experienceOfEducationGroup: FormWizard.Field[] = createExperienceOfFields(
    "What is [subject]'s experience of education?",
    'education',
  )
}

export default new EmploymentEducationFieldsFactory(sections.employmentEducation)
