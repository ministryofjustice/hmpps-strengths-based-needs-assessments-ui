import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js'

document.initialiseTelemetry = (
  applicationInsightsConnectionString,
  applicationInsightsRoleName,
  coreTelemetryData,
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
    envelope.data['ASSESSMENT_ID'] = coreTelemetryData.assessmentId
    envelope.data['ASSESSMENT_VERSION'] = coreTelemetryData.assessmentVersion.toString()
    envelope.data['SECTION_CODE'] = coreTelemetryData.sectionCode
    envelope.data['USER_ID'] = coreTelemetryData.user
    envelope.data['HANDOVER_SESSION_ID'] = coreTelemetryData.handoverSessionId
    envelope.data['FORM_VERSION'] = coreTelemetryData.formVersion.split(':')[1] || 'Unknown'
  }

  appInsights.loadAppInsights()
  appInsights.addTelemetryInitializer(telemetryInitializer)
  appInsights.trackPageView()

  const trackEvent = ({ name }) => {
    console.log(`Sending telemetry event: ${name}`)
    appInsights.trackEvent({ name })
  }

  document.addEventListener('AutoSaved', () => {
    trackEvent({ name: 'AUTOSAVED' })
  })
}
