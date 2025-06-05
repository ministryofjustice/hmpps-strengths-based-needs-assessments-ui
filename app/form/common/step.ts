import FormWizard from 'hmpo-form-wizard';

export interface SanStep extends FormWizard.BaseStep {
  url: string
  pageTitle?: string
  fields?: FormWizard.Field[]
}
