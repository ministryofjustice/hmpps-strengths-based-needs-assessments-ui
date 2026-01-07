import { drugs } from './common/drugs'
import drugUsedInTheLastSixMonths from './questions/drugUsedInTheLastSixMonths'
import {
  drugDetailsInjectedBefore,
  drugDetailsInjectedBeforeEach,
  questions,
  stepUrl,
  summaryPage,
} from './common/drug-details-injected-setup'

describe('/drug-details-injected frequencies', () => {
  before(drugDetailsInjectedBefore(stepUrl, questions))
  beforeEach(drugDetailsInjectedBeforeEach(stepUrl))

  // verifies drug usage frequencies and summary page contents
  drugs.forEach(({ name: drug, injectable }) => {
    drugUsedInTheLastSixMonths(drug, injectable, stepUrl, summaryPage)
  })
})
