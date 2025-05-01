import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../../config/sections'
import { dependentOn } from '../common/utils'

class DrugUseHistoryFieldsFactory extends FieldsFactory {
  drugsReasonsForUse: FormWizard.Field = {
    text: 'Why does [subject] drink alcohol?',
    hint: { text: 'Select all that apply.', kind: 'text' },
    code: 'alcohol_reasons_for_use',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they drink alcohol' }],
    options: [
      { text: 'Cultural or religious practice', value: 'CULTURAL_OR_RELIGIOUS', kind: 'option' },
      { text: 'Curiosity or experimentation', value: 'CURIOSITY_OR_EXPERIMENTATION', kind: 'option' },
      { text: 'Enjoyment', value: 'ENJOYMENT', kind: 'option' },
      { text: 'Manage stress or emotional issues', value: 'MANAGING_EMOTIONAL_ISSUES', kind: 'option' },
      { text: 'On special occasions', value: 'SPECIAL_OCCASIONS', kind: 'option' },
      { text: 'Peer pressure or social influence', value: 'PEER_PRESSURE', kind: 'option' },
      {
        text: 'Self-medication or mood altering',
        hint: { text: 'Includes pain management or emotional regulation.' },
        value: 'SELF_MEDICATION',
        kind: 'option',
      },
      { text: 'Socially', value: 'SOCIAL', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }
}
