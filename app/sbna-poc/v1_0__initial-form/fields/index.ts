import accommodationFields from './accommodation'
import employmentEducationFields from './employment-education'
import financeFields from './finance'
import drugFields from './drugs'
import alcoholFields from './alcohol'
import healthAndWellbeingFields from './health-wellbeing'
import thinkingBehavioursAttitudes from './thinking-behaviours-attitudes'
import personalRelationshipsAndCommunityFields from './personal-relationships-community'

export default {
  ...accommodationFields,
  ...employmentEducationFields,
  ...financeFields,
  ...drugFields,
  ...alcoholFields,
  ...healthAndWellbeingFields,
  ...thinkingBehavioursAttitudes,
  ...personalRelationshipsAndCommunityFields,
}
