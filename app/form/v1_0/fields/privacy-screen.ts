import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../../../server/@types/hmpo-form-wizard/enums'
import { utils } from './common'

export const privacyScreenDeclaration = (): FormWizard.Field => ({
  text: `Remember to close anything you do not need before starting an appointment with [subject]`,
  code: 'privacy_screen_declaration',
  type: FieldType.CheckBox,
  validate: [
    {
      type: ValidationType.Required,
      message: "Confirm you'll close anything you do not need before starting an appointment",
    },
  ],
  options: [
    {
      text: "I confirm I'll close anything I do not need before starting an appointment",
      value: 'AGREE',
      kind: 'option',
    },
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
})

export default {
  privacyScreenDeclaration,
}
