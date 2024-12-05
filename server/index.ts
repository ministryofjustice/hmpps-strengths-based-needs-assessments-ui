import promClient from 'prom-client'
import { createMetricsApp } from './monitoring/metricsApp'
import createApp from './app'

promClient.collectDefaultMetrics()

const initApp = createApp
const initMetricsApp = createMetricsApp

export { initApp, initMetricsApp }
