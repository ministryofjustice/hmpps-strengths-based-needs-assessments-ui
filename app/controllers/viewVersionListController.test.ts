import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import ViewVersionListController from './viewVersionListController'
import SaveAndContinueController from './saveAndContinueController'
import { LastVersionsOnDate } from '../../server/services/arnsCoordinatorApiService'

describe('ViewVersionListController.locals', () => {
  let controller: ViewVersionListController
  let req: FormWizard.Request
  let res: Response
  let next: NextFunction

  const getVersionsByEntityId = jest.fn()

  beforeEach(() => {
    controller = new ViewVersionListController({ route: '/' })
    // @ts-expect-error overriding for test
    controller.service = { getVersionsByEntityId }

    req = {
      session: {
        sessionData: { assessmentId: 'assessment-123' },
      },
    } as unknown as FormWizard.Request

    res = { locals: {} } as unknown as Response
    next = jest.fn()

    jest.spyOn(SaveAndContinueController.prototype, 'locals').mockResolvedValue(undefined)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('should fetch versions, maps current and previous versions and set locals correctly', async () => {
    // Given versions keyed by date, latest non-countersigned (2025-07-03) is the current version
    getVersionsByEntityId.mockResolvedValue({
      allVersions: {
        '2025-07-03': {
          planVersion: {
            uuid: 'p2',
            updatedAt: '2025-07-03T11:00:00Z',
            status: 'DRAFT',
            planAgreementStatus: 'AGREED',
          },
          assessmentVersion: { uuid: 'a2', updatedAt: '2025-07-03T10:00:00Z', status: 'DRAFT' },
          description: 'Assessment and plan updated',
        },
        '2025-07-01': {
          planVersion: {
            uuid: 'p0',
            updatedAt: '2025-07-01T08:30:00Z',
            status: 'LOCKED_INCOMPLETE',
            planAgreementStatus: 'DRAFT',
          },
          assessmentVersion: { uuid: 'a0', updatedAt: '2025-07-01T08:00:00Z', status: 'DRAFT' },
          description: 'Assessment and plan updated',
        },
      },
      countersignedVersions: {
        '2025-07-04': {
          planVersion: {
            uuid: 'p3',
            updatedAt: '2025-07-04T11:00:00Z',
            status: 'COUNTERSIGNED',
            planAgreementStatus: 'AGREED',
          },
          assessmentVersion: { uuid: 'a3', updatedAt: '2025-07-04T10:00:00Z', status: 'COUNTERSIGNED' },
          description: 'Assessment and plan updated',
        },
        '2025-07-02': {
          planVersion: {
            uuid: 'p1',
            updatedAt: '2025-07-02T09:30:00Z',
            status: 'DOUBLE_COUNTERSIGNED',
            planAgreementStatus: 'DO_NOT_AGREE',
          },
          assessmentVersion: { uuid: 'a1', updatedAt: '2025-07-02T09:00:00Z', status: 'DOUBLE_COUNTERSIGNED' },
          description: 'Assessment and plan updated',
        },
      },
    })

    await controller.locals(req, res, next)

    expect(getVersionsByEntityId).toHaveBeenCalledWith('assessment-123')

    //  Current version (from allVersions, which excludes countersigned versions)
    expect(res.locals.currentVersion).toEqual({
      planVersion: expect.objectContaining({
        uuid: 'p2',
        status: 'DRAFT',
        planAgreementStatus: 'AGREED',
        planAgreementStatusText: 'Plan Agreed',
        planAgreementStatusClass: 'govuk-tag--green',
        showPlanAgreementStatus: true,
        countersignedStatusText: '',
        countersignedStatusClass: '',
        showCountersignedStatus: false,
      }),
      assessmentVersion: { uuid: 'a2', updatedAt: '2025-07-03T10:00:00Z', status: 'DRAFT' },
      description: 'Assessment and plan updated',
    })

    // Previous versions should be in descending order and not include the current version
    expect(res.locals.previousVersions.map((version: LastVersionsOnDate) => version.assessmentVersion?.uuid)).toEqual([
      'a0',
    ])

    // Countersigned versions from countersignedVersions response
    expect(res.locals.countersignedVersions.map((version: LastVersionsOnDate) => version.planVersion?.uuid)).toEqual([
      'p3',
      'p1',
    ])

    // Should call parent locals
    expect(SaveAndContinueController.prototype.locals).toHaveBeenCalledTimes(1)
  })

  it('should pass API errors to next', async () => {
    const error = new Error('TEST API error')
    getVersionsByEntityId.mockRejectedValue(error)

    await controller.locals(req, res, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})
