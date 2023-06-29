import FormWizard, { FieldType } from 'hmpo-form-wizard'

const fields: FormWizard.Fields = {
  current_accommodation: {
    text: "What is Paul's current accommodation?",
    code: 'current_accommodation',
    type: FieldType.Radio,
    options: [
      { text: 'Settled', value: 'settled' },
      { text: 'Temporary', value: 'temporary' },
      { text: 'No accommodation', value: 'no_accommodation' },
    ],
  },
}

export default fields
