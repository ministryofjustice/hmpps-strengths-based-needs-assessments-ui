import FormWizard from 'hmpo-form-wizard'
import { FieldType, ValidationType } from '../../../../../server/@types/hmpo-form-wizard/enums'
import { utils } from '../common'

const drugsPractitionerAnalysisMotivatedToStop: FormWizard.Field = {
  text: `Does [subject] seem motivated to stop or reduce their drug use?`,
  code: `temp_drug_use_practitioner_analysis_motivated_to_stop`,
  type: FieldType.Radio,
  validate: [{ type: ValidationType.Required, message: 'Select if there are any strengths or protective factors' }],
  options: [
    { text: 'Does not show motivation to stop or reduce', value: 'NO_MOTIVATION', kind: 'option' },
    { text: 'Shows some motivation to stop or reduce ', value: 'PARTIAL_MOTIVATION', kind: 'option' },
    { text: 'Motivated to stop or reduce', value: 'FULL_MOTIVATION', kind: 'option' },
    { text: 'Unknown', value: 'UNKNOWN', kind: 'option', checked: true }, // TODO: Need to uncheck this dynamically
  ],
  labelClasses: utils.getMediumLabelClassFor(FieldType.Radio),
}

export default {
  drugsPractitionerAnalysisMotivatedToStop,
}
