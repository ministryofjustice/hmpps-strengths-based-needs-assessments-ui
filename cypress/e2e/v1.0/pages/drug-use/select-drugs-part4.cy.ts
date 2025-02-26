import testDrugUsageDetails from './common/testDrugUsageDetails'
import { drugsPart4 } from './common/drugs'

describe('/select-drugs - Part 4', () => {
  drugsPart4.forEach(testDrugUsageDetails)
})
