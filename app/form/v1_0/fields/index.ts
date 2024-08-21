import FormWizard from 'hmpo-form-wizard'
import { utils } from './common'
import { FieldType } from '../../../../server/@types/hmpo-form-wizard/enums'
import { SectionConfig } from '../config/sections'

export const assessmentComplete: FormWizard.Field = {
  text: 'Is the assessment complete?',
  code: 'assessment_complete',
  type: FieldType.Radio,
  hidden: true,
  options: utils.yesNoOptions,
}

const toFormWizardFields = (allFields: FormWizard.Fields, field: FormWizard.Field): FormWizard.Fields => ({
  ...allFields,
  [field.id || field.code]: field,
})

export default function buildFields(sectionConfigs: SectionConfig[]): FormWizard.Fields {
  return {
    [assessmentComplete.code]: assessmentComplete,
    ...sectionConfigs
      .flatMap(section => section.steps)
      .flatMap(step => step.fields)
      .filter(it => it)
      .reduce(toFormWizardFields, {}),
  }
}
