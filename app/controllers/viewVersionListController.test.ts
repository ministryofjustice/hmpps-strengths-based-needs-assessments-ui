import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import ViewVersionListController from './viewVersionListController'
import CoordinatorApiService, { VersionsResponse } from '../../server/services/coordinatorService'
import { SessionData } from '../../server/services/strengthsBasedNeedsService'

jest.mock('../../server/services/coordinatorService')

describe('ViewVersionListController', () => {
  const mockFetchAssessmentAndPlanVersions = jest.fn()

  beforeEach(() => {
    ;(CoordinatorApiService as jest.Mock).mockImplementation(() => ({
      fetchAssessmentAndPlanVersions: mockFetchAssessmentAndPlanVersions,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('viewVersionListController.locals', () => {
    it('should fetch assessment and plan versions and sets values in locals correctly.', async () => {
      const mockAssessmentUuid = crypto.randomUUID()
      const mockVersionsResponse: VersionsResponse = {
        versions: {
          '2025-07-03': {
            description: 'Test description',
            assessmentVersions: [
              {
                uuid: crypto.randomUUID(),
                version: 2,
                createdAt: '2025-07-03T10:00:00Z',
                updatedAt: '2025-07-03T11:00:00Z',
                status: 'Assessment change status 2',
                entityType: 'ASSESSMENT',
              },
              {
                uuid: crypto.randomUUID(),
                version: 1,
                createdAt: '2025-07-03T09:00:00Z',
                updatedAt: '2025-07-03T09:30:00Z',
                status: 'Assessment change status 1',
                entityType: 'ASSESSMENT',
              },
            ],
            planVersions: [
              {
                uuid: crypto.randomUUID(),
                version: 2,
                createdAt: '2025-07-03T07:00:00Z',
                updatedAt: '2025-07-03T07:30:00Z',
                status: 'Plan change status 2',
                entityType: 'PLAN',
              },
              {
                uuid: crypto.randomUUID(),
                version: 1,
                createdAt: '2025-07-03T06:00:00Z',
                updatedAt: '2025-07-03T06:30:00Z',
                status: 'Plan change status 1',
                entityType: 'PLAN',
              },
            ],
          },
        },
      }

      mockFetchAssessmentAndPlanVersions.mockResolvedValue(mockVersionsResponse)

      const req = {
        session: {
          sessionData: { assessmentId: mockAssessmentUuid } as SessionData,
        },
      } as unknown as FormWizard.Request

      const res = {
        locals: {},
      } as unknown as Response

      const next = jest.fn() as NextFunction

      const controller = new ViewVersionListController({ route: '/' })

      await controller.locals(req, res, next)

      expect(mockFetchAssessmentAndPlanVersions).toHaveBeenCalledWith(mockAssessmentUuid)
      expect(res.locals.previousVersions).toEqual(mockVersionsResponse)
    })

    it('should pass API errors to next', async () => {
      const mockError = new Error('TEST API error')

      mockFetchAssessmentAndPlanVersions.mockRejectedValue(mockError)

      const req = {
        session: {
          sessionData: { assessmentId: 'wrongUUID' } as SessionData,
        },
      } as unknown as FormWizard.Request

      const res = {
        locals: {},
      } as unknown as Response

      const next = jest.fn() as NextFunction

      const controller = new ViewVersionListController({ route: '/' })

      await controller.locals(req, res, next)

      expect(next).toHaveBeenCalledTimes(1)
      expect(next).toHaveBeenCalledWith(mockError)
    })
  })
})
