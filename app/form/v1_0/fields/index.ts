import FormWizard from 'hmpo-form-wizard'
import { utils } from './common'
import { FieldType } from '../../../../server/@types/hmpo-form-wizard/enums'

import { SectionConfig } from '../../common/section';

export const assessmentComplete: FormWizard.Field = {
  text: 'Is the assessment complete?',
  code: 'assessment_complete',
  type: FieldType.Radio,
  hidden: true,
  options: utils.yesNoOptions,
  section: 'assessment',
}

export const toFormWizardFields =
  (sectionCode: string) =>
  (allFields: FormWizard.Fields, field: FormWizard.Field): FormWizard.Fields => ({
    ...allFields,
    [field.id || field.code]: { ...field, section: sectionCode },
  })

export default function buildFields(sectionConfigs: SectionConfig[]): FormWizard.Fields {
  return {
    [assessmentComplete.code]: assessmentComplete,
    ...sectionConfigs.reduce(
      (acc, { steps, section }) => ({
        ...acc,
        ...steps
          .flatMap(step => step.fields)
          .filter(Boolean)
          .reduce(toFormWizardFields(section.code), {}),
      }),
      {},
    ),
  }
}
