import FormWizard, { FieldType } from 'hmpo-form-wizard'
import accommodationFields from './accommodation'
import employmentEducationFields from './employment-education'
import financeFields from './finance'
import drugFields from './drugs'
import alcoholFields from './alcohol'
import healthAndWellbeingFields from './health-wellbeing'
import thinkingBehavioursAttitudes from './thinking-behaviours-attitudes'
import personalRelationshipsAndCommunityFields from './personal-relationships-community'
import offenceAnalysisField from './offence-analysis'
import { yesNoOptions } from './common'

export const assessmentComplete: FormWizard.Field = {
  text: 'Is the assessment complete?',
  code: 'assessment_complete',
  type: FieldType.Radio,
  options: yesNoOptions,
}

export default {
  [assessmentComplete.code]: assessmentComplete,
  ...accommodationFields,
  ...employmentEducationFields,
  ...financeFields,
  ...drugFields,
  ...alcoholFields,
  ...healthAndWellbeingFields,
  ...thinkingBehavioursAttitudes,
  ...personalRelationshipsAndCommunityFields,
  ...offenceAnalysisField,
}
