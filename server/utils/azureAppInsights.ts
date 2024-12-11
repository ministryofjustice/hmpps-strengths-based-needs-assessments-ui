import { setup, defaultClient, TelemetryClient, DistributedTracingModes } from 'applicationinsights'
import applicationVersion from '../applicationVersion'
import { EnvelopeTelemetry } from 'applicationinsights/out/Declarations/Contracts'

const appInsightsConnectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING

export function defaultName(): string {
  const {
    packageData: { name },
  } = applicationVersion
  return name
}

function version(): string {
  const { buildNumber } = applicationVersion
  return buildNumber
}

export function initialiseAppInsights(): void {
  if (appInsightsConnectionString) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function isAllowedPattern(s: string): boolean {
  return ![
    /GET \/assets\/.+/,
    /GET \/ping/,
    /GET \/metrics/,
    /GET \/health/,
  ].some(pattern => (typeof s === 'string') && pattern.test(s))
}

export function buildAppInsightsClient(name = defaultName()): TelemetryClient {
  if (appInsightsConnectionString) {
    defaultClient.context.tags[defaultClient.context.keys.cloudRole] = name
    defaultClient.context.tags[defaultClient.context.keys.applicationVersion] = version()

    // Ignore telemetry events for the following operations 
    // ideally we apply sampling here but that will require V3 of the SDK which doesn't currently support setting the cloud role name
    defaultClient.addTelemetryProcessor((envelope: EnvelopeTelemetry): boolean => {
      return isAllowedPattern(envelope.tags[defaultClient.context.keys.operationName])
    })

    return defaultClient
  }
  return null
}

export const trackEvent = (event: string, properties: Record<string, string>) => {
  if (appInsightsConnectionString) {
    defaultClient.trackEvent({
      name: event,
      properties,
    })
  }
}
