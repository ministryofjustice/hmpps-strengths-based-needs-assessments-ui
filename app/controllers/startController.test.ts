import { NextFunction, Request, Response } from 'express'
import startController from './startController'
import { AssessmentResponse } from '../../server/services/strengthsBasedNeedsService'

jest.mock('./saveAndContinue.utils', () => ({
  isReadOnly: jest.fn(() => false),
}))

jest.mock('../../server/services/strengthsBasedNeedsService', () => {
  return jest.fn().mockImplementation(() => ({
    fetchAssessment: jest.fn().mockResolvedValue({
      assessment: {},
      metaData: { formVersion: '1.0' },
    } as AssessmentResponse),
  }))
})

jest.mock('../../server/services/arnsHandoverService', () => {
  return jest.fn().mockImplementation(() => ({
    getContextData: jest.fn().mockResolvedValue({
      assessmentContext: { assessmentId: 'mockAssessmentId' },
      principal: { accessMode: 'READ_WRITE' },
      handoverSessionId: 'mockSessionId',
      subject: {},
    }),
  }))
})

describe('startController', () => {
  const saveMock = jest.fn(cb => cb())

  const sessionMock = {
    save: saveMock,
  }

  const mockReq = {
    session: sessionMock,
  } as unknown as Request

  const mockRes = {
    locals: { user: { token: 'mockToken' } },
    redirect: jest.fn(),
  } as unknown as Response

  const mockNext = jest.fn() as NextFunction

  it('redirects to the edit mode landing page when user is not in read-only mode', async () => {
    await startController(mockReq, mockRes, mockNext)

    expect(saveMock).toHaveBeenCalled()
    expect(mockRes.redirect).toHaveBeenCalledWith('/form/1/0/close-anything-not-needed-before-appointment')
  })
})
