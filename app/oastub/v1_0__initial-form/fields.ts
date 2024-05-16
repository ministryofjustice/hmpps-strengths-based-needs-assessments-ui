import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  'oastub-assessment-uuid': {
    code: 'oastub-assessment-uuid',
    text: 'Assessment ID',
    hint: {
      text: 'These are randomly generated for the purpose of stubbing out. In order to return to an assessment take note of the initial assessment ID and use it again here instead of the default random ID',
      kind: 'text',
    },
    type: FieldType.Text,
    validate: [{ type: ValidationType.Required, message: 'Assessment ID is required' }],
  },
  'oastub-subject-given-name': {
    code: 'oastub-subject-given-name',
    text: 'Given name',
    type: FieldType.Text,
    validate: [{ type: ValidationType.Required, message: 'Given name is required' }],
  },
  'oastub-subject-family-name': {
    code: 'oastub-subject-family-name',
    text: 'Family name',
    type: FieldType.Text,
    validate: [{ type: ValidationType.Required, message: 'Family name is required' }],
  },
  'oastub-subject-gender': {
    code: 'oastub-subject-gender',
    text: 'Gender',
    hint: {
      text: 'Questions in the assessment are conditional to the subjects gender',
      kind: 'text',
    },
    options: [
      { text: 'Not specified', value: '9', kind: 'option' },
      { text: 'Not known', value: '0', kind: 'option' },
      { text: 'Male', value: '1', kind: 'option' },
      { text: 'Female', value: '2', kind: 'option' },
    ],
    type: FieldType.Dropdown,
  },
  'oastub-subject-sexually-motivated-offence-history': {
    code: 'oastub-subject-sexually-motivated-offence-history',
    text: 'Do they have a sexually motivated offence history?',
    hint: {
      text: 'Questions in the assessment are conditional on whether the subject has a sexually motivated offence history',
      kind: 'text',
    },
    options: [
      { text: 'No', value: 'NO', kind: 'option' },
      { text: 'Yes', value: 'YES', kind: 'option' },
    ],
    type: FieldType.Dropdown,
    validate: [
      { type: ValidationType.Required, message: 'Answer whether the subject has a sexually motivated offence history' },
    ],
  },
}

export default fields
