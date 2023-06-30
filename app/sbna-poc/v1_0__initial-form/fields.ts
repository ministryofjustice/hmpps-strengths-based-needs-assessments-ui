import FormWizard, { FieldType } from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  current_accommodation: {
    text: "What is [subject]'s current accommodation?",
    code: 'current_accommodation',
    type: FieldType.Radio,
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
    dependent: {
      field: 'current_accommodation',
      value: 'settled',
    },
  },
}

export default fields
