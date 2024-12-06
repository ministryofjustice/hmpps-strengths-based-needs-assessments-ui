import testDrugUsageDetails from './common/testDrugUsageDetails'
import { drugsPart3 } from './common/drugs'

describe('/select-drugs - Part 3', () => {
  drugsPart3.forEach(testDrugUsageDetails)
})
