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

export const whenField = (field: string) => ({
  includes: (values: string[]) => ({
    thenGoNext: (next: FormWizard.Step.NextStep) =>
      values.map(it => ({ field, value: it, next }) as FormWizard.Step.NextStep),
  }),
})

export const contains: FormWizard.Step.Op = (fieldValues: string[], req, res, con) =>
  fieldValues?.includes(con.value) === true
