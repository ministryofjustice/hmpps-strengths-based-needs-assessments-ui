import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

document.initialiseTelemetry = (
  applicationInsightsConnectionString,
  applicationInsightsRoleName,
  assessmentId,
  assessmentVersion,
  userId,
  sectionCode,
) => {
  if (!Boolean(applicationInsightsConnectionString)) {
    console.log('AppInsights not configured')
    return
  }

  console.log('Configuring AppInsights')

  const clickPluginInstance = new ClickAnalyticsPlugin()
  const clickPluginConfig = {
    autoCapture: true
  }

  const appInsights = new ApplicationInsights({
    config: {
      connectionString: applicationInsightsConnectionString,
      autoTrackPageVisitTime: true,
      // extensions: [clickPluginInstance],
      extensionConfig: {
        [clickPluginInstance.identifier]: clickPluginConfig
      },
    }
  })

  const telemetryInitializer = (envelope) => {
    envelope.tags["ai.cloud.role"] = applicationInsightsRoleName
    envelope.data['assessmentId'] = assessmentId
    envelope.data['assessmentVersion'] = assessmentVersion
    envelope.data['userId'] = userId
    envelope.data['sectionCode'] = sectionCode
  }

  appInsights.loadAppInsights()
  appInsights.addTelemetryInitializer(telemetryInitializer)
  appInsights.trackPageView()

  document.addEventListener('AutoSaved', () => {
    console.log('Sending telemetry event')
    appInsights.trackEvent({
      name: 'AutoSaved',
    })
  })
}
