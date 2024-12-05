import FormWizard from 'hmpo-form-wizard'
import { sendTelemetryEventForValidationError } from './telemetryService'
import { trackEvent } from '../utils/azureAppInsights'

jest.mock('../utils/azureAppInsights')

describe('sendTelemetryEventForValidationError', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('sends a telemetry event for validation errors', () => {
    const errors = {
      first_field: {
        key: 'first_field',
        type: 'required',
        url: '/step',
        message: 'First field is required',
      } as FormWizard.Controller.Error,

      second_field: {
        key: 'second_field',
        type: 'date',
        url: '/step',
        message: 'Second field must be a valid date',
      } as FormWizard.Controller.Error,
    }

    sendTelemetryEventForValidationError(errors, 'Form:1.0', false)

    expect(trackEvent).toHaveBeenCalledTimes(2)
  })

  it('does not send telemetry when errors are not present', () => {
    sendTelemetryEventForValidationError({}, 'Form:1.0', false)

    expect(trackEvent).toHaveBeenCalledTimes(0)
  })
})
