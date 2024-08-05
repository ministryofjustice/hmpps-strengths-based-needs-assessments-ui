// Require app insights before anything else to allow for instrumentation of bunyan and express
import 'applicationinsights'

import { app, metricsApp } from './server/index'
import logger from './logger'

const server = app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})

server.keepAliveTimeout = 30000

logger.info(`Keep alive timeout: ${server.keepAliveTimeout}`)
logger.info(`Max connections: ${server.maxConnections}`)
logger.info(`Max reqs per socket: ${server.maxRequestsPerSocket}`)

metricsApp.listen(metricsApp.get('port'), () => {
  logger.info(`Metrics server listening on port ${metricsApp.get('port')}`)
})
