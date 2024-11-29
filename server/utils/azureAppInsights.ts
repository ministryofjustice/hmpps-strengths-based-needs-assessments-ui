import { setup, defaultClient, TelemetryClient, DistributedTracingModes } from 'applicationinsights'
import applicationVersion from '../applicationVersion'

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
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function buildAppInsightsClient(name = defaultName()): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags[defaultClient.context.keys.cloudRole] = name
    defaultClient.context.tags[defaultClient.context.keys.applicationVersion] = version()

    return defaultClient
  }
  return null
}

export const enum EventType {
  VALIDATION_ERROR = 'ValidationError',
}

export const trackEvent = (event: EventType, properties: Record<string, string>) => {
  defaultClient.trackEvent({
    name: event,
    properties,
  })
}
