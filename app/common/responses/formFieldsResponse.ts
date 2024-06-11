import FormWizard from 'hmpo-form-wizard'
import { BaseFormOptions, Form } from '../form-types'

export default class FormFieldsResponse {
  name: string

  title: string

  version: string

  fields: FormWizard.Fields

  static from(form: Form, options: BaseFormOptions): FormFieldsResponse {
    return {
      // TODO: clean-up - remove
      name: 'sbna-poc',
      title: options.journeyTitle,
      version: form.options.version,
      fields: form.fields,
    }
  }
}
