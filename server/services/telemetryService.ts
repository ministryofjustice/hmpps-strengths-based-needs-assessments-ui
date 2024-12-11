import FormWizard from 'hmpo-form-wizard'
import { trackEvent } from '../utils/azureAppInsights'

export const enum EventType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export function sendTelemetryEventForValidationError(
  err: FormWizard.Controller.Errors,  
  autosaved: boolean,
  coreTelemetryData: FormWizard.CoreTelemetryData,
) {
  Object.entries(err).forEach(([fieldCode, validationError]) => {
    if (!autosaved) {
      trackEvent(EventType.VALIDATION_ERROR, {
        ASSESSMENT_ID: coreTelemetryData.assessmentId,
        ASSESSMENT_VERSION: coreTelemetryData.assessmentVersion.toString(),
        SECTION_CODE: coreTelemetryData.section,
        USER_ID: coreTelemetryData.user,
        HANDOVER_SESSION_ID: coreTelemetryData.handoverSessionId,
        FORM_VERSION: coreTelemetryData.formVersion.split(':')[1] || 'Unknown',
        FIELD_CODE: fieldCode,
        VALIDATION_ERROR_TYPE: validationError.type,
      })
    }
  })
}
