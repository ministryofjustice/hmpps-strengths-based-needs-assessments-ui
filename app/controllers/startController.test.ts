import { NextFunction, Request, Response } from 'express'
import startController from './startController'
import StrengthsBasedNeedsAssessmentsApiService, {
  AssessmentResponse,
} from '../../server/services/strengthsBasedNeedsService'
import ArnsHandoverService from '../../server/services/arnsHandoverService'

jest.mock('../../server/services/strengthsBasedNeedsService')

jest.mock('../../server/services/arnsHandoverService')

describe('startController', () => {
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
  const fetchAssessment = StrengthsBasedNeedsAssessmentsApiService.prototype.fetchAssessment as jest.Mock

  beforeEach(() => {
    ;(ArnsHandoverService.prototype.getContextData as jest.Mock).mockReset()
    fetchAssessment.mockReset().mockResolvedValue({
      assessment: {},
      metaData: { formVersion: '1.0', uuid: assessmentUUID, versionUuid: assessmentVersionUUID },
    } as AssessmentResponse)

    res.redirect = jest.fn()
    session.save = jest.fn(cb => cb())
  })

  it('redirects to the edit mode landing page when user is not in read-only mode', async () => {
    ;(ArnsHandoverService.prototype.getContextData as jest.Mock).mockResolvedValue({
      assessmentContext: { assessmentId: assessmentUUID },
      principal: { accessMode: 'READ_WRITE' },
      handoverSessionId: 'mockSessionId',
      subject: {},
    })

    await startController(req, res, next)

    expect(session.save).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(
      `/form/edit/${assessmentUUID}/close-any-other-applications-before-appointment`,
    )
    expect(fetchAssessment).toHaveBeenCalledWith(assessmentUUID, undefined)
  })

  it('redirects to the view mode landing page when user is in read-only mode', async () => {
    ;(ArnsHandoverService.prototype.getContextData as jest.Mock).mockResolvedValue({
      assessmentContext: { assessmentId: assessmentUUID, assessmentVersion: 3 },
      principal: { accessMode: 'READ_ONLY' },
      handoverSessionId: 'mockSessionId',
      subject: {},
    })

    await startController(req, res, next)

    expect(session.save).toHaveBeenCalled()
    expect(res.redirect).toHaveBeenCalledWith(`/form/view/${assessmentVersionUUID}/accommodation-analysis`)
    expect(fetchAssessment).toHaveBeenCalledWith(assessmentUUID, 3)
  })
})
