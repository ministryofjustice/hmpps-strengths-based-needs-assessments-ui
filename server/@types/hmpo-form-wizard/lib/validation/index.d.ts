declare module 'hmpo-form-wizard/lib/validation' {
  import FormWizard from 'hmpo-form-wizard'

  type ValidationError = {
    key: string
    errorGroup: string
    type: string
    message: string
    arguments: Array<string>
  }

  type Context = {
    values: Record<string, string | string[]>
  }

  function validate(
    fields: FormWizard.Fields,
    key: string,
    value: string | string[],
    context: unknown,
  ): ValidationError | undefined
}
