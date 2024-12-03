// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'
import { initialiseAppInsights, buildAppInsightsClient } from './server/utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

const init = async () => {
  const { initApp, initMetricsApp } = await import('./server/index')
  const logger = (await import('./logger')).default

  const app = initApp()
  const metricsApp = initMetricsApp()

  app.listen(app.get('port'), () => {
    logger.info(`Server listening on port ${app.get('port')}`)
  }).keepAliveTimeout = Number.parseInt(process.env.KEEP_ALIVE || '5000', 10)

  metricsApp.listen(metricsApp.get('port'), () => {
    logger.info(`Metrics server listening on port ${metricsApp.get('port')}`)
  })
}

init()
