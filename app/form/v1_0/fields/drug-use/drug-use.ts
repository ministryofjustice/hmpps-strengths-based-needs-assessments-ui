import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import { utils } from '../common'

export default {
  drugUse: {
    text: 'Has [subject] ever misused drugs?',
    code: 'drug_use',
    type: FieldType.Radio,
    hint: {
      text: 'This includes illegal and prescription drugs.',
      kind: 'text',
    },
    validate: [{ type: ValidationType.Required, message: "Select if they've ever misused drugs" }],
    options: utils.yesNoOptions,
    labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
  },
}
