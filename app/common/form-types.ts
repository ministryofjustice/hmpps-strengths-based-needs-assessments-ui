import FormWizard from 'hmpo-form-wizard'

export type FormOptions = {
  version: string
  active: boolean
}

export type Form = {
  fields: FormWizard.Fields
  steps: FormWizard.Steps
  options: FormOptions
}

export type BaseFormOptions = {
  journeyName: string
  journeyTitle: string
  entryPoint?: boolean
}
