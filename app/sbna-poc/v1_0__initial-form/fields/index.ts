import accommodationFields from './accommodation'
import employmentEducationFields from './employment-education'
import financeFields from './finance'
import drugFields from './drugs'
import alcoholFields from './alcohol'
import healthAndWellbeingFields from './health-wellbeing'
import thinkingBehavioursAndAttitudes from './thinking-behaviours-attitudes'

export default {
  ...accommodationFields,
  ...employmentEducationFields,
  ...financeFields,
  ...drugFields,
  ...alcoholFields,
  ...healthAndWellbeingFields,
  ...thinkingBehavioursAndAttitudes,
}
