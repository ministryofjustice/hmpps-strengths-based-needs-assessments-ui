import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

document.addEventListener('DOMContentLoaded', function () {
  const clickPluginInstance = new ClickAnalyticsPlugin()
  const clickPluginConfig = {
    autoCapture: true
  }

  const appInsights = new ApplicationInsights({ config: {
      connectionString: applicationInsightsConnectionString,
      autoTrackPageVisitTime: true,
      extensionConfig: {
        [clickPluginInstance.identifier]: clickPluginConfig
      },
    } })

  const telemetryInitializer = (envelope) => {
    envelope.tags["ai.cloud.role"] = applicationInsightsRoleName
  }

  appInsights.loadAppInsights()
  appInsights.addTelemetryInitializer(telemetryInitializer)
  appInsights.trackPageView()
})
