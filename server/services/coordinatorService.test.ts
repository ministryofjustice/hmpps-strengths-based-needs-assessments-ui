import CoordinatorApiService, { VersionsResponse } from './coordinatorService'
import getHmppsAuthClient from '../data/index'
import RestClient from '../data/restClient'
import config from '../config'
import clearAllMocks = jest.clearAllMocks

jest.mock('../data/index')
jest.mock('../data/restClient')
jest.mock('../data/hmppsAuthClient')

describe('CoordinatorApiService', () => {
  const mockToken = 'mock-token'
  const mockAssessmentUuid = crypto.randomUUID()
  const mockVersionsResponse: VersionsResponse = {
    versions: {
      '2025-07-03': {
        description: 'Test description',
        assessmentVersions: [
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

  const mockGet = jest.fn()
  const mockRestClientInstance = { get: mockGet }

  const mockAuthClient = {
    getSystemClientToken: jest.fn().mockResolvedValue(mockToken),
  }

  beforeEach(() => {
    ;(getHmppsAuthClient as jest.Mock).mockReturnValue(mockAuthClient)
    ;(RestClient as jest.Mock).mockImplementation(() => mockRestClientInstance)
    mockGet.mockResolvedValue(mockVersionsResponse)
  })

  afterEach(() => {
    clearAllMocks()
  })

  describe('CoordinatorApiService.fetchAssessmentAndPlanVersions', () => {
    it('should call auth client, create new RestClient and fetch versions', async () => {
      const service = new CoordinatorApiService()

      const result = await service.fetchAssessmentAndPlanVersions(mockAssessmentUuid)

      expect(mockAuthClient.getSystemClientToken).toHaveBeenCalledTimes(1)
      expect(RestClient).toHaveBeenCalledWith('Coordinator API Client', config.apis.coordinatorApi, mockToken)
      expect(mockGet).toHaveBeenCalledWith({ path: `/entity/versions/${mockAssessmentUuid}` })
      expect(result).toEqual(mockVersionsResponse)
    })

    it('throws an error if the request fails', async () => {
      const service = new CoordinatorApiService()
      const error = new Error('TEST error')
      mockGet.mockRejectedValue(error)

      await expect(service.fetchAssessmentAndPlanVersions(mockAssessmentUuid)).rejects.toThrow('TEST error')
      expect(mockAuthClient.getSystemClientToken).toHaveBeenCalledTimes(1)
      expect(mockGet).toHaveBeenCalled()
    })
  })
})
