import testDrugUsageDetails from './common/testDrugUsageDetails'
import { drugsPart5 } from './common/drugs'

describe('/select-drugs - Part 5', () => {
  drugsPart5.forEach(testDrugUsageDetails)
})
