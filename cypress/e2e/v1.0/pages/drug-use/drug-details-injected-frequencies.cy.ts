import { drugs } from './common/drugs'
import drugUsedInTheLastSixMonths from './questions/drugUsedInTheLastSixMonths'
import {
  drugDetailsInjectedBefore,
  drugDetailsInjectedBeforeEach,
  stepUrl,
  summaryPage,
} from './common/drug-details-injected-setup'

describe('/drug-details-injected frequencies', () => {
  before(drugDetailsInjectedBefore())
  beforeEach(drugDetailsInjectedBeforeEach())

  // verifies drug usage frequencies and summary page contents
  drugs.forEach(({ name: drug, injectable }) => {
    drugUsedInTheLastSixMonths(drug, injectable, stepUrl, summaryPage)
  })
})
