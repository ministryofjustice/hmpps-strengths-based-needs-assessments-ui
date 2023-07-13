import logger from '../logger'
import { resetStubs } from './helpers'
import mockStrengthBasedNeedsApi from './mocks/strengthsBasedNeedsApi'

resetStubs()
  .then(() => mockStrengthBasedNeedsApi())
  .then(() => logger.info('Successfully created Wiremock stubs'))
  .catch((error: Error) => logger.error(`Failed to create Wiremock stubs, cause: ${error.message}`))
