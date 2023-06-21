import FormWizard from 'hmpo-form-wizard'
import { Form, BaseFormOptions } from '../common'

export default class FormFieldsResponse {
  name: string

  title: string

  version: string

  fields: FormWizard.Fields

  static from(form: Form, options: BaseFormOptions): FormFieldsResponse {
    return {
      name: options.journeyName,
      title: options.journeyTitle,
      version: form.options.version,
      fields: form.fields,
    }
  }
}
