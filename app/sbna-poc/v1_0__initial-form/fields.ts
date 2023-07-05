import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  current_accommodation: {
    text: "What is [subject]'s current accommodation?",
    code: 'current_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Current accommodation is required' }],
    options: [
      { text: 'Settled', value: 'SETTLED' },
      { text: 'Temporary', value: 'TEMPORARY' },
      { text: 'No accommodation', value: 'NO_ACCOMMODATION' },
    ],
  },
  living_with: {
    text: 'Who does [subject] live with?',
    code: 'living_with',
    type: FieldType.CheckBox,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Family', value: 'FAMILY' },
      { text: 'Friends', value: 'FRIENDS' },
      { text: 'Partner', value: 'PARTNER' },
      { text: 'Child under 18 years old', value: 'CHILD_UNDER_18' },
      { text: 'Alone', value: 'ALONE' },
      { text: 'Other', value: 'OTHER' },
    ],
  },
  suitable_housing: {
    text: "Is [subject]'s housing suitable?",
    code: 'suitable_housing',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  suitable_housing_location: {
    text: "Is the location of [subject]'s housing suitable?",
    code: 'suitable_housing_location',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
    ],
  },
  no_accommodation_details: {
    text: 'Why does [subject] have no housing?',
    code: 'no_accommodation_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  },
  suitable_housing_details: {
    text: "What's helped [subject] stay in suitable housing in the past?",
    code: 'suitable_housing_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  },
  suitable_housing_planned: {
    text: 'Does [subject] have future housing planned?',
    code: 'suitable_housing_planned',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'Yes', value: 'YES' },
      { text: 'No', value: 'NO' },
      { text: 'Awaiting assessment', value: 'AWAITING_ASSESSMENT' },
      { text: 'Awaiting placement', value: 'AWAITING_PLACEMENT' },
    ],
  },
  awaiting_accommodation_placement_details: {
    text: 'Give details',
    code: 'awaiting_accommodation_placement_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    dependent: {
      field: 'suitable_housing_planned',
      value: 'AWAITING_PLACEMENT',
    },
  },
  accommodation_changes: {
    text: 'Do you want to make changes to your housing?',
    hint: 'This question must be answered by [subject]',
    code: 'accommodation_changes',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
    options: [
      { text: 'I want to make changes', value: 'I_WANT_TO_MAKE_CHANGES' },
      { text: 'I want to make changes but need help', value: 'I_NEED_HELP_TO_MAKE_CHANGES' },
      { text: 'I do not want to make changes', value: 'I_DO_NOT_WANT_TO_MAKE_CHANGES' },
      { text: 'I do not think I can make changes right now', value: 'I_AM_UNABLE_TO_MAKE_CHANGES_CURRENTLY' },
      { text: '[subject] is not present or did not want to answer', value: 'NOT_PRESENT_OR_DID_NOT_ANSWER' },
    ],
  },
  accommodation_changes_details: {
    text: 'What changes do you want to achieve or maintain?',
    hint: 'This question must be answered by [subject]',
    code: 'accommodation_changes_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Field is required' }],
  },
}

export default fields
