import FormWizard from 'hmpo-form-wizard'
import { FieldType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import { utils } from '../common'
import { dependentOn, requiredWhenValidator } from '../common/fieldUtils'
import drugUse from './drug-use'

const drugsPractitionerAnalysisMotivatedToStop: FormWizard.Field = {
  text: `Does [subject] seem motivated to stop or reduce their drug use?`,
  code: `drugs_practitioner_analysis_motivated_to_stop`,
  type: FieldType.Radio,
  validate: [
    {
      fn: requiredWhenValidator(drugUse.drugUse.code, 'assessment', 'YES'),
      message: 'Select if they seem motivated to stop or reduce their drug use',
    },
  ],
  options: [
    { text: 'Does not show motivation to stop or reduce', value: 'NO_MOTIVATION', kind: 'option' },
    { text: 'Shows some motivation to stop or reduce ', value: 'PARTIAL_MOTIVATION', kind: 'option' },
    { text: 'Motivated to stop or reduce', value: 'FULL_MOTIVATION', kind: 'option' },
    { text: 'Unknown', value: 'UNKNOWN', kind: 'option' },
  ],
  dependent: dependentOn(drugUse.drugUse, 'YES', false),
  labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
}

export default {
  drugsPractitionerAnalysisMotivatedToStop,
}
