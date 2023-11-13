import accommodationFields from './accommodation'
import financeFields from './finance'
import drugFields from './drugs'
import alcoholFields from './alcohol'

export default {
  ...accommodationFields,
  ...financeFields,
  ...drugFields,
  ...alcoholFields,
}
