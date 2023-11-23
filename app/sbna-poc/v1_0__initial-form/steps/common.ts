import FormWizard from 'hmpo-form-wizard'

export const setFieldWhenValid = (fieldCode: string, valueWhenValid: string, valueWhenInvalid: string) => ({
  fieldCode,
  conditionFn: (passedValidation: boolean) => (passedValidation ? valueWhenValid : valueWhenInvalid),
})

export const setField = (fieldCode: string, value: string) => ({ fieldCode, conditionFn: () => value })

export const fieldCodesFrom = (...fields: Array<Array<FormWizard.Field>>): Array<string> =>
  fields.flat().map(it => it.id || it.code)
