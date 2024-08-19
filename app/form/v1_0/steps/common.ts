import FormWizard from 'hmpo-form-wizard'

export interface SanStep extends FormWizard.BaseStep {
  url: string
  pageTitle?: string
  fields?: FormWizard.Field[]
}

export const setFieldToCompleteWhenValid = (fieldCode: string) => ({
  fieldCode,
  conditionFn: (passedValidation: boolean) => passedValidation,
})

export const setFieldToIncomplete = (fieldCode: string) => ({ fieldCode, conditionFn: () => false })

export const fieldCodesFrom = (...fields: Array<Array<FormWizard.Field>>): Array<string> =>
  fields.flat().map(it => it.id || it.code)

export const contains: FormWizard.Step.Op = (fieldValues: string[], req, res, con) =>
  fieldValues?.includes(con.value) === true

export const nextWhen = (
  field: FormWizard.Field,
  option: string | string[],
  next: FormWizard.Step.NextStep,
): FormWizard.Step.NextStep => {
  const optionArray = Array.isArray(option) ? option : [option]

  const includesOption = (requiredOption: string) =>
    field.options.findIndex(o => o.kind === 'option' && o.value === requiredOption) !== -1

  if (!Array.isArray(field.options) || !optionArray.every(includesOption)) {
    throw Error(`Failed to create next route, target field "${field.code}" does not contain the option "${option}"`)
  }

  const nextStep: FormWizard.Step.NextStep = {
    field: field.code,
    value: option,
    next,
  }

  if (optionArray.length > 1) {
    nextStep.op = 'in'
  }

  return nextStep
}
