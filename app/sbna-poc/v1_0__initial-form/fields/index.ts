import accommodationFields from './accommodation'
import employmentEducationFields from './employment-education'
import financeFields from './finance'
import drugFields from './drugs'
import alcoholFields from './alcohol'

export default {
  ...accommodationFields,
  ...employmentEducationFields,
  ...financeFields,
  ...drugFields,
  ...alcoholFields,
}
