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
          assessmentVersion: { uuid: 'a2', updatedAt: '2025-07-03T10:00:00Z', status: 'DRAFT' },
        },
        '2025-07-01': {
          assessmentVersion: { uuid: 'a0', updatedAt: '2025-07-01T08:00:00Z', status: 'DRAFT' },
        },
      },
      countersignedVersions: {},
    })

    await controller.locals(req, res, next)

    expect(getVersionsByEntityId).toHaveBeenCalledWith('assessment-123')

    //  Current version (from allVersions, which excludes countersigned versions)
    expect(res.locals.currentVersion).toEqual({
      assessmentVersion: { uuid: 'a2', updatedAt: '2025-07-03T10:00:00Z', status: 'DRAFT' },
    })

    // Previous versions should be in descending order and not include the current version
    expect(res.locals.previousVersions.map((version: LastVersionsOnDate) => version.assessmentVersion?.uuid)).toEqual([
      'a0',
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
