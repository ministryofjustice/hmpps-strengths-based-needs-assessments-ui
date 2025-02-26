import testDrugUsageDetails from './common/testDrugUsageDetails'
import { drugsPart2 } from './common/drugs'

describe('/select-drugs - Part 2', () => {
  drugsPart2.forEach(testDrugUsageDetails)
})
