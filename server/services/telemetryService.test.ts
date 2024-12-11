import FormWizard from 'hmpo-form-wizard'
import { EventType, sendTelemetryEventForValidationError } from './telemetryService'
import { trackEvent } from '../utils/azureAppInsights'
import { randomUUID } from 'crypto'

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

    const coreTelemetryData = {
      assessmentId: randomUUID().toString(),
      assessmentVersion: 0,
      user: 'foo-user',
      section: 'some-section-code',
      formVersion: 'Form:1.0',
      handoverSessionId: randomUUID().toString()
    }

    sendTelemetryEventForValidationError(errors, false, coreTelemetryData)

    expect(trackEvent).toHaveBeenCalledTimes(2)
    expect(trackEvent).toHaveBeenNthCalledWith(1, EventType.VALIDATION_ERROR, {
      ASSESSMENT_ID: coreTelemetryData.assessmentId,
      ASSESSMENT_VERSION: '0',
      SECTION_CODE: coreTelemetryData.section,
      USER_ID: coreTelemetryData.user,
      HANDOVER_SESSION_ID: coreTelemetryData.handoverSessionId,
      FORM_VERSION: '1.0',
      FIELD_CODE: 'first_field',
      VALIDATION_ERROR_TYPE: 'required',
    })
    expect(trackEvent).toHaveBeenNthCalledWith(2, EventType.VALIDATION_ERROR, {
      ASSESSMENT_ID: coreTelemetryData.assessmentId,
      ASSESSMENT_VERSION: '0',
      SECTION_CODE: coreTelemetryData.section,
      USER_ID: coreTelemetryData.user,
      HANDOVER_SESSION_ID: coreTelemetryData.handoverSessionId,
      FORM_VERSION: '1.0',
      FIELD_CODE: 'second_field',
      VALIDATION_ERROR_TYPE: 'date',
    })
  })

  it('does not send telemetry when errors are not present', () => {
    sendTelemetryEventForValidationError({}, false, {
      assessmentId: randomUUID().toString(),
      assessmentVersion: 0,
      user: 'foo-user',
      section: 'some-section-code',
      formVersion: 'Form:1.0',
      handoverSessionId: randomUUID().toString()
    })

    expect(trackEvent).toHaveBeenCalledTimes(0)
  })
})
