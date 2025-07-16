import { NextFunction, Response } from 'express'
import FormWizard from 'hmpo-form-wizard'
import ViewVersionListController from './viewVersionListController'
import StrengthsBasedNeedsAssessmentsApiService, {
  SessionData,
  AssessmentVersionsResponse,
} from '../../server/services/strengthsBasedNeedsService'

jest.mock('../../server/services/strengthsBasedNeedsService')

describe('ViewVersionListController', () => {
  const mockFetchAssessmentVersions = jest.fn()

  beforeEach(() => {
    ;(StrengthsBasedNeedsAssessmentsApiService as jest.Mock).mockImplementation(() => ({
      fetchAssessmentVersions: mockFetchAssessmentVersions,
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('viewVersionListController.locals', () => {
    it('should fetch assessment versions and sets values in locals correctly.', async () => {
      const mockAssessmentUuid = crypto.randomUUID()
      const mockVersionsResponse: AssessmentVersionsResponse = [
        {
          uuid: 'fb92fa0a-31a4-44d3-8cd2-e45a57671c8d',
          versionNumber: 3,
          createdAt: '2025-07-04T10:00:00Z',
          updatedAt: '2025-07-04T11:00:00Z',
          tag: 'Assessment change status 2',
        },
        {
          uuid: 'ad4b8d05-12a3-4556-a4ed-4fc65bb6dd25',
          versionNumber: 2,
          createdAt: '2025-07-03T10:00:00Z',
          updatedAt: '2025-07-03T11:00:00Z',
          tag: 'Assessment change status 2',
        },
        {
          uuid: '7597b07b-8bcc-4250-93eb-31614d7c6516',
          versionNumber: 1,
          createdAt: '2025-07-03T09:00:00Z',
          updatedAt: '2025-07-03T09:30:00Z',
          tag: 'Assessment change status 1',
        },
        {
          uuid: '82c1af99-0efb-44f1-ae64-0e3506e3ab5f',
          versionNumber: 0,
          createdAt: '2025-07-02T09:00:00Z',
          updatedAt: '2025-07-02T09:30:00Z',
          tag: 'Assessment change status 1',
        },
      ]

      mockFetchAssessmentVersions.mockResolvedValue(mockVersionsResponse)

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

      expect(mockFetchAssessmentVersions).toHaveBeenCalledWith(mockAssessmentUuid)

      const expectedVersions: AssessmentVersionsResponse = [
        {
          uuid: 'ad4b8d05-12a3-4556-a4ed-4fc65bb6dd25',
          versionNumber: 2,
          createdAt: '2025-07-03T10:00:00Z',
          updatedAt: '2025-07-03T11:00:00Z',
          tag: 'Assessment change status 2',
        },
        {
          uuid: '82c1af99-0efb-44f1-ae64-0e3506e3ab5f',
          versionNumber: 0,
          createdAt: '2025-07-02T09:00:00Z',
          updatedAt: '2025-07-02T09:30:00Z',
          tag: 'Assessment change status 1',
        },
      ]
      expect(res.locals.previousVersions).toEqual(expectedVersions)
    })

    it('should pass API errors to next', async () => {
      const mockError = new Error('TEST API error')

      mockFetchAssessmentVersions.mockRejectedValue(mockError)

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
