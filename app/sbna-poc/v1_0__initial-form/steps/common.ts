import FormWizard from 'hmpo-form-wizard'

export const setFieldWhenValid = (fieldCode: string, valueWhenValid: string, valueWhenInvalid: string) => ({
  fieldCode,
  conditionFn: (passedValidation: boolean) => (passedValidation ? valueWhenValid : valueWhenInvalid),
})

export const setField = (fieldCode: string, value: string) => ({ fieldCode, conditionFn: () => value })

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
