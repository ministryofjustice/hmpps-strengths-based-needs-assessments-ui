import FormWizard from 'hmpo-form-wizard'
import { trackEvent } from '../utils/azureAppInsights'

export const enum EventType {
  VALIDATION_ERROR = 'ValidationError',
}

export function sendTelemetryEventForValidationError(
  err: FormWizard.Controller.Errors,
  formVersion: string,
  autosaved: boolean,
) {
  Object.entries(err).forEach(([fieldCode, validationError]) => {
    if (!autosaved) {
      trackEvent(EventType.VALIDATION_ERROR, {
        formVersion,
        fieldCode,
        validationError: validationError.type,
      })
    }
  })
}
