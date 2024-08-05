// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'

import { app, metricsApp } from './server/index'
import logger from './logger'

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
}).keepAliveTimeout = Number.parseInt(process.env.KEEP_ALIVE || "5000")

metricsApp.listen(metricsApp.get('port'), () => {
  logger.info(`Metrics server listening on port ${metricsApp.get('port')}`)
})
