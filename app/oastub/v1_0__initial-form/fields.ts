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
}

export default fields
