import { setup, defaultClient, TelemetryClient, DistributedTracingModes } from 'applicationinsights'
import applicationVersion from '../applicationVersion'

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

export function buildAppInsightsClient(name = defaultName()): TelemetryClient {
  if (appInsightsConnectionString) {
    defaultClient.context.tags[defaultClient.context.keys.cloudRole] = name
    defaultClient.context.tags[defaultClient.context.keys.applicationVersion] = version()

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
