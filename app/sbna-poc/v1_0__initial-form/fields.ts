import FormWizard, { FieldType, ValidationType } from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  current_accommodation: {
    text: "What is [subject]'s current accommodation?",
    code: 'current_accommodation',
    type: FieldType.Radio,
    validate: [{ type: ValidationType.Required, message: 'Current accommodation is required' }],
    options: [
      { text: 'Settled', value: 'settled' },
      { text: 'Temporary', value: 'temporary' },
      { text: 'No accommodation', value: 'no_accommodation' },
    ],
  },
  settled_details: {
    text: 'Details',
    code: 'settled_details',
    type: FieldType.TextArea,
    validate: [{ type: ValidationType.Required, message: 'Details are required' }],
    dependent: {
      field: 'current_accommodation',
      value: 'settled',
    },
  },
}

export default fields
