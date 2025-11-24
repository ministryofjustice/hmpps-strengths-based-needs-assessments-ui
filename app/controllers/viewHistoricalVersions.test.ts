import { NextFunction, Request, Response } from 'express'
import StrengthsBasedNeedsAssessmentsApiService, {
  AssessmentResponse,
} from '../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService from '../../server/services/arnsHandoverService'
import viewHistoricalVersions from './viewHistoricalVersions'

jest.mock('../../server/services/strengthsBasedNeedsService')

jest.mock('../../server/services/arnsHandoverService')

describe('viewHistoricalVersions', () => {
  const session = {
    save: jest.fn(),
  }

  const req = {
    session,
    params: {},
  } as unknown as Request

  const res = {
    locals: { user: { token: 'mockToken' } },
    redirect: jest.fn(),
  } as unknown as Response

  const next = jest.fn() as NextFunction

  const assessmentUUID = crypto.randomUUID()
  const assessmentVersionUUID = crypto.randomUUID()
  const fetchAssessment = StrengthsBasedNeedsAssessmentsApiService.prototype.fetchAssessmentVersion as jest.Mock

  beforeEach(() => {
    ;(ArnsHandoverService.prototype.getContextData as jest.Mock).mockReset()
    fetchAssessment.mockReset().mockResolvedValue({
      assessment: {},
      metaData: { formVersion: '1.0', uuid: assessmentUUID, versionUuid: assessmentVersionUUID },
    } as AssessmentResponse)

    res.redirect = jest.fn()
    session.save = jest.fn(cb => cb())
  })

  it('redirects to the view historic accommodation tasks page', async () => {
    ;(ArnsHandoverService.prototype.getContextData as jest.Mock).mockResolvedValue({
      assessmentContext: { assessmentId: assessmentUUID },
      principal: { accessMode: 'READ_WRITE' },
      handoverSessionId: 'mockSessionId',
      subject: {},
    })

    const contextData = {
      assessmentContext: { assessmentId: assessmentUUID },
      principal: { accessMode: 'READ_WRITE' },
      handoverSessionId: 'mockSessionId',
      subject: {},
    }
    req.session.handoverContext = contextData

    await viewHistoricalVersions(req, res, next)

    expect(session.save).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`/form/view-historic/${assessmentVersionUUID}/accommodation-tasks`)
  })
})
