import FormWizard from 'hmpo-form-wizard'
import { FieldsFactory, utils } from '../common'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import sections from '../../config/sections'
import { dependentOn } from '../common/utils'

class DrugUseHistoryFieldsFactory extends FieldsFactory {
  drugsReasonsForUse: FormWizard.Field = {
    text: 'Why does [subject] use drugs?',
    hint: { text: 'Consider why they started using, their history, any triggers.', kind: 'text' },
    code: 'drugs_reasons_for_use',
    type: FieldType.CheckBox,
    multiple: true,
    validate: [{ type: ValidationType.Required, message: 'Select why they drink alcohol' }],
    options: [
      { text: 'Cultural or religious practice', value: 'CULTURAL_OR_RELIGIOUS', kind: 'option' },
      { text: 'Curiosity or experimentation', value: 'CURIOSITY_OR_EXPERIMENTATION', kind: 'option' },
      { text: 'Enhance performance', value: 'ENHANCE_PERFORMANCE', kind: 'option' },
      { text: 'Escapism or avoidance', value: 'ESCAPISM_OR_AVOIDANCE', kind: 'option' },
      { text: 'Manage stress or emotional issues', value: 'MANAGING_EMOTIONAL_ISSUES', kind: 'option' },
      { text: 'Peer pressure or social influence', value: 'PEER_PRESSURE', kind: 'option' },
      { text: 'Recreation or pleasure', value: 'RECREATION_OR_PLEASURE', kind: 'option' },
      { text: 'Self-medication', value: 'SELF_MEDICATION', kind: 'option' },
      { text: 'Other', value: 'OTHER', kind: 'option' },
    ],
    labelClasses: utils.getMediumLabelClassFor(FieldType.CheckBox),
  }

  drugsReasonsForUseDetails: FormWizard.Field = FieldsFactory.detailsField({
    parentField: this.drugsReasonsForUse,
    dependentValue: 'YES',
  })
}
